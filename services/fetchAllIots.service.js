const tableRepository = require('../repositories/fetchAllIots.repository');
const tableResource = require('../resources/ iot.resource'); 

exports.listTables = async () => {
  try {
    const tableData = await tableRepository.listTables();
    const formattedData = {};

    // Map resource names to actual database column names
    tableResource.forEach((resource, index) => {
      formattedData[resource] = tableData[resource];
    });

   
    return formattedData;
  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }
};

exports.BillableMessages = async () => {
  try {
    // Retrieve hourlyShifttons
    const { table_name, count } = await tableRepository.listTables();

   
    // Ensure table_name is an array and handle it properly
    if (!Array.isArray(table_name)) {
      throw new Error('Expected table_name to be an array');
    }

    // Use Promise.all to handle all promises concurrently
    const tablePromises = table_name.map(async (table_name) => {
      const query = await tableRepository.getMessages(table_name);
      return { key: table_name, value: query };
    });

    // Wait for all promises to resolve
    const messages = await Promise.all(tablePromises);

    // Return the resolved messages array
    return messages;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
};
