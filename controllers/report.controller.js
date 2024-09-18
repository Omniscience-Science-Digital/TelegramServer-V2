//get site by id
const { scanDynamoDBTablewithname } = require('../repositories/dynamodb_repository');

const { singleScale, seriesScale, parallelScale, plcScale, plcParallelScale } = require("../utilities/shift_utility");
const { dertemine_numberofShifts, getCurrentDateFormatted } = require('../utilities/time.utility');
const { populateObjects } = require('../services/telegram.service');
const { headers_helper } = require('../helpers/headers.helper')
const { parseScales } = require('../helpers/scalesCalc.helper');
const { canvas } = require('../resources/static.headers.resource');


exports.runReportdata = async (req, res) => {

    // Access the id from the request body
    const { PlantName, run_production, shift } = req.body;


    const report = await scanDynamoDBTablewithname(PlantName);

    let reportDataArray;



    let item, startTime, reportTo, email, sitestatus, dayStart, primaryScalesArray, endTime, sitename, runningtph, maxUtilization, totalMonthTarget, startDay, scaleType, flowtitle, flowiccid, plcIccid, scales;


    let items = report;

    let sites = items;


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
            } else if (shift === 'extradayshift') {
                startTime = item.extraShiftStart?.S || '';
                endTime = item.extraShiftStop?.S || '';
            }


            chatId = item.telegramid?.S || '';
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
            reportTo = item.reportTo?.S || '';

            const chartIDTest = '-4019893816';

            const { mtd_target, shifts_Ran } = dertemine_numberofShifts(item.dayStart?.S, item.nightStart?.S, item.extraShiftStart?.S, totalMonthTarget, monthstart, shift, enddate)


            //destructe fore arrays and objects
            const { formulas, primaryScales, virtualDatapoints, reportHeaderRenames, cyclonegraph, plcFlow } = item;
            scales = item.Telegramscales || [];


            primaryScalesArray = primaryScales?.L?.map((scale) => scale.S) || [];
            const plcflowArray = parseScales(plcFlow);
            const cyclonegraphArray = parseScales(cyclonegraph)


            const formattedDate = new Date(monthstart).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            startDay = formattedDate + ' ,' + dayStart;


            if (!plcIccid) {
                switch (scaleType) {
                    case 'single':
                        console.log('Processing single scale type');
                        reportDataArray = await singleScale(startTime, endTime, scales, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                        break;
                    case 'series':
                        console.log('Processing series scale type');
                        reportDataArray = await seriesScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                        break;
                    case 'parallel':
                        console.log('Processing parallel scale type');
                        reportDataArray = await parallelScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                        break;
                }
            } else {
                if (scaleType === 'parallel') {
                    console.log('Processing plc parallel scale type'); // Additional log for debugging

                    reportDataArray = await plcParallelScale(startTime, endTime, scales, plcIccid, plcflowArray, flowtitle, flowiccid, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                } else {
                    console.log('Processing plc  scale type'); // Additional log for debugging
                    reportDataArray = await plcScale(startTime, endTime, scales, plcIccid, plcflowArray, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                }
            }




            let { reportnameDate, reportDateTime } = await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);

            await populateObjects(reportDataArray, chartIDTest, sitename, reportHeaderRenames, reportDateTime, reportTo, email, reportnameDate, "test");
        }
    } catch (error) {
        console.error('Error in reportdata:', error); // Log the error
        throw error; // Optionally rethrow to propagate the error further
    }


    res.status(200).send('Data received');
};




