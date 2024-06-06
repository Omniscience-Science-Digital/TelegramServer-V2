const { ScanCommand, client, reporttable, scalestable } = require("../configs/dynamo_db");






module.exports.scanDynamoDBTableNight = async function (nightStop) {

  
  try {
    const [reports,scales] = await Promise.all([
      scanDynamoDBTableWithNight(nightStop),
      getScales()
    ]);




    const scalesMap = scales.reduce((acc, scale) => {
      if (!acc[scale.telegramreportID.S]) {
        acc[scale.telegramreportID.S] = [];
      }
      acc[scale.telegramreportID.S].push(scale);
      return acc;
    }, {});

    const linkedReports = reports.map(report => {
      const reportId = report.id.S;
    


      if (scalesMap[reportId]) {
        report.Telegramscales = scalesMap[reportId];
      }

      return report;
    });



    return linkedReports;
  } catch (error) {
    console.error('Error fetching or linking data:', error);
  }
}

module.exports.scanDynamoDBTableDay = async function (dayStop) {
  try {
    const [reports,scales] = await Promise.all([
      scanDynamoDBTableWithTime(dayStop),
      getScales()
    ]);




    const scalesMap = scales.reduce((acc, scale) => {
      if (!acc[scale.telegramreportID.S]) {
        acc[scale.telegramreportID.S] = [];
      }
      acc[scale.telegramreportID.S].push(scale);
      return acc;
    }, {});

    const linkedReports = reports.map(report => {
      const reportId = report.id.S;
    


      if (scalesMap[reportId]) {
        report.Telegramscales = scalesMap[reportId];
      }

      return report;
    });



    return linkedReports;
  } catch (error) {
    console.error('Error fetching or linking data:', error);
  }
}


module.exports.scanDynamoDBTableExtraShift = async function (extraShiftStop) {
  try {
    const [reports,scales] = await Promise.all([
      scanDynamoDBTableWithExtraTime(extraShiftStop),
      getScales()
    ]);




    const scalesMap = scales.reduce((acc, scale) => {
      if (!acc[scale.telegramreportID.S]) {
        acc[scale.telegramreportID.S] = [];
      }
      acc[scale.telegramreportID.S].push(scale);
      return acc;
    }, {});

    const linkedReports = reports.map(report => {
      const reportId = report.id.S;
    


      if (scalesMap[reportId]) {
        report.Telegramscales = scalesMap[reportId];
      }

      return report;
    });



    return linkedReports;
  } catch (error) {
    console.error('Error fetching or linking data:', error);
  }
}

const scanDynamoDBTableWithNight = async (nightstop) => {
  try {
    const filterExpression = '#nightStop = :stopTime AND sitestatus = :status';
    const expressionAttributeValues = {
      ':stopTime': { S: nightstop },
      ':status': { BOOL: true }
    };

    const params = {
      TableName: reporttable,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#nightStop': 'nightStop'
      },
      ExpressionAttributeValues: expressionAttributeValues
    };

    

    const data = await client.send(new ScanCommand(params));
    // console.log('Scan DynamoDB Result:', data.Items); // Log scan result for debugging
    
    return data.Items;
  } catch (err) {
    console.error('Error scanning DynamoDB table:', err);
    throw err;
  }
};

const scanDynamoDBTableWithTime = async (dayStop) => {
  try {
    const filterExpression = '#dayStop = :stopTime AND sitestatus = :status';
    const expressionAttributeValues = {
      ':stopTime': { S: dayStop },
      ':status': { BOOL: true }
    };

    const params = {
      TableName: reporttable,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#dayStop': 'dayStop'
      },
      ExpressionAttributeValues: expressionAttributeValues
    };

    const data = await client.send(new ScanCommand(params));
    // console.log('Scan DynamoDB Result:', data.Items); // Log scan result for debugging

    return data.Items;
  } catch (err) {
    console.error('Error scanning DynamoDB table:', err);
    throw err;
  }
};

const scanDynamoDBTableWithExtraTime = async (extraShiftStop) => {
  try {
    const filterExpression = '#extraShiftStop = :stopTime AND sitestatus = :status';
    const expressionAttributeValues = {
      ':stopTime': { S: extraShiftStop },
      ':status': { BOOL: true }
    };

    const params = {
      TableName: reporttable,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#extraShiftStop': 'extraShiftStop'
      },
      ExpressionAttributeValues: expressionAttributeValues
    };

    const data = await client.send(new ScanCommand(params));
    // console.log('Scan DynamoDB Result:', data.Items); // Log scan result for debugging

    return data.Items;
  } catch (err) {
    console.error('Error scanning DynamoDB table:', err);
    throw err;
  }
};


async function getScales() {
  const params = {
    TableName: scalestable,
    FilterExpression: '#deleted <> :deletedValue',
    ExpressionAttributeNames: {
      '#deleted': '_deleted'
    },
    ExpressionAttributeValues: {
      ':deletedValue': { BOOL: true }
    }
  };

  try {
    const scales = await client.send(new ScanCommand(params));

    scales.Items.sort((a, b) => {
      const createdAtA = new Date(a.createdAt.S).getTime();
      const createdAtB = new Date(b.createdAt.S).getTime();
      return createdAtA - createdAtB;
    });
    
    return scales.Items;
  } catch (err) {
    console.error('Error fetching scales from DynamoDB:', err);
    throw err;
  }
}


/*Id request functions*/

module.exports.scanDynamoDBTablewithname = async function (sitename) {
  try {
    const [reports,scales] = await Promise.all([
      getDynamoDBItemBySitename(sitename),
      getScales()
    ]);




    const scalesMap = scales.reduce((acc, scale) => {
      if (!acc[scale.telegramreportID.S]) {
        acc[scale.telegramreportID.S] = [];
      }
      acc[scale.telegramreportID.S].push(scale);
      return acc;
    }, {});

    const linkedReports = reports.map(report => {
      const reportId = report.id.S;
    


      if (scalesMap[reportId]) {
        report.Telegramscales = scalesMap[reportId];
      }

      return report;
    });



    return linkedReports;
  } catch (error) {
    console.error('Error fetching or linking data:', error);
  }
}

const getDynamoDBItemBySitename = async (sitename) => {
  try {
    const params = {
      TableName: reporttable,
      FilterExpression: '#sitename = :name',
      ExpressionAttributeNames: {
        '#sitename': 'sitename'
      },
      ExpressionAttributeValues: {
        ':name': { S: sitename }
      }
    };

    const data = await client.send(new ScanCommand(params));
    // console.log('Get DynamoDB Item:', data.Items); // Log the retrieved items for debugging
    
    return data.Items;
  } catch (err) {
    console.error('Error getting DynamoDB item:', err);
    throw err;
  }
};

