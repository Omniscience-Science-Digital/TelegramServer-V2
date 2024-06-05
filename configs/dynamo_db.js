const { DynamoDBClient, ScanCommand,QueryCommand } = require("@aws-sdk/client-dynamodb");


const client = new DynamoDBClient({
  region: process.env.AWS_REGION, // Replace with your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const reporttable = 'TelegramReport-etq3h3wwqjcijhmtd4mfwfbw4q-staging';
const scalestable = 'Telegramscales-etq3h3wwqjcijhmtd4mfwfbw4q-staging';


module.exports = {
  ScanCommand,
    reporttable,
    scalestable,client,QueryCommand
  };

