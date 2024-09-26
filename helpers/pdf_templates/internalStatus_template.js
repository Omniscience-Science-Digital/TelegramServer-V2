const PDFDocument = require("pdfkit");

const fs = require("fs");
const blobStream = require('blob-stream');
const { generateHeaderStatusreport, drawRectangleWithNoTextStatusreport, generateStatusName } = require('../pdf_Components/pdf_header');
const { createDefinitionsStatusTable } = require('../pdf_Components/pdf_tables')
const { generateFooterStatusreport } = require('../pdf_Components/pdf_footer');
const { datastatusDefinitionsLeft, datastatusDefinitionsRight } = require('../../resources/data.resource');


let customerInformationTop;



async function PDFInternalStatusreportGenerator(headerTitle, siteData, options = { margin: 5 }) {

  const pageOptions = { size: [841.89, 1190.55], margin: options.margin }; // A4 size: 595.28x841.89 points
  const docOptions = { bufferPages: true };



  return new Promise(async (resolve, reject) => {
    // Create a document and enable bufferPages mode

    const doc = new PDFDocument(pageOptions, docOptions);

    doc.font("Times-Roman");

    // Pipe the document to a blob stream
    const stream = doc.pipe(blobStream());
    // Global variable declaration
    customerInformationTop = 78;

    // Generate the PDF content
    generateHeaderStatusreport(doc);
    generateFooterStatusreport(doc);

    //draw line under header

    drawRectangleWithNoTextStatusreport(doc, 75);
    generateStatusName(doc, `Internal Status Report For Date : ${headerTitle}`, customerInformationTop);

    //

    //Definitions left Table
    createDefinitionsStatusTable(doc, datastatusDefinitionsLeft, (105), 17);

    //Definitions right Table
    createDefinitionsStatusTable(doc, datastatusDefinitionsRight, (105), 430);


    const headers = [
      'DEVICE NAME',
      'TOTALIZATION LIMIT',
      'BATTERY STATE',
      'MODBUS STATUS',
      'TOTALIZER RESET',
      'MOTHTONS RESET',
      'MODBUS UPDATE EXCEEDS 15 MINUTES',
      'MODBUS UPDATING',
      'SHIFT RESET TIMING',

    ];


    // Call the function to draw the table
    drawTable(doc, headers, siteData);

    // See the range of buffered pages
    const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }

    doc.pipe(fs.createWriteStream('./z/' + 'Statusreport_00:00 - 12:00 Tues 13 Sept 2024.pdf'));

    // Manually flush pages that have been buffered
    doc.flushPages();

    // Or, if you are at the end of the document anyway, doc.end() will call it for you automatically.
    doc.end();



    // Resolve the PDF buffer when the document ends
    doc.on("end", async () => {
      try {
        const blob = stream.toBlob();

        if (!blob) {
          reject(new Error('Blob is undefined'));
          return;
        }

        const pdfBuffer = Buffer.from(await new Response(blob).arrayBuffer());
        resolve(pdfBuffer);
      } catch (error) {
        reject(error);
      }
    });

    // Reject if there is an error
    doc.on("error", (error) => {
      reject(error);
    });
  });


}


function drawTable(doc, headers, sites) {


  //row heights 
  const headerHeight = 23;
  const sitenameHeight = 15;
  const rowHeight = 20;
  const columnWidth = 90;
  const startX = 16;
  const startY = 200;


  // Define colors
  const uncertainColor = '#C7C8CC';
  const borderColor = '#4C5F7A';
  const sitenameColor = '#E6B9A6';
  const headerBgColor = '#03346E';
  const headerTextColor = '#FFFFFF';
  const firstColumnBgColor = '#537EC5';
  const warningColumnBgColor = '#A91D3A';
  const successColumnBgColor = '#0D7C66';

  const totalWidth = columnWidth * headers.length; // Total width for all columns
  let y = startY; // Starting Y position




  sites.map(site => {
    const siteName = site.sitename.toUpperCase() + ' PLANT';
    let rowData = [site.siteData];
   
 
    doc.fillColor(sitenameColor).rect(startX + 0.5, y, totalWidth - 1, headerHeight).fill(); // Other headers background

    // Draw site name as a single cell spanning all columns
    doc.rect(startX + 0.5, y, totalWidth - 1, sitenameHeight).stroke(borderColor); // Draw border for the row
    doc.fillColor('black').font("Times-Roman").fontSize(9).text(siteName, startX, y + 5, { width: totalWidth - 1, align: 'center' });

    

    // Draw headers
    y += sitenameHeight; // Move down for headers
    headers.forEach((header, index) => {
    
  
      // Check if it's the first column and set the background color accordingly
      doc.fillColor(headerBgColor).rect(startX + index * columnWidth, y, columnWidth, headerHeight).fill(); // Other headers background
      // Draw header border
      doc.rect(startX + index * columnWidth, y, columnWidth, headerHeight).stroke(borderColor);

      // Set text color to white for the header row
      doc.fillColor(headerTextColor).font("Times-Roman").fontSize(7).text(header, startX + index * columnWidth + 5, y + 5, { width: columnWidth - 10, align: 'center' });
    });


    // Draw rows
    y += headerHeight; // Position for the first data row


    rowData[0].forEach((row) => {
      // Draw each row without additional spacing
      row.forEach((cell, colIndex) => {

        if (y >1120)
          {
            y=90;
            doc.addPage();
      
          drawRectangleWithNoTextStatusreport(doc, 75);
             // Generate the PDF content
          generateHeaderStatusreport(doc);
          generateFooterStatusreport(doc);
          }
  
        // Set background color for the first column of rows
        if (colIndex === 0) {
          doc.fillColor(firstColumnBgColor).rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight).fill(); // First column background
        }
  
        else if ((cell === 'reset')||(cell==='shiftons reset') || (cell === 'surpassed') || (cell === 'offline') || (cell === 'critical') || (cell === 'exceeded')||(cell==='iot offline')||(cell==='decreased')) {
          doc.fillColor(warningColumnBgColor).rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight).fill(); // First column background
        } else if ((cell === 'updating') || (cell === 'stable') || (cell === 'unsurpassed') || (cell === 'online') || (cell === 'maintained') || (cell === 'good')) {
          doc.fillColor(successColumnBgColor).rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight).fill(); // First column background
        }
        else {
  
          doc.fillColor(uncertainColor).rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight).fill(); // First column background
  
        }
  
        // Draw row border
        doc.rect(startX + colIndex * columnWidth, y, columnWidth, rowHeight).stroke(borderColor);
  
        // Set text color for rows
        doc.fillColor('black').font("Times-Roman").fontSize(9).text(cell, startX + colIndex * columnWidth + 5, y + 5, { width: columnWidth - 10, align: 'center' });
      });
      y += rowHeight; // Move down for the next row
    });

    
  
    if (y >1120)
    {
      y=90;
      doc.addPage();

    drawRectangleWithNoTextStatusreport(doc, 75);
       // Generate the PDF content
    generateHeaderStatusreport(doc);
    generateFooterStatusreport(doc);
    }


  });





}





// Export the class
module.exports = PDFInternalStatusreportGenerator;