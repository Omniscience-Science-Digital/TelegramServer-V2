const { scanDynamoDBTableDay, scanDynamoDBTableNight, scanDynamoDBTableExtraShift } = require('./repositories/dynamodb_repository');
const report_controller = require('./controllers/cron.controller');
const Statusreportcontroller = require('./controllers/internalStatusreport.controller');

const cron = require('node-cron');

// Set the time zone to Johannesburg, South Africa (SAST)
const timeZone = 'Africa/Johannesburg';





/**Day Cron Jobs **/

//internal status report
cron.schedule('0 0 * * *', async () => {
    
    let triggerStart ="12:00",triggerEnd= "00:00",shift='day';
    await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);

}, { timezone: timeZone });


cron.schedule('0 14 * * *', async () => {
    // This cron job triggers every day at 2 PM SAST
    const items = await scanDynamoDBTableDay('14:00');
    await report_controller.reportdata(items, "day", "Prod");

}, { timezone: timeZone });


cron.schedule('0 16 * * *', async () => {
    // This cron job triggers every day at 4 PM SAST
    const items = await scanDynamoDBTableDay('16:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });

cron.schedule('0 18 * * *', async () => {
    // This cron job triggers every day at 6 PM SAST

    const items = await scanDynamoDBTableDay('18:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });



cron.schedule('30 18 * * *', async () => {
    // This cron job triggers every day at 6:30 PM SAST
    const items = await scanDynamoDBTableDay('18:30');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });

cron.schedule('0 19 * * *', async () => {
    // This cron job triggers every day at 7 PM SAST
    const items = await scanDynamoDBTableDay('19:00');
    await report_controller.reportdata(items, "day", "Prod");

}, { timezone: timeZone });



cron.schedule('0 22 * * *', async () => {
    // This cron job triggers every day at 22 PM SAST

    const items = await scanDynamoDBTableDay('22:00');
    //extrashift items
    const extrashiftitems = await scanDynamoDBTableExtraShift('22:00')

    await report_controller.reportdata(items, "day", "Prod");
    await report_controller.reportdata(extrashiftitems, "day2", "Prod");


}, { timezone: timeZone });




cron.schedule('0 0 * * *', async () => {
    // This cron job triggers every day at 12 AM SAST
    const items = await scanDynamoDBTableDay('00:00');
    await report_controller.reportdata(items, "day", "Prod");


}, { timezone: timeZone });



///**************************Night SHIFT CRON*****************************///
//internal status report
cron.schedule('0 12 * * *', async () => {
    
    let triggerStart ="00:00",triggerEnd= "12:00",shift='night';
    await Statusreportcontroller.Statusreportcontroller(triggerStart,triggerEnd,shift);

}, { timezone: timeZone });

cron.schedule('0 2 * * *', async () => {
    // This cron job triggers every day at 2 AM SAST
    const items = await scanDynamoDBTableNight('02:00');
    await report_controller.reportdata(items, "night", "Prod");

}, { timezone: timeZone });


cron.schedule('0 5 * * *', async () => {
    // This cron job triggers every day at 6 PM SAST
    const items = await scanDynamoDBTableNight('05:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });


cron.schedule('0 6 * * *', async () => {
    // This cron job triggers every day at 6 AM SAST
    const items = await scanDynamoDBTableNight('06:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });

cron.schedule('30 6 * * *', async () => {
    // This cron job triggers every day at 6:30 AM SAST
    const items = await scanDynamoDBTableNight('06:30');
    await report_controller.reportdata(items, "night", "Prod");



}, { timezone: timeZone });

cron.schedule('0 7 * * *', async () => {
    // This cron job triggers every day at 7 AM SAST
    const items = await scanDynamoDBTableNight('07:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });


cron.schedule('0 12 * * *', async () => {
    // This cron job triggers every day at 12 PM SAST

    const items = await scanDynamoDBTableNight('12:00');
    await report_controller.reportdata(items, "night", "Prod");


}, { timezone: timeZone });



// Update none t1 start dates

cron.schedule('0 9 1 * *', async () => {
    scanDynamoDBTableWithMonthStart()
    .then(() => console.log('Monthstart updated successfully'))
    .catch(err => console.error('Error:', err));
}, { timezone: timeZone });
