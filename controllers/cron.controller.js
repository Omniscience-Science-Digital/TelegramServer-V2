const { singleScale, seriesScale, parallelScale, plcScale } = require("../utilities/shift_utility");
const { dertemine_numberofShifts, getCurrentDateFormatted } = require('../utilities/time.utility');
const { populateObjects } = require('../services/telegram.service');
const { headers_helper } = require('../helpers/headers.helper');
const { canvas } = require('../resources/static.headers.resource');

exports.reportdata = async (sites, shift) => {
    console.log('Route : Shift controller -: ', shift);

    let reportDataArray;

    let item, startTime, sitestatus, dayStart, primaryScalesArray, endTime, sitename, runningtph, maxUtilization, chatId, totalMonthTarget, startDay, scaleType, flowtitle, flowiccid, plcIccid, scales;

    let items = sites;

    // Destructure sites
    for (let index = 0; index < items.length; index++) {
        item = sites[index];

        sitestatus = item.sitestatus.BOOL;
        sitename = item.sitename?.S || '';

        // Don't run if not allowed
        if (!sitestatus) continue;

    

      // if(sitename!=="Masama")continue;

        console.log(sitename + ' : ');

        // Get current running date
        let enddate = getCurrentDateFormatted();

        
        if (shift === 'day') {
            startTime = item.dayStart?.S || '';
            endTime = item.dayStop?.S || '';
        } else if (shift === 'night') {
            startTime = item.nightStart?.S || '';
            endTime = item.nightStop?.S || '';
        }else if (shift === 'day2') {
            startTime = item.extraShiftStart?.S || '';
            endTime = item.extraShiftStop?.S || '';
        }

        //check if report runs 24 hours


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
   
            const reportDateTime= await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);

            await populateObjects(reportDataArray, chatId, sitename, reportHeaderRenames,reportDateTime);
        } catch (error) {
            console.error(`Error processing ${sitename}:`, error); // Log the error for the current site
            // Optionally continue to the next iteration without stopping the loop
            continue;
        }
    }
};


exports.reportdataeXtraShift = async (sites, shift) => {
    console.log('Route : Shift controller -: ', shift);

    let reportDataArray;

    let item, startTime,  sitestatus, dayStart, primaryScalesArray, endTime, sitename, runningtph, maxUtilization, chatId, totalMonthTarget, startDay, scaleType, flowtitle, flowiccid, plcIccid, scales;

    let items = sites;

    // Destructure sites
    for (let index = 0; index < items.length; index++) {
        item = sites[index];

        sitestatus = item.sitestatus.BOOL;
        sitename = item.sitename?.S || '';

        // Don't run if not allowed
        if (!sitestatus) continue;

        console.log(sitename + ' : ');

        // Get current running date
        let enddate = getCurrentDateFormatted();

        
        if (shift === 'day') {
            startTime = item.extraShiftStart?.S || '';
            endTime = item.extraShiftStop?.S || '';
        } 

        //check if report runs 24 hours


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
           const reportDateTime= await headers_helper(shift, reportDataArray, monthstart, endTime, startTime);

        
            await populateObjects(reportDataArray, chatId, sitename, reportHeaderRenames,reportDateTime);
        } catch (error) {
            console.error(`Error processing ${sitename}:`, error); // Log the error for the current site
            // Optionally continue to the next iteration without stopping the loop
            continue;
        }
    }
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
