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
    const tables = await tableRepository.BillableMessages();

    //messages now 
    let count =0;
    let messages = [];

    // Using a for...of loop
    for (const table of tables) {
        const tableName = table.table_name;
     
        var query = await tableRepository.getMessages(tableName)

        
        messages.push({ key: tableName, value: query });

        count+=1;

        console.log('Table Number  '+ count);

      

    }
    




   // return formattedData;
   return messages;
  } catch (error) {
    console.error('Error listing Billable Data:', error);
    throw error;
  }
};