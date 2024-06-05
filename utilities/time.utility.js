const subtractTwoHours = (timeString) => {
  // Function to add 2 hours to a time string and ensure HH:mm format
  const date = new Date(`2000-01-01T${timeString}:00`);
  date.setHours(date.getHours() - 2);

  return date.toTimeString().slice(0, 5);
};

const getCurrentDateFormatted = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getPreviousDateFormatted = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1); // Adjust to previous day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const calculateTotalHours = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let totalHours;

  if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
    // Handle case where end time is on the next day
    totalHours = 24 - startHour + endHour;
  } else if (startHour === endHour && startMinute === endMinute) {
    // Handle case where start time is equal to end time (full day)
    totalHours = 24;
  } else {
    totalHours = endHour - startHour;
  }

  // Calculate total minutes
  const totalMinutes = (totalHours * 60) + (endMinute - startMinute);

  // Convert total minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}


const addTwoHours = (timeString) => {
  // Function to add 2 hours to a time string and ensure HH:mm format
  const date = new Date(`2000-01-01T${timeString}`);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  date.setHours(date.getHours() + 2);

  return date.toTimeString().slice(0, 8); // Return HH:mm:ss
};


const formatTime = (time) => {
  if (time instanceof Date && !isNaN(time.getTime())) {
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  } else {
    return ' ';
  }
};



function determineShifts(shift1, shift2, shift3) {
  // Count the number of shifts that are not "23:59"
  let activeShifts = 0;

  if (shift1 !== "23:59") activeShifts++;
  if (shift2 !== "23:59") activeShifts++;
  if (shift3 !== "23:59") activeShifts++;

  // Determine the number of shifts based on activeShifts count
  if (activeShifts === 3) {
    return 3;
  } else if (activeShifts === 2) {
    return 2;
  } else if (activeShifts === 1) {
    return 1;
  } else {
    return 0; // If all shifts are "23:59", this is an edge case and could be handled if needed
  }
}



const dertemine_numberofShifts = (shift1, shift2, shift3, totalmonttarget, monthstart, shift,enddate) => {



  var numShifts = determineShifts(shift1, shift2, shift3);

  //calculate how many days the plant has been running 

  const startingDate = new Date(monthstart);
  const endingDate = new Date(enddate);

  // Calculate the difference in milliseconds
  const differenceMs = endingDate - startingDate;

  

   let shifts_Ran=0;

  if (shift === 'day') {
    shifts_Ran = (Math.floor(differenceMs / (1000 * 60 * 60 * 24)) * numShifts) + 1 
  }
  else if (shift === 'night') {

    shifts_Ran =  (Math.floor(differenceMs / (1000 * 60 * 60 * 24)) * numShifts)
  }
  else if (shift === 'day2') {
    shifts_Ran = (Math.floor(differenceMs / (1000 * 60 * 60 * 24)) * numShifts) + 2
    
  }
    
  //get target perShift 
  var targetPerShift = parseFloat(totalmonttarget) / (31 * numShifts);

 var mtd_target = parseFloat(targetPerShift * shifts_Ran);



return {mtd_target,shifts_Ran};

}


const getPreviousDayDate = () => {

  const today = new Date();
  const previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  // Check if the previous day is the last day of the previous month
  if (previousDay.getDate() === 31 && today.getDate() === 1) {
      // Move back to the last day of the previous month
      previousDay.setMonth(today.getMonth() - 1);

      // Handle the case where the previous month had 30 days
      if (previousDay.getMonth() === 1 && !isLeapYear(previousDay.getFullYear())) {
          previousDay.setDate(28); // February has 28 days in non-leap years
      } else if (previousDay.getMonth() === 1 && isLeapYear(previousDay.getFullYear())) {
          previousDay.setDate(29); // February has 29 days in leap years
      } else if ([3, 5, 8, 10].includes(previousDay.getMonth())) {
          previousDay.setDate(30); // April, June, September, November have 30 days
      }
  }

  return previousDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function calculateTimeIntervals(startHour, endHour) {

 

  // Function to add 2 hours to a time string and ensure HH:mm format
  const addTwoHours = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + 120;
    const newHours = (Math.floor(totalMinutes / 60) + 24) % 24; // Correctly wrap around
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const modifiedStartTime = addTwoHours(startHour);
  const modifiedEndTime = addTwoHours(endHour);

  const intervals = [];
  let currentHour = modifiedStartTime;

  do {
    intervals.push(currentHour);
    const [hours, minutes] = currentHour.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 60;
    const newHours = (Math.floor(totalMinutes / 60) + 24) % 24; // Correctly wrap around

  

    const newMinutes = totalMinutes % 60;
    currentHour = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;



  } while (currentHour !== modifiedEndTime);

      intervals.push(modifiedEndTime);

    
  

   
  return intervals;
}




module.exports = {getPreviousDayDate,calculateTimeIntervals,
  subtractTwoHours, getCurrentDateFormatted, getPreviousDateFormatted, calculateTotalHours, addTwoHours, formatTime, dertemine_numberofShifts
}
