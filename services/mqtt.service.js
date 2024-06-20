const mqtt = require('mqtt');
const logger = console; // For simplicity, logging directly to console

// Define MQTT broker details and credentials
const brokerUrl = 'mqtt://41.72.145.2:3881';  // Update with your MQTT broker URL and port
const username = 'masskg-console-user-mqtt';   // MQTT username
const password = '!37hdkUJIH747o!jjnm';        // MQTT password




// Function to publish MQTT message
function publishMessage(data, iccid) {
  // Convert data from JSON string to JavaScript object
  const message = JSON.parse(data);

  // MQTT client options
  const options = {
    username: username,
    password: password,
  };

  // Create MQTT client instance
  const client = mqtt.connect(brokerUrl, options);

  // MQTT event listeners
  client.on('connect', function () {
    logger.info('Connected to MQTT broker');
    client.publish(`ingress/${iccid}`, JSON.stringify(message));
    client.end(); // Close the client connection after publishing
  });

  client.on('error', function (error) {
    logger.error('Error:', error);
    client.end(); // Close the client connection on error
  });

  client.on('close', function () {
    logger.info('Disconnected from MQTT broker');
  });

  // Handle Ctrl+C to disconnect gracefully
  process.on('SIGINT', function () {
    logger.info('Disconnecting...');
    client.end();
    process.exit(); // Exit the process after disconnecting
  });
}


// Iterate through combdata and publish each message


exports.processData = async (combdata, iccid) => {

    combdata.forEach((data, index) => {
  try {
    const parsedData = JSON.parse(data);
    const publishiccid = iccid

    // Publish the message
    publishMessage(data, publishiccid);

    logger.info(`Published message ${index + 1}/${combdata.length}`);
  } catch (error) {
    logger.error(`Error publishing message ${index + 1}:`, error);
  }
});

}


