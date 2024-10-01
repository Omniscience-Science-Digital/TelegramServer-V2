const cron = require('node-cron');

const { scanDynamoDBTableDay, scanDynamoDBTableNight} = require('./repositories/dynamodb_repository');
const report_controller = require('./controllers/cron.controller');
const Statusreportcontroller = require('./controllers/internalStatusreport.controller');


// Set the time zone to Johannesburg, South Africa (SAST)
const timeZone = 'Africa/Johannesburg';


//type script

let runprod_test ="test";

(async () => {
    try {
    
        // const items = await scanDynamoDBTableDay('22:00');
        // await intternalStatus_controller.Statusreportcontroller( "day", runprod_test);

        // let triggerStart ="00:00",triggerEnd= "12:00",shift='night';
        
        // await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);


        // let triggerStart ="00:00",triggerEnd= "12:00",shift='night';
        // await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);

     

    } catch (error) {
        console.error('Error:', error);
    }
})();



//testing kleinsee
cron.schedule('0 23 * * *', async () => {
    // This cron job triggers every day at 22 PM SAST
    const items = await scanDynamoDBTableDay('23:00');
    await report_controller.reportdata(items, "day", runprod_test);

}, { timezone: timeZone });


//testing Blou day

cron.schedule('00 20 * * *', async () => {
    // This cron job triggers every day at 6:30 PM SAST
    const items = await scanDynamoDBTableDay('20:00');
    await report_controller.reportdata(items, "day", runprod_test);


}, { timezone: timeZone });


//testing Blou night

cron.schedule('0 8 * * *', async () => {
    // This cron job triggers every day at 6 AM SAST
    const items = await scanDynamoDBTableNight('08:00');
    await report_controller.reportdata(items, "night", runprod_test);


}, { timezone: timeZone });



//midninight status report

//internal status report
cron.schedule('0 0 * * *', async () => {
    
    let triggerStart ="12:00",triggerEnd= "00:00",shift='day';
    await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);

}, { timezone: timeZone });


//noon  status report

//internal status report
cron.schedule('0 12 * * *', async () => {
    
    let triggerStart ="00:00",triggerEnd= "12:00",shift='night';
    await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);

}, { timezone: timeZone });
