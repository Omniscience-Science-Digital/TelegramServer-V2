const ExcelJS = require('exceljs');
const reportService = require('../services/fetchAllIots.service');
const { successResponse, failResponse } = require('../utils/response.util');
const { getCurrentDateFormatted } = require('../utilities/time.utility');
const handleTelegramNotification = require('../helpers/telegram/telegram.helper')


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



exports.getBillableData = async (req, res) => {
  let get_tablenames;

  try {
    get_tablenames = await reportService.BillableMessages();
    let data = []; // Initialize data as an empty array

    const firstObject = get_tablenames;
    const chartIDTest = '-4019893816';

    firstObject.forEach(entry => {
      console.log(`Data for key '${entry.key}':`);

      // Check if the 'value' array is not empty
      if (Array.isArray(entry.value)) {
        entry.value.forEach((object, index) => {
          data.push(object);
        });
      } 
    });



    // Build data for Excel

    const excelData = [
      ['Iccid', 'First_date', 'Last_date', 'Total_Billablepoints'], // Header row
      ...data.map(point => [point.iccid, point.first_date, point.last_date, point.total_billablepoints]), // Data rows
    ];

    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    
    const worksheet =  workbook.addWorksheet('Sheet 1', {
      pageSetup:{paperSize: 9, orientation:'landscape'}
    });

  

    // Add data to the worksheet
    excelData.forEach(row => {
      worksheet.addRow(row);
    });

    // Save the workbook to a file
    const filePath = 'output_billable_data.xlsx';
    await workbook.xlsx.writeFile(filePath);

      // Write workbook to a buffer
      let excelbuffer = await workbook.xlsx.writeBuffer();


     var current_date =`${getCurrentDateFormatted()}, billable_data.xlsx`;

  
    await handleTelegramNotification('-4019893816', excelbuffer, current_date);
  
        
    console.log('Excel file has been written');
    return res.send(successResponse('Success'));
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};


exports.listIotTables = async (req, res) => {

  try {

    const tableData = await reportService.listTables();

    return res.send(
      successResponse('Success', {
        data: tableData.table_name,
        count: tableData.count,
      })
    );
  } catch (error) {
    console.error('Error in listTables controller:', error);
    return res.send(failResponse(error.message));
  }
};
