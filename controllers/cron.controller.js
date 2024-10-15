const { performance } = require('perf_hooks');
const { singleScale, seriesScale, parallelScale, plcScale,plcParallelScale } = require("../utilities/shift_utility");
const { dertemine_numberofShifts, getCurrentDateFormatted } = require('../utilities/time.utility');
const { populateObjects } = require('../services/telegram.service');
const { headers_helper } = require('../helpers/headers.helper');
const {parseScales}= require('../helpers/scalesCalc.helper');
const { canvas } = require('../resources/static.headers.resource');

exports.reportdata = async (sites, shift, flag) => {
    console.log('Route : Shift controller -: ', shift);
    const start = performance.now();

    let reportDataArray;

    let item, startTime,  dayStart, primaryScalesArray, endTime, sitename, runningtph, maxUtilization, chatId, totalMonthTarget, scaleType, flowtitle, flowiccid, plcIccid, scales, reportTo, email;

    let items = sites;

    // Destructure sites
    for (let index = 0; index < items.length; index++) {
        item = sites[index];

        sitename = item.sitename?.S || '';

         if (sitename !== 'Blouhoogte Plant 1') continue;


        console.log('sitename' + ' : '+sitename);

        // Get current running date
        let enddate = getCurrentDateFormatted();




        // Handle shift times
        startTime = shift === 'day' ? item.dayStart?.S || '' :
            shift === 'night' ? item.nightStart?.S || '' :
                shift === 'day2' ? item.extraShiftStart?.S || '' : '';

        endTime = shift === 'day' ? item.dayStop?.S || '' :
            shift === 'night' ? item.nightStop?.S || '' :
                shift === 'day2' ? item.extraShiftStop?.S || '' : '';



        shift = (shift === 'day2') ? shift = 'day' : shift;

        //check if report runs 24 hours


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
        reportTo = item.reportTo?.S || '';
        email = item.email?.S || '';


        const { mtd_target, shifts_Ran } = dertemine_numberofShifts(item.dayStart?.S, item.nightStart?.S, item.extraShiftStart?.S, totalMonthTarget, monthstart, shift, enddate);

        // Destructure fore arrays and objects
        const { formulas, primaryScales, virtualDatapoints, reportHeaderRenames, cyclonegraph, plcFlow } = item;

        scales = item.Telegramscales || [];

        

        primaryScalesArray = primaryScales?.L?.map((scale) => scale.S) || [];
        const plcflowArray = parseScales(plcFlow);
        const cyclonegraphArray = parseScales(cyclonegraph);

        const formattedDate = new Date(monthstart).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        startDay = formattedDate + ' ,' + dayStart;


        try {
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
                   
                    reportDataArray = await plcParallelScale(startTime, endTime, scales, plcIccid, plcflowArray,flowtitle, flowiccid, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                } else {
                    console.log('Processing plc  scale type'); // Additional log for debugging
                    reportDataArray = await plcScale(startTime, endTime, scales, plcIccid, plcflowArray, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints);
                }
            }
        
            // Additional header handling if needed
            let { reportnameDate, reportDateTime } = await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);
            await populateObjects(reportDataArray, chatId, sitename, reportHeaderRenames, reportDateTime, reportTo, email, reportnameDate, flag);
        
        } catch (error) {
            console.error(`Error processing ${sitename}:`, error);
            // Optionally continue to the next iteration without stopping the loop
            continue;
        }
        
    }

    const end = performance.now();
    console.log(`Execution time: ${end - start} milliseconds`);
};



