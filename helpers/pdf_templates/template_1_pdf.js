const PDFDocument = require("pdfkit");
const fs = require("fs");
const blobStream = require('blob-stream');
const { generateHeader, drawRectangleWithNoText,generatePlantName } = require('../pdf_Components/pdf_header');
const { generateFooter } = require('../pdf_Components/pdf_footer');
const { drawRectangleWithText, createDefinitionsTable, drawHeaderRectangles, table, mtdtable, flowtable, createSTatisticsTable, noProduction } = require('../pdf_Components/pdf_tables')
const { dataDefinitions } = require('../../resources/data.resource');

const { generateflowShifttonsGraph, drawPieCharts } = require('../pdf_Components/plot_graphs')


let customerInformationTop;



async function PDFTableGenerator(pdfdata, sitename, filePath, reportHeaderRenames, options = { margin: 5 }) {

  const pageOptions = { size: [595.28, 841.89], margin: options.margin }; // A4 size: 595.28x841.89 points

  const docOptions = { bufferPages: true };


  return new Promise(async (resolve, reject) => {
    // Create a document and enable bufferPages mode

    const doc = new PDFDocument(pageOptions, docOptions);

    doc.font("Times-Roman");

    // Pipe the document to a blob stream
    const stream = doc.pipe(blobStream());
    // Global variable declaration
    customerInformationTop = 95;

    // Generate the PDF content
    generateHeader(doc);
    generateFooter(doc);

    //dynamicall add footer on addPage call
    doc.on('pageAdded', () => {
      generateHeader(doc);
      generateFooter(doc);
    }
    );


    drawRectangleWithNoText(doc, 92);
    generatePlantName(doc, sitename + "  Plant",customerInformationTop);


    //draw , header rectangles
    drawHeaderRectangles(doc, reportHeaderRenames, pdfdata, (customerInformationTop + 40));

    //shift staistics header
    drawRectangleWithText(doc, 'SHIFT STATISTICS', customerInformationTop = 260);

    //plot pie charts


    var charts = pdfdata.shift_statisticsPie;
    let [arr1, arr2] = splitpieChart(charts)
    var time = pdfdata.uptime || ' ';


    //check if site had production
    var site_had_production = pdfdata.site_had_production;

    if (site_had_production) {

      await createSTatisticsTable(doc, arr1, time, (customerInformationTop = 300), 20, 280);
      await createSTatisticsTable(doc, arr2, time, (customerInformationTop = 470), 180, 280);

      // Emptying arr1 and arr2
      arr1 = [];
      arr2 = [];


      drawPieCharts(doc, pdfdata.shift_statisticsPie);

    }
    else {

      await noProduction(doc, pdfdata);

    }
    //Table definitions header





    drawRectangleWithText(doc, 'DEFINITIONS', customerInformationTop = 665);

    //Definitions Table
    createDefinitionsTable(doc, dataDefinitions, (690), 20);

    doc.addPage();
    // Generate the PDF content

    //flow graph
    drawRectangleWithText(doc, 'SHIFT MASS FLOW TREND', customerInformationTop = 60);
    generateflowShifttonsGraph(doc, pdfdata.flowGraphBuffer, pdfdata.cyclonegraphbuffer, 80, 365)



    drawRectangleWithText(doc, 'SHIFT FLOW STATISTICS', customerInformationTop = 235);
    await flowtable(doc, pdfdata.myflowObject, 258, 20);

    //shift tons graph

    drawRectangleWithText(doc, 'SHIFT PROCESS VARIABLE TREND', customerInformationTop = 340);



    drawRectangleWithText(doc, 'PROGRESSIVE SHIFT  TONS', customerInformationTop = 520);
    //    // Draw  Shiftons table
    await table(doc, pdfdata.total_shifttons, 543, 20);


    // See the range of buffered pages
    const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }

    //doc.pipe(fs.createWriteStream('./z/' + filePath));

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


function splitpieChart(charts) {



  let arr1, arr2;

  if (charts.length % 2 === 0) {
    // If length is even, split it into two equal parts
    const midpoint = charts.length / 2;
    arr1 = charts.slice(0, midpoint);
    arr2 = charts.slice(midpoint);
  } else {
    // If length is odd, split it into two parts with one extra element in the first part
    const midpoint = Math.floor(charts.length / 2);
    arr1 = charts.slice(0, midpoint);
    arr2 = charts.slice(midpoint);
  }




  return [arr1, arr2]

}
// Export the class
module.exports = PDFTableGenerator;