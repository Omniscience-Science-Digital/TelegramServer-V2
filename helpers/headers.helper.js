
var { shiftData, monthData, formulaData, letbottom } = require('../resources/static.headers.resource');


module.exports.headers_helper = (shift, reportDataArray, monthStart, endTime, startTime) => {

    try {

        if (shift === 'day2') shift = 'day';

        let report_start_time = (shift === 'day') ? startTime : endTime;
        let report_start_date = formatDate(monthStart);


        //handle shitf stats & mtds 
  
        if(reportDataArray.site_had_production)
            {
                shiftData[1][1].text = ' ' + reportDataArray.starttime + ' hrs';
                shiftData[2][1].text = ' ' + reportDataArray.endtime + ' hrs';
        

            }else{

                shiftData[1][1].text = ' ' + reportDataArray.starttime ;
                shiftData[2][1].text = ' ' + reportDataArray.endtime ;
        

            }


        monthData[0][1].text = ' ' + report_start_date + ' ,' + report_start_time;
        monthData[1][1].text = ' ' + reportDataArray.montTodate_Target + ' tons';
        monthData[2][1].text = ' ' + reportDataArray.mtd_achieved + ' tons';

   

        let d = new Date();

        if (shift === 'day' || shift === 'day2') {
             
            let date_current = d.toString().split(' ').slice(0, 1).join(' ') + ' ' + d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();


            shiftData[0][1].text = ' ' + date_current + ' , Day Shift';
        }


        else if (shift === 'night') {
             
            d.setDate(d.getDate() - 1);

            let date_current = d.toString().split(' ').slice(0, 1).join(' ') + ' ' + d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();
            shiftData[0][1].text = ' ' + date_current + ' , Night Shift';

        }


    

        let reportnameDate = d.toISOString().split('T')[0]  + '  ' + endTime;
        let reportDateTime =  shiftData[0][1].text;


         return   {reportnameDate ,reportDateTime} ;


    } catch (error) {
        console.log(Error)
        throw error

    }


}

function formatDate(inputDate) {
    // Parse the input date string
    const dateParts = inputDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    // Create a Date object
    const date = new Date(year, month - 1, day);

    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Format the date
    const formattedDate = day + ' ' + monthNames[date.getMonth()] + ' ' + year;

    return formattedDate;
}







