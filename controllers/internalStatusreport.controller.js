const { performance } = require('perf_hooks');
const PDFInternalStatusreportGenerator = require('../helpers/pdf_templates/internalStatus_template');
const { getCurrentDateFormatted } = require('../utilities/time.utility');
const { reportStatusUtility } = require("../utilities/shift_utility");
const { scanDynamoDBAllRows } = require('../repositories/dynamodb_repository');

//get first row data 

const { datastatusDefinitionsLeft, datastatusDefinitionsRight } = require('../resources/data.resource');

exports.Statusreportcontroller = async (req, res) => {
    try {
        console.log('Route : Internal Status report controller -: ');
        const start = performance.now();

        const reports = await scanDynamoDBAllRows();

        // Sort reports by the number of scales in the Telegramscales array
        reports.sort((a, b) => a.Telegramscales.length - b.Telegramscales.length);


        let reportData = [];

        let item, startTime, endTime, sitename, chatId, scales, shift = 'day',plcIccid;
        let triggerStart ="00:00",triggerEnd= "04:00";

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

        let headerTitle = getCurrentDateFormatted() + ' ,  ' + triggerStart +'-  ' + triggerEnd;

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

            if (!plcIccid) {
                let siteData = await reportStatusUtility(startTime, endTime, triggerStart, triggerEnd, scales, shift)
              
                processSiteData(siteData); // Process first iteration
                reportData.push({ 'sitename': sitename, 'siteData': siteData[0] });
            }

        
        }

        

        //assign counts

        datastatusDefinitionsLeft[0][1].text=counts['offline'];
        datastatusDefinitionsLeft[1][1].text=counts['iot offline'];
        datastatusDefinitionsLeft[2][1].text=counts['critical'];
        datastatusDefinitionsLeft[3][1].text=counts['decreased'];


        datastatusDefinitionsRight[0][1].text=counts['reset'];
        datastatusDefinitionsRight[1][1].text=counts['surpassed'];
        datastatusDefinitionsRight[2][1].text=counts['exceeded'];
        datastatusDefinitionsRight[3][1].text=counts['shiftons reset'];
  
       await PDFInternalStatusreportGenerator(headerTitle, reportData);



        const end = performance.now();
        console.log(`Execution time: ${end - start} milliseconds`);

        res.status(200).send('Data Published');
    } catch (error) {
        console.error('Error in Status report controller:', error);
        res.status(500).send('Internal server error');
    }
}
