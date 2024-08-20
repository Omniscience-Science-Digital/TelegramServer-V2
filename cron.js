const { scanDynamoDBTableDay, scanDynamoDBTableNight, scanDynamoDBTableExtraShift } = require('./repositories/dynamodb_repository');
const report_controller = require('./controllers/cron.controller');

const cron = require('node-cron');

// Set the time zone to Johannesburg, South Africa (SAST)
const timeZone = 'Africa/Johannesburg';


//testing script

(async () => {
    try {


        // const items = await scanDynamoDBTableDay('22:00');
        // const extrashiftitems = await scanDynamoDBTableExtraShift('22:00');

        // await report_controller.reportdata(items, "day", "test");
        // await report_controller.reportdata(extrashiftitems, "day2", "test");



    } catch (error) {
        console.error('Error:', error);
    }
})();


/**Day Cron Jobs **/

cron.schedule('5 14 * * *', async () => {
    // This cron job triggers every day at 2 PM SAST
    const items = await scanDynamoDBTableDay('14:00');
    await report_controller.reportdata(items, "day", "Prod");

}, { timezone: timeZone });


cron.schedule('5 16 * * *', async () => {
    // This cron job triggers every day at 4 PM SAST
    const items = await scanDynamoDBTableDay('16:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });

cron.schedule('5 18 * * *', async () => {
    // This cron job triggers every day at 6 PM SAST

    const items = await scanDynamoDBTableDay('18:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });



cron.schedule('35 18 * * *', async () => {
    // This cron job triggers every day at 6:30 PM SAST
    const items = await scanDynamoDBTableDay('18:30');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });

cron.schedule('5 19 * * *', async () => {
    // This cron job triggers every day at 7 PM SAST
    const items = await scanDynamoDBTableDay('19:00');
    await report_controller.reportdata(items, "day", "Prod");

}, { timezone: timeZone });



cron.schedule('5 22 * * *', async () => {
    // This cron job triggers every day at 22 PM SAST

    const items = await scanDynamoDBTableDay('22:00', "Prod");
    //extrashift items
    const extrashiftitems = await scanDynamoDBTableExtraShift('22:00')

    await report_controller.reportdata(items, "day", "Prod");
    await report_controller.reportdata(extrashiftitems, "day2", "Prod");


}, { timezone: timeZone });




cron.schedule('5 0 * * *', async () => {
    // This cron job triggers every day at 12 AM SAST
    const items = await scanDynamoDBTableDay('00:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });



///**************************Night SHIFT CRON*****************************///
cron.schedule('5 2 * * *', async () => {
    // This cron job triggers every day at 2 AM SAST
    const items = await scanDynamoDBTableNight('02:00');
    await report_controller.reportdata(items, "night", "Prod");

}, { timezone: timeZone });


cron.schedule('5 5 * * *', async () => {
    // This cron job triggers every day at 6 PM SAST
    const items = await scanDynamoDBTableNight('05:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });


cron.schedule('5 6 * * *', async () => {
    // This cron job triggers every day at 6 AM SAST
    const items = await scanDynamoDBTableNight('06:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });

cron.schedule('35 6 * * *', async () => {
    // This cron job triggers every day at 6:30 AM SAST
    const items = await scanDynamoDBTableNight('06:30');
    await report_controller.reportdata(items, "night", "Prod");



}, { timezone: timeZone });

cron.schedule('5 7 * * *', async () => {
    // This cron job triggers every day at 7 AM SAST
    const items = await scanDynamoDBTableNight('07:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });


cron.schedule('5 12 * * *', async () => {
    // This cron job triggers every day at 12 PM SAST

    const items = await scanDynamoDBTableNight('12:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });

