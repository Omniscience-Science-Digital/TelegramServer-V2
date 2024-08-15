const { performance } = require('perf_hooks');
const { singleScale, seriesScale, parallelScale, plcScale } = require("../utilities/shift_utility");
const { dertemine_numberofShifts, getCurrentDateFormatted } = require('../utilities/time.utility');
const { populateObjects } = require('../services/telegram.service');
const { headers_helper } = require('../helpers/headers.helper');
const { canvas } = require('../resources/static.headers.resource');

exports.reportdata = async (sites, shift) => {
    console.log('Route : Shift controller -: ', shift);
    const start = performance.now();

    let items = sites;

    // Function to process each site
    const processSite = async (item) => {
        let itemResult = {}; // Object to store the result of this site

        let startTime, endTime, sitestatus, sitename, runningtph, maxUtilization, chatId, totalMonthTarget, allmtds, scaleType, flowtitle, flowiccid, plcIccid, scales, reportTo, email;

        sitestatus = item.sitestatus.BOOL;
        sitename = item.sitename?.S || '';

        // Don't run if not allowed
        if (!sitestatus) return;

       // if (sitename!=='Masama') return;

        console.log(sitename + ' : ');

        // Get current running date
        let enddate = getCurrentDateFormatted();

        // Handle shift times
        startTime = shift === 'day' ? item.dayStart?.S || '' :
            shift === 'night' ? item.nightStart?.S || '' :
                shift === 'day2' ? item.extraShiftStart?.S || '' : '';

        endTime = shift === 'day' ? item.dayStop?.S || '' :
            shift === 'night' ? item.nightStop?.S || '' :
                shift === 'day2' ? item.extraShiftStop?.S || '' : '';

        
        
        shift =(shift==='day2')?shift='day':shift;


        chatId = item.telegramid?.S || '';
        allmtds = item.allmtds?.S || '';
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

        const primaryScalesArray = primaryScales?.L?.map((scale) => scale.S) || [];
        const plcflowArray = parseScales(plcFlow);
        const cyclonegraphArray = parseScales(cyclonegraph);

        const formattedDate = new Date(monthstart).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const startDay = formattedDate + ' ,' + (item.dayStart?.S || '');

        try {
            let reportDataArray;

            if (scaleType === 'single') {
                console.log('Processing single scale type'); // Additional log for debugging
                reportDataArray = await singleScale(startTime, endTime, scales, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);
            } else if (scaleType === 'series') {
                console.log('Processing series scale type'); // Additional log for debugging
                reportDataArray = await seriesScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);
            } else if (scaleType === 'parallel') {
                console.log('Processing parallel scale type'); // Additional log for debugging
                reportDataArray = await parallelScale(startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);
            } else if (plcIccid) {
                console.log('Processing plc scale type'); // Additional log for debugging
                reportDataArray = await plcScale(startTime, endTime, scales, plcIccid, plcflowArray, cyclonegraphArray, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints, shifts_Ran);
            }


            // Handle headers objects
            const reportDateTime = await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);

            await populateObjects(reportDataArray, chatId, sitename, reportHeaderRenames, reportDateTime, reportTo, email);

            itemResult = {
                sitename,
                reportDataArray,
                reportDateTime,
            };
        } catch (error) {
            console.error(`Error processing ${sitename}:`, error);
            
        }

        return itemResult; // Return the result for this site
    };

    // Use Promise.all to process all sites concurrently and collect results
    const results = await Promise.all(items.map(item => processSite(item)));


    const end = performance.now();
    console.log(`Execution time: ${end - start} milliseconds`);
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
};
