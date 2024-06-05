const { singleScaleFlow, runtimeFlow, ActualStart, ActualEnd, runtimeAccumulatingSingleFlow } = require('../repositories/postgress_repository');
const { calculateTotalHours, addTwoHours } = require("./time.utility");

async function singlecaleCalcsFunc(shift, shifts_Ran, monthstart, shift, startTime, endTime, startdate, enddate, runningtph, maxUtilization, scales, primaryScalesArray) {
    try {

        const primaryScaleIccid = scales.find(scale => scale.scaleName.S === primaryScalesArray[0]).iccid.S;

        // Get flow values
        let flowvalues = await singleScaleFlow(startTime, endTime, startdate, enddate, primaryScaleIccid, runningtph)


    
        // // Calculate max utilization
        var { total_count, average_flow, count_above_runningflow, average_flow_above_runningflow, sum_above_runningflow, availability } = flowvalues;

    

        if (isNaN(availability) || availability < 0 || !isFinite(availability)) {
            availability = 0;
        }

        availability = ((parseFloat(availability)) * 100).toFixed(2);

        // utilisation = (Sum of all Flow Values above {Running_tph} divided by the count of Flow Values above {Running_tph} * {Max_Utilization})
        var utilisation = (((parseFloat(flowvalues['sum_above_runningflow'])) / (parseFloat(flowvalues['count_above_runningflow']) * maxUtilization)) * 100).toFixed(2);


        if (isNaN(utilisation) || utilisation < 0 || !isFinite(utilisation)) {
            utilisation = 0;
        }

        // // Calculate run times
        let runtime,mtdruntime

        // // Get shift hours
        var { hours, minutes } = calculateTotalHours(startTime, endTime);

     


            var flowstarttime = (shift == 'night') ? endTime : startTime;

           // hours = parseFloat(hours * shifts_Ran)
            //if it's accumulating 
            mtdruntime = await runtimeAccumulatingSingleFlow(flowstarttime, endTime, monthstart, enddate, runningtph, primaryScaleIccid);

            runtime = await runtimeFlow(startTime, endTime, startdate, enddate, runningtph, primaryScaleIccid);

        
  



        const sum_of_time_delta_in_hours = runtime[0]?.sum_of_time_delta_in_hours || 0;
        const sum_of_time_delta_in_mtd_hours = mtdruntime[0]?.sum_of_time_delta_in_hours || 0;
        var uptime = parseFloat(sum_of_time_delta_in_hours);


        var actualruntime = parseFloat(uptime / hours) * 100;

        // // Start and end times
        let earliestTimes = [], laterTimes = [];

        const promises = primaryScalesArray.map(async primaryScale => {
            try {
                const foundScale = scales.find(scale => scale.scaleName.S === primaryScale);
                if (foundScale) {
                    const iccid = foundScale.iccid.S;
                    const actualStartforAll_iccids = await ActualStart(startTime, endTime, startdate, enddate, runningtph, iccid);
                    const actualEndforAll_iccids = await ActualEnd(startTime, endTime, startdate, enddate, runningtph, iccid);

                    if (actualStartforAll_iccids[0]) {
                        const earliestTime = actualStartforAll_iccids[0].first_time_above_10;
                        if (earliestTime !== null) earliestTimes.push(earliestTime);
                    }

                    if (actualEndforAll_iccids[0]) {
                        const laterTime = actualEndforAll_iccids[0].last_time_above_10;
                        if (laterTime !== null) laterTimes.push(laterTime);
                    }
                }
            } catch (err) {
                console.error(`Error processing primary scale ${primaryScale}:`, err);
            }
        });

        await Promise.all(promises);

        var earliestTime = earliestTimes.length > 0 ?
            new Date(Math.min(...earliestTimes.filter(time => time !== null).map(time => new Date(time).getTime()))).toLocaleTimeString('en-GB', { hour12: false }) :
            ' ';

        var latestTime = laterTimes.length > 0 ?
            new Date(Math.max(...laterTimes.filter(time => time !== null).map(time => new Date(time).getTime()))).toLocaleTimeString('en-GB', { hour12: false }) :
            ' ';

        var starttime = earliestTime !== ' ' ? addTwoHours(earliestTime) : ' ';
        var endtime = latestTime !== ' ' ? addTwoHours(latestTime) : ' ';

        var singleflow = {
            'availability': parseFloat(availability).toFixed(2),
            'maxUtilization': parseFloat(utilisation).toFixed(2),
            'uptime': parseFloat(uptime).toFixed(2),
            'actualruntime': parseFloat(actualruntime).toFixed(2),
            'mtdruntime':parseFloat(sum_of_time_delta_in_mtd_hours).toFixed(2),
            'starttime': starttime,
            'endtime': endtime,
        }

        return singleflow;
    } catch (error) {
        console.error(`Error in seriescaleCalcsFunc:`, error);
        throw error; // Optionally rethrow to propagate the error further
    }
}


module.exports = { singlecaleCalcsFunc }
