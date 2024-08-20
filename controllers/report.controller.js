//get site by id
const {scanDynamoDBTablewithname } = require('../repositories/dynamodb_repository');

const { singleScale, seriesScale, parallelScale,plcScale } = require("../utilities/shift_utility");
const { dertemine_numberofShifts, getCurrentDateFormatted } = require('../utilities/time.utility');
const { populateObjects } = require('../services/telegram.service');
const {headers_helper} = require('../helpers/headers.helper')
const {canvas} = require('../resources/static.headers.resource');


exports.runReportdata = async (req, res) => {

    // Access the id from the request body
    const { PlantName,run_production,shift } = req.body;


    const report = await scanDynamoDBTablewithname(PlantName);

    let reportDataArray;
    

   
    let item, startTime, runtime,email, sitestatus, dayStart, primaryScalesArray, endTime, sitename, runningtph, maxUtilization, chatId, totalMonthTarget, startDay, scaleType, flowtitle, flowiccid, plcIccid, scales;


    let items = report;

    let sites =items;


    try {
        // Destructure sites
        for (let index = 0; index < items.length; index++) {
            item = sites[index];

            sitestatus = item.sitestatus.BOOL
            sitename = item.sitename?.S || '';

            //don't run if not allowed
            if (!sitestatus) continue;

            if (!shift) continue;

         

            console.log(sitename + ' : ')

            //get current running date
            let enddate = getCurrentDateFormatted();


            if (shift === 'day') {
                startTime = item.dayStart?.S || '';
                endTime = item.dayStop?.S || '';
            } else if (shift === 'night') {
                startTime = item.nightStart?.S || '';
                endTime = item.nightStop?.S || '';
            }else if (shift === 'extradayshift') 
                {
                    startTime = item.extraShiftStart?.S || '';
                    endTime = item.extraShiftStop?.S || '';
                }

                  //check if report runs 24 hours

        var fullday =(startTime===endTime)?true:false;


            chatId = item.telegramid?.S || '';
            runtime = item.runtime?.N;
            totalMonthTarget = item.TotalmonthTarget?.S || '';
            scaleType = item.scale_type?.S || '';
            monthstart = item.monthstart?.S || '';
            flowtitle = item.flowtitle?.S || '';
            flowiccid = item.flowIccid?.S || '';
            totalMonthTarget = item.monthtarget?.N || '';
            runningtph = item.runningtph?.N || '';
            maxUtilization = item.maxUtilization?.N || '';
            plcIccid = item.plcIccid?.S || '';
            email = item.email?.S || '';

            const chartIDTest ='-4019893816';



            const { mtd_target, shifts_Ran } = dertemine_numberofShifts(item.dayStart?.S, item.nightStart?.S, item.extraShiftStart?.S, totalMonthTarget, monthstart, shift, enddate)



            //destructe fore arrays and objects
            const { formulas, primaryScales, virtualDatapoints, reportHeaderRenames, cyclonegraph, plcFlow } = item;

            scales = item.Telegramscales || [];

            primaryScalesArray = primaryScales?.L?.map((scale) => scale.S) || [];
            const plcflowArray = parseScales(plcFlow);

            const cyclonegraphArray =parseScales(cyclonegraph)

      



            const formattedDate = new Date(monthstart).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            startDay = formattedDate + ' ,' + dayStart;



            if (scaleType === 'single') {
                // Handle single scale type
                console.log('Processing single scale type'); // Additional log for debugging
                reportDataArray = await singleScale(startTime, endTime, scales, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);

            } else if (scaleType === 'series') {
                // Handle series scale type
                console.log('Processing series scale type'); // Additional log for debugging
                reportDataArray = await seriesScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);

            } else if (scaleType === 'parallel') {
                // Handle parallel scale type
                console.log('Processing parallel scale type'); // Additional log for debugging
                reportDataArray = await parallelScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);

            } else if (plcIccid) {
                console.log('Processing plc scale type'); // Additional log for debugging
                reportDataArray = await plcScale(startTime, endTime, scales, plcIccid, plcflowArray, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);

            }



           let {reportnameDate ,reportDateTime}= await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);
                       
           await populateObjects(reportDataArray, chartIDTest, sitename, reportHeaderRenames,reportDateTime,"Telegram",email,reportnameDate,"test");
        }
    } catch (error) {
        console.error('Error in reportdata:', error); // Log the error
        throw error; // Optionally rethrow to propagate the error further
    }
  
  
    res.status(200).send('Data received');
  };
  



const parseScales = (scales) => {

    // Access the L array inside the first element of scales
    const sortedscales = scales?.L[0]?.L || [];

    // Check if sortedscales is an array and map over it
    return Array.isArray(sortedscales) ? sortedscales.map((scale) => {
        // Get the key of the object inside scale.M
        const scaleKey = Object.keys(scale.M)[0];

        // Get the value of the key, assuming it has a nested structure with S property
        const scaleValue = scale.M[scaleKey]?.S || '';

        // Create the scale object
        const scaleObject = {};
        scaleObject[scaleKey] = scaleValue;

        return scaleObject;
    }) : [];
}

