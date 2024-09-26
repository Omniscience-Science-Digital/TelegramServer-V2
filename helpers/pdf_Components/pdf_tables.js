
const { shiftData, monthData } = require('../../resources/static.headers.resource');


module.exports.drawRectangleWithText = (doc, text, posY) => {
  const pageWidth = 595.28; // Adjust as needed

  const textSpacer = 5;
  const grayShade = '#f2f2f2'; // Light gray color
  const darkGrayShade = '#45474B'; // Dark gray color

  const lightGrayHeight = 20; // Adjust the height of the light gray rectangle
  const darkGrayHeight = 2;   // Adjust the height of the dark gray rectangle on top

  // Draw the light gray rectangle
  doc.fillColor(grayShade).rect(16, posY, pageWidth - 55, lightGrayHeight).fill();

  // Draw a smaller dark gray rectangle on top
  doc.fillColor(darkGrayShade).rect(16, posY, pageWidth - 55, darkGrayHeight).fill();

  // Draw the text inside the light gray rectangle
  doc
    .font('Times-Bold')
    .fontSize(9)
    .fillColor('black')
    .text(text, 20 + textSpacer, posY + textSpacer + darkGrayHeight, {
      width: pageWidth - 2 * textSpacer - 40, // Adjust for padding
      align: 'center', underline: true
    });
}

module.exports.createDefinitionsTable = (doc, rows, posY, posX) => {
  doc.font("Times-Roman").fontSize(7);

  const pageWidth = 555;
  const textSpacer = 5;

  let y = posY;
  let x = posX;

  rows.forEach(row => {
    const arr = row.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }));
    const cellHeight = Math.max(...arr) + textSpacer * 2;

    // Remove the background shade for the first column
    // Remove the following line:
    // doc.fillColor(grayShade).rect(x, y, row[0].width * pageWidth + textSpacer, cellHeight).fill();

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, cellHeight).stroke();

    let writerPos = x;
    for (let i = 0; i < row.length - 1; i++) {
      writerPos += row[i].width * pageWidth;

      doc.lineCap('butt').moveTo(writerPos + textSpacer, y).lineTo(writerPos + textSpacer, y + cellHeight).stroke();
    }

    let textWriterPos = x + textSpacer;
    for (let i = 0; i < row.length; i++) {
      doc.fillColor('black').text(row[i].text, textWriterPos, y + textSpacer, {
        continued: false,
        width: row[i].width * pageWidth - (textSpacer + 5),
      });
      textWriterPos += row[i].width * pageWidth + (textSpacer - 5);
    }

    y += cellHeight;
  });

  doc.moveDown(2);
  doc.text('', doc.page.margins.left);
}


module.exports.createDefinitionsStatusTable = (doc, rows, posY, posX) => {
  doc.font("Times-Roman").fontSize(7);

  const pageWidth = 395;
  const textSpacer = 5;

  const grayShade = '#f2f2f2'; // Light gray color

  let y = posY;
  let x = posX;

  rows.forEach(row => {
    const arr = row.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }));
    const cellHeight = Math.max(...arr) + textSpacer * 2;

    // Add the background shade for the first column
  
     doc.fillColor(grayShade).rect(x, y, row[0].width * pageWidth + textSpacer, cellHeight).fill();
      



  // Add the background shade for the second column
  doc.fillColor('#FF8343').rect(x+5.5 + row[0].width * pageWidth, y, row[1].width * pageWidth-5, cellHeight).fill();


  

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, cellHeight).stroke();

    let writerPos = x;
    for (let i = 0; i < row.length - 1; i++) {
      writerPos += row[i].width * pageWidth;

      doc.lineCap('butt').moveTo(writerPos + textSpacer, y).lineTo(writerPos + textSpacer, y + cellHeight).stroke();
    }


    let textWriterPos = x + textSpacer;
    for (let i = 0; i < row.length; i++) {
      // Conditionally set alignment to 'center' only for the second column (i === 1)
      const alignment = i === 1 ? 'center' : 'left';
      
      doc.fillColor('black').text(row[i].text, textWriterPos, y + textSpacer, {
        continued: false,
        width: row[i].width * pageWidth - (textSpacer + 5),
        align: alignment
      });
    
      textWriterPos += row[i].width * pageWidth + (textSpacer - 5);
    }
    

    y += cellHeight;
  });

  doc.moveDown(2);
  doc.text('', doc.page.margins.left);
}



module.exports.drawHeaderRectangles = (doc, reportHeaderRenames, reportDataArray, point) => {



  createTable(doc, shiftData, point - 10, 20);
  //right table
  createTable(doc, monthData, point - 10, (320));

  //bottom tables


  let renameHeaders = reportHeaderRenames?.L;

  var monthkeylen = 0.54;
  let letbottom = [];
  let formulaData = [];

  var shiftstats = reportDataArray.shiftstats;
  var mtdstats = reportDataArray.mtdstat;

  shiftstats = shiftstats.filter(entry => {
    let key = Object.keys(entry)[0];
    key = key.toLowerCase();

    return !key.startsWith('actual runtime') && !key.startsWith('availability') && !key.startsWith('utilisation');
  });


  if (renameHeaders.length < 1) {

    //console.log(reportDataArray)

    letbottom.push([{ text: 'Shift FTP (t):', width: 0.46, }, { text: ' ' + reportDataArray.shifttons + '  tons', width: 0.6, }])



    // Initialize a Set to keep track of unique keys
    const uniqueKeys = new Set();
    //sorting shift
    for (let i = 0; i < shiftstats.length; i++) {
      // Get the key of the current object
      let key = Object.keys(shiftstats[i])[0];
      let value = shiftstats[i][key];



      key = key.toLowerCase();
      startkey = key.toLowerCase();

      if (!uniqueKeys.has(startkey)) {
        if (key === 'balance')
          letbottom.push([{ text: 'Plant Balance:', width: 0.46 }, { text: ' ' + value + ' ' + '%', width: 0.7 }])


        uniqueKeys.add(startkey);

      }



    }


    const uniqueheaderKeys = new Set();
    //sorting mtds
    for (let i = 0; i < mtdstats.length; i++) {
      // Get the key of the current object
      let key = Object.keys(mtdstats[i])[0];
      let value = mtdstats[i][key];
      let startkey = key.toLowerCase();

      key = key.toLowerCase();

      if (!uniqueheaderKeys.has(startkey)) {
        if (key === 'yield') {
          formulaData.push([{ text: 'MTD Yield:', width: 0.54 }, { text: ' ' + value + ' %', width: 0.7 }]);
          uniqueheaderKeys.add(startkey);
        }
      }
    }

    // Now add Balance if not already added
    for (let i = 0; i < mtdstats.length; i++) {
      let key = Object.keys(mtdstats[i])[0];
      let value = mtdstats[i][key];
      let startkey = key.toLowerCase();

      key = key.toLowerCase();

      if (!uniqueheaderKeys.has(startkey)) {
        if (key === 'balance') {
          formulaData.push([{ text: 'MTD Balance:', width: 0.54 }, { text: ' ' + value + ' %', width: 0.7 }]);
          uniqueheaderKeys.add(startkey);
        }
      }
    }




  }
  else {


    // // Initialize a Set to keep track of unique keys
    const uniqueKeys = new Set();
    var mykey = 'Shift FTP (t):';

    // Iterate through shiftstats
    for (let i = 0; i < shiftstats.length; i++) {
      // Get the key of the current object
      let key = Object.keys(shiftstats[i])[0];
      let value = shiftstats[i][key];
      let startkey = key.toLowerCase();

      // Check if the key starts with 'shift' and is not a duplicate
      if (startkey.startsWith('shift') && !uniqueKeys.has(startkey)) {
        // Add the key to the Set to mark it as encountered
        uniqueKeys.add(startkey);

        // Push the data to the output array
        letbottom.push([{ text: key + ' (t):', width: 0.46 }, { text: ' ' + value + ' ' + ' tons', width: 0.7 }]);
      } else {



        const existsShift = renameHeaders.some(header => {
          // Check if any value in the header object starts with "Shift "
          return Object.values(header).some(value => typeof value === 'string' && value.startsWith("Shift"));
        });


        if ((!uniqueKeys.has(mykey)) && !existsShift) {

          uniqueKeys.add(mykey);
          letbottom.push([{ text: mykey, width: 0.46, }, { text: ' ' + reportDataArray.shifttons + '  tons', width: 0.6, }])
        }

        if (startkey === 'cct balance')
          if (!uniqueKeys.has(startkey)) {

            uniqueKeys.add(startkey);
            letbottom.push([{ text: key + ' :', width: 0.46, }, { text: ' ' + value + '  %', width: 0.6, }])
          }


        if (startkey === 'balance')
          if (!uniqueKeys.has(startkey)) {

            uniqueKeys.add(startkey);
            letbottom.push([{ text: 'Plant ' + key + ' :', width: 0.46, }, { text: ' ' + value + '  %', width: 0.6, }])
          }

      }


    }


    const uniqueheaderKeys = new Set();


    //sorting mtd
    for (let i = 0; i < mtdstats.length; i++) {
      // Get the key of the current object
      let key = Object.keys(mtdstats[i])[0];
      let value = mtdstats[i][key];


      startkey = key.toLowerCase();



      if (!startkey.startsWith('shift') && !uniqueheaderKeys.has(startkey)) {
        const exists = renameHeaders.some(header => Object.values(header).includes(key));



        if (exists || startkey === 'yield') {

          uniqueheaderKeys.add(startkey);
          formulaData.push([{ text: `MTD  ${key}`, width: 0.54 }, { text: ' ' + value + ' %', width: 0.7 }])
        }

      }

    }

  }


  formulaData.push([
    {
      text: 'MTD Runtime (hrs):',
      width: monthkeylen,
    },
    {
      text: ' ' + reportDataArray.mtdruntime + ' hours',
      width: 0.7,
    },
  ])

  createTable(doc, letbottom, (point + 60), (20));
  //right table bottom
  createTable(doc, formulaData, (point + 60), (320));

}

function createTable(doc, rows, posY, posX) {
  doc.font("Times-Roman").fontSize(7);



  const pageWidth = 200;
  const textSpacer = 5;
  const grayShade = '#f2f2f2'; // Light gray color

  let y = posY;
  let x = posX;

  rows.forEach(row => {
    const arr = row.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }));
    const cellHeight = Math.max(...arr) + textSpacer * 2;

    // Draw the background shade for the first column
    doc.fillColor(grayShade).rect(x, y, row[0].width * pageWidth + textSpacer, cellHeight).fill();

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, cellHeight).stroke();

    let writerPos = x;
    for (let i = 0; i < row.length - 1; i++) {
      writerPos += row[i].width * pageWidth;

      doc.lineCap('butt').moveTo(writerPos + textSpacer, y).lineTo(writerPos + textSpacer, y + cellHeight).stroke();
    }

    let textWriterPos = x + textSpacer;
    for (let i = 0; i < row.length; i++) {
      doc.fillColor('black').text(row[i].text, textWriterPos, y + textSpacer, {
        continued: false,
        width: row[i].width * pageWidth - (textSpacer + 5),
      });
      textWriterPos += row[i].width * pageWidth + (textSpacer - 5);
    }

    y += cellHeight;
  });

  doc.moveDown(2);
  doc.text('', doc.page.margins.left);
}




module.exports.table = async (doc, dataArray, posY, posX) => {
  doc.font("Times-Roman").fontSize(7);


  const pageWidth = 555;
  const textSpacer = 5;

  let y = posY;
  let x = posX;

  const allKeys = dataArray.map(entry => entry.key);
  var keyswidth = (allKeys.length < 9) ? 0.107 : 0.1;


  // Extract all unique times from the Shifttons data objects
  const allTimes = Array.from(
    new Set(
      dataArray
        .flatMap(entry => Object.keys(entry.Shifttons))
    )
  );




  // Create headers
  const headers = ['Time', ...allKeys];

  // Draw headers
  const headerArr = headers.map(header => ({
    text: '  ' + header,
    width: header === 'Time' ? 0.1 : keyswidth, // Adjust the width as needed
  }));
  const headerCellHeight = Math.max(...headerArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

  // Add background color to the header row
  doc.lineWidth(0.3).strokeColor('lightgrey');
  doc.fillColor('lightgrey').lineJoin('miter').rect(x, y, pageWidth, headerCellHeight).fillAndStroke();

  let headerWriterPos = x;
  for (let i = 0; i < headerArr.length - 1; i++) {
    headerWriterPos += headerArr[i].width * pageWidth;
    doc.lineCap('butt').moveTo(headerWriterPos + textSpacer, y).lineTo(headerWriterPos + textSpacer, y + headerCellHeight).stroke();
  }

  let headerTextWriterPos = x + textSpacer;
  for (let i = 0; i < headerArr.length; i++) {
    doc.fillColor('black').text(headerArr[i].text, headerTextWriterPos, y + textSpacer, {
      continued: false,
      width: headerArr[i].width * pageWidth - (textSpacer + 5),
      backgroundColor: 'lightgrey', // Background color for header text
    });
    headerTextWriterPos += headerArr[i].width * pageWidth + (textSpacer - 5);
  }

  y += headerCellHeight;


  // Draw data rows


  const maxRowsPerPage = 13; // Maximum rows per page, adjust as needed
  let rowsDrawn = 0; // Track the number of rows drawn
  let currentPage = 1;


  allTimes.forEach((time, rowIndex) => {
    const rowData = [time, ...allKeys.map(key => (dataArray.find(entry => entry.key === key)?.Shifttons?.[time] || '0.00'))];

    const rowArr = rowData.map((data, colIndex) => ({
      text: '   ' + data,
      width: colIndex === 0 ? 0.1 : 0.1, // Adjust the width as needed
    }));

    const rowCellHeight = Math.max(...rowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

    // Check if adding this row exceeds the maximum rows per page
    if (rowsDrawn % maxRowsPerPage === 0 && rowsDrawn !== 0) {

      // generateFooter(doc);
      doc.addPage();
      // generateHeader(doc);
      module.exports.drawRectangleWithText(doc, 'PROGRESSIVE SHIFT  TONS', customerInformationTop = 80);
      doc.font("Times-Roman").fontSize(7);
      currentPage++;
      y = 110; // Reset y position for the new page

    }

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, rowCellHeight).stroke();

    let rowWriterPos = x;
    for (let i = 0; i < rowArr.length - 1; i++) {
      rowWriterPos += rowArr[i].width * pageWidth;
      doc.lineCap('butt').moveTo(rowWriterPos + textSpacer, y).lineTo(rowWriterPos + textSpacer, y + rowCellHeight).stroke();
    }

    let rowTextWriterPos = x + textSpacer;
    for (let i = 0; i < rowArr.length; i++) {
      if (i === 0) {
        doc.fillColor('lightgrey').rect(x, y, rowArr[i].width * pageWidth + 8, rowCellHeight).fill();
      }
      doc.fillColor('black').text(rowArr[i].text, rowTextWriterPos, y + textSpacer, {
        continued: false,
        width: rowArr[i].width * pageWidth - (textSpacer + 5),
      });
      rowTextWriterPos += rowArr[i].width * pageWidth + (textSpacer - 5);
    }

    y += rowCellHeight;
    rowsDrawn++;



    // Reset y position for the next page
    if (rowsDrawn % maxRowsPerPage === 0 && rowsDrawn !== 0) {

      y = 80;
    }



  });



  //check if we exceeding page or what.

  if (rowsDrawn % maxRowsPerPage === 0 && rowsDrawn !== 0) {

    //generateFooter(doc);
    doc.addPage();
    //generateHeader(doc);
    module.exports.drawRectangleWithText(doc, 'PROGRESSIVE SHIFT  TONS', customerInformationTop = 80);
    doc.font("Times-Roman").fontSize(7);
    currentPage++;
    y = 110; // Reset y position for the new page


    // Draw data row for Daytons
    const daytonRowData = ['Shift Total', ...allKeys.map(key => (dataArray.find(entry => entry.key === key)?.Daytons || 0).toString())];

    const daytonRowArr = daytonRowData.map((data, colIndex) => ({
      text: '   ' + data,
      width: colIndex === 0 ? 0.1 : 0.1, // Adjust the width as needed
    }));

    const daytonRowCellHeight = Math.max(...daytonRowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, daytonRowCellHeight).stroke();

    let daytonRowWriterPos = x;
    for (let i = 0; i < daytonRowArr.length - 1; i++) {
      daytonRowWriterPos += daytonRowArr[i].width * pageWidth;
      doc.lineCap('butt').moveTo(daytonRowWriterPos + textSpacer, y).lineTo(daytonRowWriterPos + textSpacer, y + daytonRowCellHeight).stroke();
    }

    let daytonRowTextWriterPos = x + textSpacer;
    for (let i = 0; i < daytonRowArr.length; i++) {
      if (i === 0) {
        doc.fillColor('lightgrey').rect(x, y, daytonRowArr[i].width * pageWidth + 8, daytonRowCellHeight).fill();
      }
      doc.fillColor('black').text(daytonRowArr[i].text, daytonRowTextWriterPos, y + textSpacer, {
        continued: false,
        width: daytonRowArr[i].width * pageWidth - (textSpacer + 5),
      });
      daytonRowTextWriterPos += daytonRowArr[i].width * pageWidth + (textSpacer - 5);
    }

    y += daytonRowCellHeight;


    doc.moveDown(2);
    doc.text('', doc.page.margins.left);


  } else {


    //Draw data row for Daytons
    const daytonRowData = ['Shift Total', ...allKeys.map(key => (dataArray.find(entry => entry.key === key)?.Daytons || 0).toString())];

    const daytonRowArr = daytonRowData.map((data, colIndex) => ({
      text: '   ' + data,
      width: colIndex === 0 ? 0.1 : 0.1, // Adjust the width as needed
    }));

    const daytonRowCellHeight = Math.max(...daytonRowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, daytonRowCellHeight).stroke();

    let daytonRowWriterPos = x;
    for (let i = 0; i < daytonRowArr.length - 1; i++) {
      daytonRowWriterPos += daytonRowArr[i].width * pageWidth;
      doc.lineCap('butt').moveTo(daytonRowWriterPos + textSpacer, y).lineTo(daytonRowWriterPos + textSpacer, y + daytonRowCellHeight).stroke();
    }

    let daytonRowTextWriterPos = x + textSpacer;
    for (let i = 0; i < daytonRowArr.length; i++) {
      if (i === 0) {
        doc.fillColor('lightgrey').rect(x, y, daytonRowArr[i].width * pageWidth + 8, daytonRowCellHeight).fill();
      }
      doc.fillColor('black').text(daytonRowArr[i].text, daytonRowTextWriterPos, y + textSpacer, {
        continued: false,
        width: daytonRowArr[i].width * pageWidth - (textSpacer + 5),
      });
      daytonRowTextWriterPos += daytonRowArr[i].width * pageWidth + (textSpacer - 5);
    }

    y += daytonRowCellHeight;



    // Draw data row for mtds
    const mtdRowData = ['Mtd Achieved', ...allKeys.map(key => (dataArray.find(entry => entry.key === key)?.month_to_date || 0).toString())];

    const mtdRowArr = mtdRowData.map((data, colIndex) => ({
      text: '   ' + data,
      width: colIndex === 0 ? 0.1 : 0.1, // Adjust the width as needed
    }));

    const mtdCellHeight = Math.max(...mtdRowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, mtdCellHeight).stroke();


    let mtdRowWriterPos = x;
    for (let i = 0; i < mtdRowArr.length - 1; i++) {
      mtdRowWriterPos += mtdRowArr[i].width * pageWidth;
      doc.lineCap('butt').moveTo(mtdRowWriterPos + textSpacer, y).lineTo(mtdRowWriterPos + textSpacer, y + mtdCellHeight).stroke();
    }

    let mtdRowTextWriterPos = x + textSpacer;
    for (let i = 0; i < mtdRowArr.length; i++) {
      if (i === 0) {
        doc.fillColor('#686D76').rect(x, y, mtdRowArr[i].width * pageWidth + 8, mtdCellHeight).fill();
        doc.fillColor('white').text(mtdRowArr[i].text, mtdRowTextWriterPos, y + textSpacer, {
          continued: false,
          width: mtdRowArr[i].width * pageWidth - (textSpacer + 5),
        });
      }
      else {


        doc.fillColor('black').text(mtdRowArr[i].text, mtdRowTextWriterPos, y + textSpacer, {
          continued: false,
          width: mtdRowArr[i].width * pageWidth - (textSpacer + 5),
        });

      }
      mtdRowTextWriterPos += mtdRowArr[i].width * pageWidth + (textSpacer - 5);
    }

    y += mtdCellHeight;


    doc.moveDown(2);
    doc.text('', doc.page.margins.left);


  }


}


module.exports.flowtable = async (doc, dataArray, posY, posX) => {

  doc.font("Times-Roman").fontSize(7);


  const pageWidth = 555;
  const textSpacer = 5;

  let y = posY;
  let x = posX;


  const allKeys = dataArray.map(entry => entry.key);
  var keyswidth = (allKeys.length < 9) ? 0.107 : 0.1;


  // Extract all unique times from the Shifttons data objects
  const allTimes = Array.from(
    new Set(
      dataArray
        .flatMap(entry => entry.flowData ? Object.keys(entry.flowData) : [])
    )
  );



  // Create headers
  const headers = ['Flow Variables', ...allKeys];


  // Draw headers
  const headerArr = headers.map(header => ({
    text: '  ' + header,
    width: header === 'Flow Variables' ? 0.115 : keyswidth, // Adjust the width as needed
  }));


  const headerCellHeight = Math.max(...headerArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;


  // Add background color to the header row
  doc.lineWidth(0.3).strokeColor('lightgrey');
  doc.fillColor('lightgrey').lineJoin('miter').rect(x, y, pageWidth, headerCellHeight).fillAndStroke();

  let headerWriterPos = x;
  for (let i = 0; i < headerArr.length - 1; i++) {
    headerWriterPos += headerArr[i].width * pageWidth;
    doc.lineCap('butt').moveTo(headerWriterPos + textSpacer, y).lineTo(headerWriterPos + textSpacer, y + headerCellHeight).stroke();
  }

  let headerTextWriterPos = x + textSpacer;
  for (let i = 0; i < headerArr.length; i++) {
    doc.fillColor('black').text(headerArr[i].text, headerTextWriterPos, y + textSpacer, {
      continued: false,
      width: headerArr[i].width * pageWidth - (textSpacer + 5),
      backgroundColor: 'lightgrey', // Background color for header text
    });
    headerTextWriterPos += headerArr[i].width * pageWidth + (textSpacer - 5);
  }

  y += headerCellHeight;


  // Draw data rows



  let rowsDrawn = 0; // Track the number of rows drawn


  allTimes.forEach((time, rowIndex) => {
    const rowData = [time, ...allKeys.map(key => (parseFloat(dataArray.find(entry => entry.key === key)?.flowData?.[time] || '0.00').toFixed(2)))];


    const rowArr = rowData.map((data, colIndex) => ({
      text: '  ' + data,
      width: colIndex === 0 ? 0.115 : 0.1, // Adjust the width as needed
    }));

    const rowCellHeight = Math.max(...rowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;


    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth, rowCellHeight).stroke();

    let rowWriterPos = x;
    for (let i = 0; i < rowArr.length - 1; i++) {
      rowWriterPos += rowArr[i].width * pageWidth;
      doc.lineCap('butt').moveTo(rowWriterPos + textSpacer, y).lineTo(rowWriterPos + textSpacer, y + rowCellHeight).stroke();
    }

    let rowTextWriterPos = x + textSpacer;
    for (let i = 0; i < rowArr.length; i++) {
      if (i === 0) {
        doc.fillColor('lightgrey').rect(x, y, rowArr[i].width * pageWidth + 8, rowCellHeight).fill();
      }
      doc.fillColor('black').text(rowArr[i].text, rowTextWriterPos, y + textSpacer, {
        continued: false,
        width: rowArr[i].width * pageWidth - (textSpacer + 5),
      });
      rowTextWriterPos += rowArr[i].width * pageWidth + (textSpacer - 5);
    }

    y += rowCellHeight;
    rowsDrawn++;



  });


}




function sortTableRows(rows, time) {
  let pieRows = [];

  rows.forEach(item => {



    var str = (item.key !== 'actual runtime') ? '%' : 'hrs'

    var value = (item.key === 'actual runtime') ? time : item.chartvalue
    var key = (item.key === 'Yield') ? 'Complex Yield' : item.key;

    key = key.toUpperCase()


    value = value + ' ' + str;

    pieRows.push([
      { text: key, width: 0.5 },
      { text: value, width: 0.5 },
      { image: null, width: 0.5 }
    ]);
  });

  return pieRows;
}



module.exports.createSTatisticsTable = async (doc, rows, time, posY, posX, pageWidth) => {
  doc.font("Times-Roman").fontSize(7);


  rows = sortTableRows(rows, time)

  var rowsLen = rows.length;

  //length of horizontal lines

  var horizontalExt = 0;
  const textSpacer = 5;
  const grayShade = '#f2f2f2'; // Light gray color

  let y = posY;
  let x = 0;

  //starting position for 1 pie chart

  let posPie_1 = 50;

  if (rowsLen === 1) {
    x = 220;
    horizontalExt = -120;
    dev = 5;


  }
  else if (rowsLen === 2) {
    x = 155;
    horizontalExt = 0;

  } else if (rowsLen === 3) {
    x = 95;
    horizontalExt = 120;

  }
  else if (rowsLen === 4) {
    x = 25;
    horizontalExt = 265;
  }



  const columns = rows[0].map((_, columnIndex) => rows.map(row => row[columnIndex]));



  for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    const column = columns[columnIndex];

    // Calculate the maximum height of text in the column
    const arr = column.map(row => doc.heightOfString(row.text, { width: row.width * pageWidth }));
    let cellHeight = Math.max(...arr) + textSpacer * 2;

    // Draw the background shade only for the first column
    if (columnIndex === 0) {
      doc.fillColor(grayShade).rect(x, y, pageWidth + horizontalExt, cellHeight).fill();
    }

    // Set specific cell height for the third column
    if (columnIndex === 2) {
      cellHeight = 120;
    }

    // Draw the outline of the cell
    doc.lineWidth(0.3).strokeColor('lightgrey');
    doc.lineJoin('miter').rect(x, y, pageWidth + horizontalExt, cellHeight).stroke();



    //Draw vertical lines for the third column
    if (columnIndex === 2) {

      let writerPos = x;

      for (let i = 0; i < column.length - 1; i++) {
        writerPos += column[i].width * pageWidth;
        doc.lineCap('butt').moveTo(writerPos, y - 35).lineTo(writerPos, y + cellHeight).stroke();
      }
    }

    // Set initial text writer position
    let textWriterPos = x + textSpacer;

    // Adjust text writer position for single-row tables
    if (rows.length === 1) {
      textWriterPos = 263;
    }

    // Draw text for each cell in the column
    for (let i = 0; i < column.length; i++) {
      // Skip drawing for the third column
      if (columnIndex === 2) {
        continue;
      }



      if (rowsLen === 1) {
        x = 220;
        horizontalExt = -120;

        // Calculate the center position for each cell
        const cellCenter = textWriterPos + (column[i].width * pageWidth - (textSpacer + 5)) / 2;

        // Draw text for the cell
        doc.fillColor('black').text(column[i].text, cellCenter - posPie_1, y + textSpacer, {
          width: column[i].width * pageWidth - (textSpacer + 5),
        });

        // Update text writer position for the next cell
        textWriterPos += column[i].width * pageWidth + (textSpacer - 5);


      }
      else {


        // Calculate the center position for each cell
        const cellCenter = textWriterPos + (column[i].width * pageWidth - (textSpacer + 5)) / 2;

        // Draw text for the cell
        doc.fillColor('black').text(column[i].text, cellCenter - 20, y + textSpacer, {
          width: column[i].width * pageWidth - (textSpacer + 5),
        });

        // Update text writer position for the next cell
        textWriterPos += column[i].width * pageWidth + (textSpacer - 5);
      }

    }

    // Move to the next row
    y += cellHeight;
  }





  doc.moveDown(2);
  doc.text('', doc.page.margins.left);
}



module.exports.noProduction = async (doc, pdfdata) => {

  var primaryScales = pdfdata.primaryScalesArray
  var plural = (primaryScales.length === 1) ? 'scale ' : 'scales ';


  // Generate the message
  const message = `The following primary ${plural} ${primaryScales.join(', ')} had no production.`;

  //  Calculate the position dynamically
  const textWidth = doc.widthOfString(message);
  const padding = (doc.page.width - textWidth) / 2;

  // Add the message to the PDF document
  doc.fillColor("#61677A")
    .fontSize(9)
    .text(message, padding, 300)
    .moveDown();



  // Add the error image
  doc.image("./assets/prodmine.jpeg", 180, 360, { width: 220 });


}


module.exports.drawRectangleWithNoText = (doc, posY) => {
  const pageWidth = 595.28; // Adjust as needed

  const darkGrayShade = '#45474B'; // Dark gray color

  const darkGrayHeight = 2;   // Adjust the height of the dark gray rectangle on top

  // Draw a smaller dark gray rectangle on top
  doc.fillColor(darkGrayShade).rect(20, posY, pageWidth - 40, darkGrayHeight).fill();

}


/** Mtd Table **/


module.exports.mtdtable = async (doc, dataArray, posY, posX) => {
  doc.font("Times-Roman").fontSize(7);



  const pageWidth = 555;
  const textSpacer = 5;

  let y = posY;
  let x = posX;

  const allKeys = dataArray.map(entry => entry.key);
  var keyswidth = (allKeys.length < 9) ? 0.107 : 0.1;


  // Create headers
  const headers = [' ', ...allKeys];

  // Draw headers
  const headerArr = headers.map(header => ({
    text: '  ' + header,
    width: header === ' ' ? 0.065 : keyswidth, // Adjust the width as needed
  }));
  const headerCellHeight = Math.max(...headerArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

  // Add background color to the header row
  doc.lineWidth(0.3).strokeColor('lightgrey');
  doc.fillColor('lightgrey').lineJoin('miter').rect(x, y, pageWidth, headerCellHeight).fillAndStroke();

  let headerWriterPos = x;
  for (let i = 0; i < headerArr.length - 1; i++) {
    headerWriterPos += headerArr[i].width * pageWidth;
    doc.lineCap('butt').moveTo(headerWriterPos + textSpacer, y).lineTo(headerWriterPos + textSpacer, y + headerCellHeight).stroke();
  }

  let headerTextWriterPos = x + textSpacer;
  for (let i = 0; i < headerArr.length; i++) {
    doc.fillColor('black').text(headerArr[i].text, headerTextWriterPos, y + textSpacer, {
      continued: false,
      width: headerArr[i].width * pageWidth - (textSpacer + 5),
      backgroundColor: 'lightgrey', // Background color for header text
    });
    headerTextWriterPos += headerArr[i].width * pageWidth + (textSpacer - 5);
  }

  y += headerCellHeight;




  // Draw data row for Daytons
  const daytonRowData = ['MTD (t)', ...allKeys.map(key => (dataArray.find(entry => entry.key === key)?.month_to_date || 0).toString())];

  const daytonRowArr = daytonRowData.map((data, colIndex) => ({
    text: colIndex === 0 ? (' ' + data) : ('  ' + data),
    width: colIndex === 0 ? 0.065 : 0.1, // Adjust the width as needed
  }));

  const daytonRowCellHeight = Math.max(...daytonRowArr.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }))) + textSpacer * 2;

  doc.lineWidth(0.3).strokeColor('lightgrey');
  doc.lineJoin('miter').rect(x, y, pageWidth, daytonRowCellHeight).stroke();

  let daytonRowWriterPos = x;
  for (let i = 0; i < daytonRowArr.length - 1; i++) {
    daytonRowWriterPos += daytonRowArr[i].width * pageWidth;
    doc.lineCap('butt').moveTo(daytonRowWriterPos + textSpacer, y).lineTo(daytonRowWriterPos + textSpacer, y + daytonRowCellHeight).stroke();
  }

  let daytonRowTextWriterPos = x + textSpacer;
  for (let i = 0; i < daytonRowArr.length; i++) {
    if (i === 0) {
      doc.fillColor('lightgrey').rect(x, y, daytonRowArr[i].width * pageWidth + 8, daytonRowCellHeight).fill();
    }
    doc.fillColor('black').text(daytonRowArr[i].text, daytonRowTextWriterPos, y + textSpacer, {
      continued: false,
      width: daytonRowArr[i].width * pageWidth - (textSpacer + 5),
    });
    daytonRowTextWriterPos += daytonRowArr[i].width * pageWidth + (textSpacer - 5);
  }

  y += daytonRowCellHeight;


  doc.moveDown(2);
  doc.text('', doc.page.margins.left);


}





