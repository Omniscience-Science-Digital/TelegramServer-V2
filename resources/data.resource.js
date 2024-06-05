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