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
    const { table_name } = await tableRepository.listTables();

   
    // Ensure table_name is an array and handle it properly
    if (!Array.isArray(table_name)) {
      throw new Error('Expected table_name to be an array');
    }
       //messages now 
       let count =0;
       let messages = [];

        // Using a for...of loop
        for (const table of table_name) {
          const tableName = table;
        
          var query = await tableRepository.getMessages(tableName)
  
          
          messages.push({ key: tableName, value: query });
  
          count+=1;
  
          console.log('Table Number  '+ count);
  
        
  
      }


    // Return the resolved messages array
    return messages;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
};
