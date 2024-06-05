// groupByTimeIntervals.js
module.exports.groupByTimeIntervals = (timedata, tonsdata) => {


    var len = timedata.length

    

    //if (timedata.length !== tonsdata.length) return;

    // Split the startTime string into hours and minutes
    const [startHour, startMinute] = timedata[len -1].split(':');


    // Convert the hours and minutes to numbers
    const hour = parseInt(startHour, 10);
    const minute = parseInt(startMinute, 10);

    // Add one hour
    const newHour = (hour + 1) % 24;

    // Format the result as a 24-hour time string (HH:mm)
    const endTime = `${newHour < 10 ? '0' : ''}${newHour}:${minute < 10 ? '0' : ''}${minute}`;



   // timedata.push(endTime);
    // Return an array of grouped data
    const groupedData = {};

    // Initialize the result array
    const intervals = [];

    // Create intervals
    for (let i = 0; i < timedata.length - 1; i++) {
        const intervalStart = timedata[i];
        const intervalEnd = timedata[i + 1];
        const interval = `${intervalStart} - ${intervalEnd}`;

        intervals.push(interval);
    }

    for (let i = 0; i < tonsdata.length; i++) {
        const hourlydata = tonsdata[i];
        const value = intervals[i];
    
        if (value !== undefined) { // Check if the interval value is defined
            groupedData[value] = hourlydata;
        }
    }
 
    
    return groupedData;
};

