const { getFlowValues,getPlcFlowValues,getPlcCycloneValues } = require('../repositories/postgress_repository');
const { generateAndSaveLineChart } = require('../helpers/charts/chart_helper');

module.exports.flowutility = async (startTime, endTime, startdate, enddate, scales, canvas) => {



    // // Use Promise.all for parallel processing
    const reportPromises = scales.map(async (scale) => {
        // Check if the required properties exist
        if (!scale.scaleName || !scale.scaleName.S || !scale.iccid || !scale.iccid.S) {
            console.error('Missing properties in scale for flow graph plot:', scale);
            return { key: 'Unknown', error: 'Missing properties' };  // Return a default object to avoid breaking the map
        }
        const data = {
            scaleName: scale.scaleName.S,
            iccid: scale.iccid.S,

        };
        const key = data.scaleName;
        const iccid = data.iccid;


        try {



            let myflowData = await getFlowValues(startTime, endTime, startdate, enddate, iccid);


            return { key, data: myflowData };  // Use key instead of iccid
        } catch (error) {
            // Log or handle individual errors
            console.error(`Error for ICCID ${iccid}:`, error);
            return { key, error: error.message };  // Use key instead of iccid
        }
    });


    // Wait for all promises to resolve
    var flowDataArray = await Promise.all(reportPromises);




    var flowImage = await generateAndSaveLineChart("flow", flowDataArray, canvas)
        .catch(error => {
            console.error('Error generating and saving line chart:', error);
        });


    return flowImage;




}


module.exports.flowDataPLC = async(startTime, endTime,startdate,enddate, plcflowArray, canvas,plcIccid)=>{

    
    
    // // Use Promise.all for parallel processing
    const reportPromises = plcflowArray.map(async (scale) => {
    const key = Object.keys(scale)[0];
    const title = scale[key];


   
    try {
        
        let myflowData=await getPlcFlowValues(startTime, endTime, startdate, enddate,title, plcIccid);

    
        return { key, data: myflowData };  // Use key instead of iccid
    } catch (error) {
        // Log or handle individual errors
        console.error(`Error for ICCID ${plcIccid}:`, error);
        return { key, error: error.message };  // Use key instead of iccid
    }
});

    // Wait for all promises to resolve
    var flowDataArray = await Promise.all(reportPromises);

   
    var flowImage = await generateAndSaveLineChart("flow",flowDataArray,canvas,startTime,endTime)

    


    return flowImage;
    
}



module.exports.cycloneDataPLC = async(postgress_start, postgress_end, startdate, enddate, cyclonegraph, canvas,plcIccid)=>{

    
    // // Use Promise.all for parallel processing
    const reportPromises = cyclonegraph.map(async (scale) => {
    const key = Object.keys(scale)[0];
    const title = scale[key];

  
    try {
        
        let myflowData = await getPlcCycloneValues(postgress_start, postgress_end, startdate, enddate,title, plcIccid);

   

        
        return { key, data: myflowData };  // Use key instead of iccid
    } catch (error) {
        // Log or handle individual errors
        console.error(`Error for ICCID ${plcIccid}:`, error);
        return { key, error: error.message };  // Use key instead of iccid
    }
});

    // Wait for all promises to resolve
    var flowDataArray = await Promise.all(reportPromises);

    var flowImage = await generateAndSaveLineChart("flow2",flowDataArray,canvas,postgress_start,postgress_end)


    return flowImage;
    
}
