const fs = require('fs');
const ExcelJS = require('exceljs');
const reportService = require('../services/fetchAllIots.service');
const { successResponse, failResponse } = require('../utils/response.util');


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


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



exports.getBillableData = async (req, res) => {
  let get_tablenames;

  try {
      get_tablenames = await reportService.BillableMessages();
      let data = []; // Initialize data as an empty array

      const firstObject = get_tablenames;

      firstObject.forEach(entry => {
          console.log(`Data for key '${entry.key}':`);

          // Check if the 'value' array is not empty
          if (Array.isArray(entry.value) && entry.value.length > 0) {
              entry.value.forEach((object, index) => {
                  data.push(object);
              });
          } else {
              console.log('  No data available.');
          }
      });

      // Build data for Excel
      const excelData = [
          ['ICCID', 'Date', 'Title', 'Value'],
          ...data.map(point => [point.iccid, point.date, point.title, point.value]),
      ];

      // Create a workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      // Add data to the worksheet
      excelData.forEach(row => {
          worksheet.addRow(row);
      });

      // Save the workbook to a file
      const filePath = 'output_billable_data.xlsx';
      await workbook.xlsx.writeFile(filePath);

      console.log('Excel file has been written');
      return res.send(successResponse('Success'));
  } catch (err) {
      console.error('Error:', err);
      throw err;
  }
};

