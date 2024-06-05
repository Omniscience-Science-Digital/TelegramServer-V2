const fs = require('fs');
const { resolve } = require('path');

const cordinatesResource = require('../../resources/cordinates.resource');

const colors = ['#59B4C3', '#81689D', '#FFD0EC', '#74E291', '#D04848', '#FFB996', '#31304D', '#5FBDFF', '#4793AF', '#C65BCF'];
let datasets;



async function generateAndSaveLineChart(typeofGraph, data, canvas) {



  // Check if data is defined and is an array
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format or data is undefined.');
    return;
  }

  if (typeofGraph === "shift") {
    let shifttonsArray;

    // Extract "Shifttons" data for each key
    datasets = data.map((item, index) => {
      const key = item.key;
      shifttonsArray = item.data.map((entry) => entry.monthtons);

      // Assign a unique color to each dataset
      const lineColor = colors[index % colors.length];
      const shadeColor = `rgba(${parseInt(lineColor.slice(1, 3), 16)}, ${parseInt(lineColor.slice(3, 5), 16)}, ${parseInt(lineColor.slice(5, 7), 16)}, 0.3)`;

      return {
        label: key,
        borderColor: lineColor,
        backgroundColor: shadeColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 0,
        fill: true,
        data: shifttonsArray,
      };
    });

    


    datasets.forEach(dataset => {
      let cumulativeValue = 0;

      // Iterate through the data array of each dataset
      dataset.data = dataset.data.map(value => {
        // Convert string to number
        const numericValue = parseFloat(value);

        // Add to cumulative value
        cumulativeValue += numericValue;

        // Convert cumulative value back to string and update the dataset
        return cumulativeValue.toFixed(2);
      });
    });


  }
  else {

    if(typeofGraph ==='flow2')
    {
      colors.reverse();
    }


    // Extract "Shifttons" data for each key
    datasets = data.map((item, index) => {
      const key = item.key
      const shifttonsArray = item.data.map((entry) => entry.monthtons) 

      const lineColor = colors[index % colors.length];
      const shadeColor = `rgba(${parseInt(lineColor.slice(1, 3), 16)}, ${parseInt(lineColor.slice(3, 5), 16)}, ${parseInt(lineColor.slice(5, 7), 16)}, 0.3)`;


      return {
        label: key,
        borderColor: lineColor,
        backgroundColor: shadeColor,
        borderWidth: 2,
        pointRadius: 0, // Set point radius to 0 to hide points
        pointHitRadius: 0, // Set hit radius to 0 to hide points on hover
        fill: true,
        data: shifttonsArray,
      };
    });


  }



  let labels = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i].data && data[i].data.length > 0) {
      labels = data[i].data.map(entry => {
        if (entry.interval_start) {
          const date = new Date(entry.interval_start);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        } else {
          return null; // or any other value you want to use for undefined interval_start
        }
      });
      break;
    }
  }



  labels = labels.map(label => {
    const [hour, minute] = label.split(':').map(Number); // Split the label into hours and minutes
    const updatedHour = (hour + 2) % 24; // Add 2 hours and handle wrapping around to the next day
    return `${updatedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`; // Combine the updated hour and original minute
  });





  const configuration = {
    type: 'line',
    data: {
      labels: labels, // Use labels to plot against
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: 'Shifttons Data',
        fontSize: 10,
      },
      legend: {
        position: 'top',
      },
      scales: {
        x: {
          scaleLabel: {
            display: true,
            labelString: 'Hourly Period',
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        y: {
          scaleLabel: {
            display: true,
            labelString: 'Hour Shifttons',
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      }
    },
  };

  
  const image = await canvas.renderToBuffer(configuration);
//   const filePath = resolve(`./${typeofGraph}_example_line.png`);
//   fs.writeFileSync(filePath, image);
  return image;

    
  
}




async function createDonutChart(data, chartNode) {
  const chartBuffers = [];

  const positiveColor = '#0D9276';
  const negativeColor = '#D80032';


// Filter out entries with keys starting with "Shift" or "Balance"
data = data.filter(entry => {
  let key = Object.keys(entry)[0];
  key = key.toLowerCase();
  
  return !key.startsWith('shift') && !key.startsWith('balance');
});



  // Initialize arrays to store keys
  let keysWithBalance = [];
  let otherKeys = [];

  // Iterate over each object in the data array
  data.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (key.includes('Balance')) {
        keysWithBalance.push(key);
      } else {
        otherKeys.push(key);
      }
    });
  });

  // Sort other keys
  otherKeys.sort();



  // Concatenate keys with "Balance" first
  let orderedKeys = keysWithBalance.concat(otherKeys);




 // Create a new object with ordered keys
  let orderedData = {};

  
// Populate the new object with the key-value pairs in the specified order
orderedKeys.forEach(key => {
  data.forEach(obj => {
    if (obj.hasOwnProperty(key)) {
      orderedData[key] = obj[key];
    }
  });
});

data = orderedData;



//Define the specified order
const specifiedOrder = ['actual runtime', 'availability', 'utilisation'];
// Filter out keys that are not in specifiedOrder
const specifiedKeys = Object.keys(data).filter(key => specifiedOrder.includes(key));

// Filter out keys that are not in specifiedOrder and reverse them
const nonSpecifiedKeys = Object.keys(data).filter(key => !specifiedOrder.includes(key));



// Combine the two arrays, putting nonSpecifiedKeys first
 orderedKeys = [...nonSpecifiedKeys, ...specifiedKeys];

 orderedKeys.forEach(key => {
  orderedData[key] = data[key];
});

data = orderedData;



var myvaluekey=0;

  const keys = Object.keys(data);

  // Iterate over keys using for...of loop
  for (const key of orderedKeys) {
    let result = parseFloat(data[key]);
    // Replace 'NaN' with 0
    if (isNaN(result)) {
      result = 0;
    }
    myvaluekey=result;
    // Ensure everything is treated as a percentage (max 100)
    if (result > 100) result = 100;

    let backgroundColor;
    // For other properties, set default colors
    backgroundColor = [positiveColor, negativeColor];

    // Create chart configuration
    const configuration = {
      type: 'pie',
      data: {
        datasets: [{
          data: [result, 100 - result],
          backgroundColor: backgroundColor,
        }],
      },
      options: {
        plugins: {
          title: {
            display: false,
            position: 'top',
            font: { size: 14 },
          },
        },
      },
    };

    try {
      // Generate chart as buffer
      const chartBuffer = await chartNode.renderToBuffer(configuration);
      let x, y;
      chartvalue = key + 'Value ';
      chartBuffers.push({ key, chartvalue: myvaluekey, buffer: chartBuffer, cordx: x, cordy: y });
    } catch (error) {
      console.error(`Error creating chart for ${key}:`, error);
    }
  }



  
  cordinatesResource(chartBuffers);


  return chartBuffers;
}




module.exports = { createDonutChart , generateAndSaveLineChart };
