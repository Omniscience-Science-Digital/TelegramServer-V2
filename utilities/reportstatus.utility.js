const { graphQueryModbus } = require('../repositories/internalreport.repository');

async function internalreportStatusCalcsFunc( startTime, endTime,triggerStart,triggerEnd,  startdate, enddate,scales) {


    let reportData=[];
//get scale data using promises

for (const scale of scales) {
    // Extract scaleName, iccid, and openingScaletons from the scale object

    const data = {
        scaleName: scale.scaleName.S,
        iccid: scale.iccid.S,
        
    };

    

     let reportSiteData = await graphQueryModbus(startTime, endTime,triggerStart ,triggerEnd,startdate,enddate,data.iccid);


     reportSiteData.unshift(data.scaleName);


     reportData.push(reportSiteData)
     

    
}




return reportData;

}


module.exports = { internalreportStatusCalcsFunc }
