const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

let items;

shiftkeylen = 0.46;
monthkeylen = 0.54;


const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


const shiftData = [
    [
        {
            text: 'Shift:',
            width: shiftkeylen,
        },
        {
            text: ' ',
            width: 0.6,
        },
    ],
    [
        {
            text: 'Reported Start Time:',
            width: shiftkeylen,
        },
        {
            text: ' ',
            width: 0.6,
        },
    ],
    [
        {
            text: 'Reported End Time:',
            width: shiftkeylen,
        },
        {
            text: '  ',
            width: 0.6,
        },
    ],
];

const monthData = [
    [
        {
            text: 'Month Start Date:',
            width: monthkeylen,
        },
        {
            text: ' ',
            width: 0.7,
        },
    ],
    [
        {
            text: 'MTD Target (t):',
            width: monthkeylen,
        },
        {
            text: '  ',
            width: 0.7,
        },
    ],
    [
        {
            text: 'MTD Achieved (t):',
            width: monthkeylen,
        },
        {
            text: ' ',
            width: 0.7,
        },
    ]
];


var letbottom = [];

var formulaData = [    [
    {
        text: 'MTD Runtime (hrs):',
        width: monthkeylen,
    },
    {
        text: ' ',
        width: 0.7,
    },
]];

//creating chart node canvas instance 
const canvas = new ChartJSNodeCanvas({ width: 1800, height: 700 });


//Month to start date
const currentDate = new Date();
const currentMonth = monthNames[currentDate.getMonth()];
const currentYear = currentDate.getFullYear();


module.exports = {
     items,
     shiftkeylen,
     monthkeylen,
     monthNames,
     shiftData,
     monthData,
     letbottom,
     formulaData,
     canvas,
     currentDate,
     currentMonth,
     currentYear
}