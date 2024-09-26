var   definitionskeylen = 0.3;

module.exports.dataDefinitions = [
    [
      {
        text: 'Reported Start and End Times:',
        width: definitionskeylen,
      },
      {
        text: ' The first and last time where the plant started to run production during the report period.',
        width: 0.7,
      },
    ],
    [
      {
        text: 'Run time:',
        width: definitionskeylen,
      },
      {
        text: ' The total time where the plant ran production during the report period.',
        width: 0.7,
      },
    ], [
      {
        text: 'Plant Balance:',
        width: definitionskeylen,
      },
      {
        text: ' The total recorded outgoing material in ratio against the recorded incoming material.',
        width: 0.7,
      },
    ],
    [
      {
        text: 'Complex Yield:',
        width: definitionskeylen,
      },
      {
        text: ' The total recorded outgoing product in ratio against the incoming material.',
        width: 0.7,
      },
    ],
    [
      {
        text: 'Utilization:',
        width: definitionskeylen,
      },
      {
        text: ' The Ratio of current plant utilization against the theoretical maximum utilization.',
        width: 0.7,
      },
    ],
    [
      {
        text: 'Availibility:',
        width: definitionskeylen,
      },
      {
        text: ' The Ratio of time when the plant is running against the time it is not running.',
        width: 0.7,
      },
    ]
  ];

  module.exports.datastatusDefinitionsLeft = [
    [
      {
        text: 'Count of Modbus devices OFF:',
        width: 0.7,
      },
      {
        text: ' ',
        width: 0.3,
      },
    ],
    [
      {
        text: 'Count of Modbus devices not updating:',
        width: 0.7,
      },
      {
        text: ' ',
        width: 0.3,
      },
    ],

    [
      {
        text: 'Count of Modbus devices with battery in critical state :',
        width: 0.7,
      },
      {
        text: ' ',
        width: 0.3,
      },
    ],
    [
      {
        text: 'Count of Modbus devices  with decreasing totalization:',
        width: 0.7,
      },
      {
        text: ' ',
        width: 0.3,
      },
    ],

  ];
  

  module.exports.datastatusDefinitionsRight = [
    [
      {
        text: 'Count of Modbus devices where month tons reset:',
        width: 0.7,
      },
      {
        text: ' 87',
        width: 0.3,
      },
    ],
    [
      {
        text: 'Count of Modbus devices with update > 15 minutes:',
        width: 0.7,
      },
      {
        text: ' 76',
        width: 0.3,
      },
    ],

    [
      {
        text: 'Count of Modbus devices where totalizer > 750,000:',
        width: 0.7,
      },
      {
        text: ' 121',
        width: 0.3,
      },
    ],
    [
      {
        text: 'Count of Modbus devices where shift tons reset more than 3 minutes after shift change:',
        width: 0.7,
      },
      {
        text: ' 90',
        width: 0.3,
      },
    ],

  ];

