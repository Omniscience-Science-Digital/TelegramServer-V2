const { graphQueryModbus ,graphQueryModbusPlc} = require('../repositories/internalreport.repository');

async function internalreportStatusCalcsFunc( startTime, endTime,triggerStart,triggerEnd,  startdate, enddate,plcIccid,scales) {


    

    let reportData=[];
//get scale data using promises

for (const scale of scales) {
    // Extract scaleName, iccid, and openingScaletons from the scale object

    const data = {
        scaleName: scale.scaleName.S,
        iccid: scale.iccid.S,
        
    };

    let reportSiteData;


    reportSiteData =plcIccid 
    ? await graphQueryModbusPlc(startTime, endTime,triggerStart ,triggerEnd,startdate,enddate,data.iccid,plcIccid)
    :await graphQueryModbus(startTime, endTime,triggerStart ,triggerEnd,startdate,enddate,data.iccid,plcIccid);


     reportSiteData.unshift(data.scaleName);


     reportData.push(reportSiteData)
     

    
}




return reportData;

}


module.exports = { internalreportStatusCalcsFunc }
