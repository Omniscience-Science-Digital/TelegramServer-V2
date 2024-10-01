const { performance } = require('perf_hooks');
const PDFInternalStatusreportGenerator = require('../helpers/pdf_templates/internalStatus_template');
const { getCurrentDateFormatted } = require('../utilities/time.utility');
const { reportStatusUtility, reportStatusUtilityPlc } = require("../utilities/shift_utility");
const { scanDynamoDBAllRows } = require('../repositories/dynamodb_repository');

const handleTelegramNotification = require('../helpers/telegram/telegram.helper')

//get first row data 
const { datastatusDefinitionsLeft, datastatusDefinitionsRight } = require('../resources/data.resource');

exports.Statusreportcontroller = async (triggerStart, triggerEnd, shift) => {
    try {
        console.log('Route : Internal Status report controller -: ');
        const start = performance.now();

        const reports = await scanDynamoDBAllRows();



        // Sort reports by the number of scales in the Telegramscales array
        reports.sort((a, b) => {
            const aLength = Array.isArray(a.Telegramscales) ? a.Telegramscales.length : 0; // Check if Telegramscales exists
            const bLength = Array.isArray(b.Telegramscales) ? b.Telegramscales.length : 0; // Check if Telegramscales exists
            return aLength - bLength;
        });



        let reportData = [];

        let item, startTime, endTime, sitename, scales, plcIccid;

        let  chatIdTest = '-4019893816'

        let chatId=process.env.DIGITALPUTONSLACK;


        // Initialize a counter object outside of the loop
        const counts = {
            'exceeded': 0,   // Index 1
            'critical': 0,   // Index 2
            'offline': 0,     // Index 3
            'decreased': 0,      // Index 4
            'reset': 0,      // Index 5
            'surpassed': 0,  // Index 6
            'iot offline': 0,    // Index 7
            'shiftons reset': 0     // Index 8
        };

        // Define the status we want to count and their corresponding indices
        const statusIndices = {
            'exceeded': 1,   // Index 1
            'critical': 2,   // Index 2
            'offline': 3,     // Index 3
            'decreased': 4,      // Index 4
            'reset': 5,      // Index 5
            'surpassed': 6,  // Index 6
            'iot offline': 7,    // Index 7
            'shiftons reset': 8     // Index 8
        };

        let headerTitle = getCurrentDateFormatted() + ' ,  ' + triggerStart + '-  ' + triggerEnd;

        // Function to count statuses in a given siteData array
        const countStatuses = (siteData) => {
            siteData.forEach(subArray => {

                // Loop through the indices we want to count
                Object.entries(statusIndices).forEach(([status, index]) => {


                    // Check if the index exists in the subArray
                    if (subArray[index] === status) {
                        counts[status]++;
                    }
                });
            });
        };

        const processSiteData = (siteData) => {
            countStatuses(siteData[0]); // Call the function for each siteData in the iteration
        };


        // Destructure sites
        for (let index = 0; index < reports.length; index++) {

            item = reports[index];
            sitename = item.sitename?.S || '';

            //  if (sitename !== 'Mzimkhulu') continue;


            console.log('---------------------------------------------------------');
            console.log(sitename);
            console.log('Site Count' + ' : ' + (index + 1) + '/' + (reports.length));


            plcIccid = item.plcIccid?.S || '';

            // Handle shift times
            startTime = shift === 'day' ? item.dayStart?.S || '' :
                shift === 'night' ? item.nightStart?.S || '' :
                    shift === 'day2' ? item.extraShiftStart?.S || '' : '';

            endTime = shift === 'day' ? item.dayStop?.S || '' :
                shift === 'night' ? item.nightStop?.S || '' :
                    shift === 'day2' ? item.extraShiftStop?.S || '' : '';



            shift = (shift === 'day2') ? shift = 'day' : shift;



            //check if report runs 24 hours

            scales = item.Telegramscales || [];

            let siteData;

            siteData = plcIccid
                ? await reportStatusUtilityPlc(startTime, endTime, triggerStart, triggerEnd, scales, plcIccid, shift)
                : await reportStatusUtility(startTime, endTime, triggerStart, triggerEnd, scales, shift);



            reportData.push({ 'sitename': sitename, 'siteData': siteData[0] });
            processSiteData(siteData); // Process first iteration
        }



        const leftKeys = ['offline', 'iot offline', 'critical', 'decreased'];
        const rightKeys = ['reset', 'surpassed', 'exceeded', 'shiftons reset'];

        leftKeys.forEach((key, index) => {
            datastatusDefinitionsLeft[index][1].text = counts[key];
        });

        rightKeys.forEach((key, index) => {
            datastatusDefinitionsRight[index][1].text = counts[key];
        });


        const reportBuffer = await PDFInternalStatusreportGenerator(headerTitle, reportData);
        var timeformat = getCurrentDateFormatted() + ' ' + triggerEnd;
        var current_date = `${timeformat}, Status.pdf`;

        

        // send report
       await handleTelegramNotification(chatId, reportBuffer, current_date);

        const end = performance.now();
        console.log(`Execution time: ${end - start} milliseconds`);

    } catch (error) {
        console.error('Error in Status report controller:', error);

    }
}
