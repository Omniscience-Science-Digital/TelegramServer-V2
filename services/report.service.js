const reportRepository = require('../repositories/fetchAllIots.repository');

exports.BillableMessages = async () => {

    try {
  
      // Retrieve hourlyShifttons
      const tables = await reportRepository.BillableMessages();
  
      //messages now 
      let count =0;
      let messages = [];
  
      // Using a for...of loop
      for (const table of tables) {
          const tableName = table.table_name;
       
          var query = await reportRepository.getMessages(tableName)
  
          
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