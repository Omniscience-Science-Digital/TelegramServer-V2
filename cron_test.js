const { scanDynamoDBTableDay, scanDynamoDBTableNight, scanDynamoDBTableExtraShift } = require('./repositories/dynamodb_repository');
const report_controller = require('./controllers/cron.controller');
const intternalStatus_controller = require('./controllers/internalStatusreport.controller');

const cron = require('node-cron');

// Set the time zone to Johannesburg, South Africa (SAST)
const timeZone = 'Africa/Johannesburg';


//type script


let runprod_test ="test";

// (async () => {
//     try {
    
//         const items = await scanDynamoDBTableDay('22:00');
//         await intternalStatus_controller.Statusreportcontroller( "day", runprod_test);
     

//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();



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

