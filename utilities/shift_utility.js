const { subtractTwoHours, getCurrentDateFormatted, getPreviousDateFormatted } = require('./time.utility');
const { seriescaleCalcsFunc } = require('./series.scale.utility');
const { singlecaleCalcsFunc } = require('./single.scale.utility');
const { parallelcaleCalcsFunc } = require('./parallel.scale.utility')
const { plcScaleCalcsFunc,plcScale_noTypeCalcsFunc } = require('./plc.scale.utility.js')
const { handleShiftons ,handlePlcShiftons} = require('./shiftons.utility');
const { flowutility ,flowObjectValues,flowDataPLC,flowObjectDataPLC,cycloneDataPLC} = require('./flow.utility');
const { calculatorCalculations } = require('./formulas.utility');
const { createDonutChart } = require('../helpers/charts/chart_helper');
const {samePlantCalc_ProcessScales,clearHashKeys}= require('../helpers/scalesCalc.helper');




//internal report status

const { internalreportStatusCalcsFunc } = require('./reportstatus.utility.js')



module.exports.singleScale = async (startTime, endTime, scales, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints) => {
    try {

        //pass correct dt  time
        var postgress_start = subtractTwoHours(startTime);
        var postgress_end = subtractTwoHours(endTime);

        //get start and  end data 
    

        let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
        let enddate = getCurrentDateFormatted();
     

        //get   flow graphs

        //removing scales from shared plants
        let newscales= samePlantCalc_ProcessScales(scales);

        const myflowBuffer = await flowutility(postgress_start, postgress_end, startdate, enddate, newscales, canvas);

           
        const myflowObject = await flowObjectValues(postgress_start, postgress_end, startdate, enddate,runningtph, newscales);
    
        

        //check if site ran
        let flow_Values = await singlecaleCalcsFunc(shift,monthstart,shift,postgress_start, postgress_end, startdate, enddate, runningtph, maxUtilization, scales, primaryScalesArray)
        
        //handle shift tons 
        let tonnage = await handleShiftons(myflowBuffer, shift, postgress_start, postgress_end, startdate, enddate, scales, monthstart, primaryScalesArray, mtd_target, scaleType, canvas, virtualDatapoints,maxUtilization)

      

        let shiftStats = await calculatorCalculations(formulas, tonnage, flow_Values)
        //plot pie charts


        var shift_statisticsPie = [];
      
        if (tonnage.site_had_production) {
            shift_statisticsPie = await createDonutChart(shiftStats.shiftstats, canvas);

        }


        let cyclonegraphbuffer;

  
        shift_statisticsPie = { shift_statisticsPie }

    
       tonnage= clearHashKeys(tonnage);

        
        const combinedObject = { ...flow_Values,...{cyclonegraphbuffer}, ...tonnage, ...shift_statisticsPie, ...{ primaryScalesArray },...shiftStats,...{myflowObject} };


        return combinedObject;

    } catch (error) {
        console.log(`Error processing  parallel scale in shift utility: ${error} `)
        throw error; // Optionally rethrow to propagate the error further
    }
}

module.exports.seriesScale = async (startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints) => {
    try {

        //pass correct dt  time
        var postgress_start = subtractTwoHours(startTime);
        var postgress_end = subtractTwoHours(endTime);

        //get start and  end data 

        let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
        let enddate = getCurrentDateFormatted();

        //get   flow graphs

        //removing scales from shared plants
        let newscales= samePlantCalc_ProcessScales(scales);


        const myflowBuffer = await flowutility(postgress_start, postgress_end, startdate, enddate, newscales, canvas);

        //check if site ran
        let flow_Values = await seriescaleCalcsFunc(shift,postgress_start, postgress_end, flowtitle, flowiccid, startdate, enddate, runningtph, maxUtilization, scales, primaryScalesArray)

        //perscale flow average , run time and max
        const myflowObject = await flowObjectValues(postgress_start, postgress_end, startdate, enddate,runningtph, newscales);


        //handle shift tons 
        let tonnage = await handleShiftons(myflowBuffer, shift, postgress_start, postgress_end, startdate, enddate, scales, monthstart, primaryScalesArray, mtd_target, scaleType, canvas, virtualDatapoints,maxUtilization)

        let shiftStats = await calculatorCalculations(formulas, tonnage, flow_Values)
        //plot pie charts


        var shift_statisticsPie = [];

        if (tonnage.site_had_production) {
            shift_statisticsPie = await createDonutChart(shiftStats.shiftstats, canvas);

        }

        let cyclonegraphbuffer;
       


        shift_statisticsPie = { shift_statisticsPie }

        tonnage= clearHashKeys(tonnage);

        const combinedObject = { ...flow_Values,...{cyclonegraphbuffer}, ...tonnage, ...shift_statisticsPie, ...{ primaryScalesArray },...shiftStats ,...{myflowObject}};

        return combinedObject;

    } catch (error) {
        console.log(`Error processing  series scale in shift utility: ${error} `)
        throw error; // Optionally rethrow to propagate the error further
    }
}

module.exports.parallelScale = async (startTime, endTime, scales, monthstart, flowtitle, flowiccid, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType, canvas, formulas, virtualDatapoints) => {
    try {


        //pass correct dt  time
        var postgress_start = subtractTwoHours(startTime);
        var postgress_end = subtractTwoHours(endTime);

        //get start and  end data 

        let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
        let enddate = getCurrentDateFormatted();

        
        let newscales= samePlantCalc_ProcessScales(scales);


        //get   flow graphs
        const myflowBuffer = await flowutility(postgress_start, postgress_end, startdate, enddate, newscales, canvas);

        const myflowObject = await flowObjectValues(postgress_start, postgress_end, startdate, enddate,runningtph, newscales);

        //check if site ran
        let flow_Values = await parallelcaleCalcsFunc(shift,postgress_start, postgress_end, flowtitle, flowiccid, startdate, enddate, runningtph, maxUtilization, scales, primaryScalesArray)

        //handle shift tons 
        let tonnage = await handleShiftons(myflowBuffer, shift, postgress_start, postgress_end, startdate, enddate, scales, monthstart, primaryScalesArray, mtd_target, scaleType, canvas, virtualDatapoints,maxUtilization)


        let cyclonegraphbuffer;

        let shiftStats = await calculatorCalculations(formulas, tonnage, flow_Values)
        //plot pie charts

        var shift_statisticsPie = [];
      
        if (tonnage.site_had_production) {
            shift_statisticsPie = await createDonutChart(shiftStats.shiftstats, canvas);

        }


        shift_statisticsPie = { shift_statisticsPie }

        tonnage= clearHashKeys(tonnage);

        const combinedObject = { ...flow_Values,...{cyclonegraphbuffer}, ...tonnage, ...shift_statisticsPie, ...{ primaryScalesArray },...shiftStats ,...{myflowObject}};



        return combinedObject;





    } catch (error) {
        console.log(`Error processing  parallel scale in shift utility: ${error} `)
        throw error; // Optionally rethrow to propagate the error further
    }

}


module.exports.plcScale = async (startTime, endTime, scales,plcIccid,plcFlow,cyclonegraph, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType,canvas,formulas,virtualDatapoints) => {
    try {

       
        //pass correct dt  time
        var postgress_start = subtractTwoHours(startTime);
        var postgress_end = subtractTwoHours(endTime);

        //get start and  end data 

        let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
        let enddate = getCurrentDateFormatted();

        //get   flow graphs

        const myflowBuffer = await flowDataPLC(postgress_start, postgress_end, startdate, enddate, plcFlow, canvas,plcIccid);
        
        let cyclonegraphbuffer = await cycloneDataPLC(postgress_start, postgress_end, startdate, enddate, cyclonegraph, canvas,plcIccid);
  

        
        //check if site ran
        let flow_Values = await plcScale_noTypeCalcsFunc(monthstart,shift,postgress_start, postgress_end, startdate, enddate,plcFlow, runningtph, maxUtilization, scales, primaryScalesArray,plcIccid)
        

        const myflowObject = await flowObjectDataPLC(postgress_start, postgress_end, startdate, enddate, plcFlow,runningtph,plcIccid);
      
        //handle shift tons 
        let tonnage = await handlePlcShiftons(myflowBuffer,plcIccid, shift, postgress_start, postgress_end, startdate, enddate, scales, monthstart, primaryScalesArray, mtd_target, scaleType, canvas, virtualDatapoints,maxUtilization)

   

        let shiftStats = await calculatorCalculations(formulas, tonnage, flow_Values)
        //plot pie charts
  

        var shift_statisticsPie = [];
      
        if (tonnage.site_had_production) {
            shift_statisticsPie = await createDonutChart(shiftStats.shiftstats, canvas);

        }

        

        shift_statisticsPie = { shift_statisticsPie }

        const combinedObject = { ...flow_Values,...{cyclonegraphbuffer}, ...tonnage, ...shift_statisticsPie, ...{ primaryScalesArray },...shiftStats,...{myflowObject} };


        

        return combinedObject;


    } catch (error) {
        console.log(`Error processing  parallel scale in shift utility: ${error} `)
        throw error; // Optionally rethrow to propagate the error further
    }

}


module.exports.plcParallelScale = async (startTime, endTime, scales,plcIccid,plcFlow,flowtitle, flowiccid,cyclonegraph, monthstart, shift, primaryScalesArray, runningtph, maxUtilization, mtd_target, scaleType,canvas,formulas,virtualDatapoints) => {
    try {
  

        //pass correct dt  time
        var postgress_start = subtractTwoHours(startTime);
        var postgress_end = subtractTwoHours(endTime);

        //get start and  end data 

        let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
        let enddate = getCurrentDateFormatted();


        //get   flow graphs
        const myflowBuffer = await flowDataPLC(postgress_start, postgress_end, startdate, enddate, plcFlow, canvas,plcIccid);
    
        let cyclonegraphbuffer ;
  
        
        //check if site ran
        let flow_Values = await plcScaleCalcsFunc(monthstart,shift,postgress_start, postgress_end, startdate, enddate, runningtph, maxUtilization, scales, primaryScalesArray,plcIccid,flowtitle, flowiccid)
        
        
        const myflowObject = await flowObjectDataPLC(postgress_start, postgress_end, startdate, enddate, plcFlow,runningtph,plcIccid);
      
    
        //handle shift tons 
        let tonnage = await handlePlcShiftons(myflowBuffer,plcIccid, shift, postgress_start, postgress_end, startdate, enddate, scales, monthstart, primaryScalesArray, mtd_target, scaleType, canvas, virtualDatapoints,maxUtilization)

       
        let shiftStats = await calculatorCalculations(formulas, tonnage, flow_Values)
        //plot pie charts

        var shift_statisticsPie = [];
        if (tonnage.site_had_production) {
            shift_statisticsPie = await createDonutChart(shiftStats.shiftstats, canvas);

        }

        
        shift_statisticsPie = { shift_statisticsPie }
        const combinedObject = { ...flow_Values,...{cyclonegraphbuffer}, ...tonnage, ...shift_statisticsPie, ...{ primaryScalesArray },...shiftStats,...{myflowObject} };




        return combinedObject;


    } catch (error) {
        console.log(`Error processing  parallel scale in shift utility: ${error} `)
        throw error; // Optionally rethrow to propagate the error further
    }

}



module.exports.reportStatusUtility =async (startTime, endTime,triggerStart,triggerEnd, scales,  shift)=>
{
      //pass correct dt  time
      var postgress_start = subtractTwoHours(startTime);
      var postgress_end = subtractTwoHours(endTime);

    
      //trigger postgress start

      var triggerpostgress_start = subtractTwoHours(triggerStart);
      var triggerpostgress_end = subtractTwoHours(triggerEnd);

 
      //get start and  end data 

      let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
      let enddate = getCurrentDateFormatted();


     let statusData = await internalreportStatusCalcsFunc( triggerpostgress_start,triggerpostgress_end,postgress_start, postgress_end, startdate, enddate,null  , scales);


  
    // Convert it into an array of rows (in this case, 1 row):
    statusData = [statusData];  


      
    return statusData;

}





module.exports.reportStatusUtilityPlc =async (startTime, endTime,triggerStart,triggerEnd, scales,plcIccid,  shift)=>
    {
          //pass correct dt  time
          var postgress_start = subtractTwoHours(startTime);
          var postgress_end = subtractTwoHours(endTime);
    
        
          //trigger postgress start
    
          var triggerpostgress_start = subtractTwoHours(triggerStart);
          var triggerpostgress_end = subtractTwoHours(triggerEnd);
    
     
          //get start and  end data 
    
          let startdate = (shift === 'day') ? getCurrentDateFormatted() : getPreviousDateFormatted();
          let enddate = getCurrentDateFormatted();
    
    

        let statusData = await internalreportStatusCalcsFunc( triggerpostgress_start,triggerpostgress_end,postgress_start, postgress_end, startdate, enddate,plcIccid,  scales);
    
    
      
        // Convert it into an array of rows (in this case, 1 row):
       statusData = [statusData];  
    
    
          
        return statusData;
    
    }