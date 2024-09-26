module.exports.generateFooter=(doc) =>{
    const footerHeight = 28; // Adjust this value based on your layout needs
    const rectangleHeight = 25; // Adjust the height of the rectangle
    const fontSize = 7; // Adjust the font size for the text
    const textColor = '#000'; // Adjust the color of the text
    const rectangleColor = '#f0f0f0'; // Adjust the color of the rectangle
    const textPositionAboveRectangle = 5; // Adjust the vertical position of the text above the rectangle
  
    const pageWidth = 595.28; // A4 page width
  
    // Draw the rectangle
    doc.fillColor(rectangleColor).rect(10, 841 - footerHeight, pageWidth - 20, rectangleHeight).fill();
    // Adjusted width of the rectangle to fit within the page boundaries
  
    // Set font, font size, and color for the text
    doc.font('Times-Roman').fontSize(fontSize).fillColor(textColor);
  
    // Adjust the position and width of the text to fit within the rectangle
    doc.text(
      `The content of this report is confidential and remains the property of MASS KG (pty). It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.`,
      15,
      841 - footerHeight + textPositionAboveRectangle, // Adjust the vertical position of the text
      { width: pageWidth - 30 } // Adjusted width of the text to fit within the page boundaries
    );
  
  }


  
  

  module.exports.generateFooterStatusreport=(doc) =>{
    const footerHeight = 28; // Adjust this value based on your layout needs
    const rectangleHeight = 25; // Adjust the height of the rectangle
    const fontSize = 7; // Adjust the font size for the text
    const textColor = '#000'; // Adjust the color of the text
    const rectangleColor = '#f0f0f0'; // Adjust the color of the rectangle
    const textPositionAboveRectangle = 5; // Adjust the vertical position of the text above the rectangle
  
    const pageWidth = 841.89; // A4 page width
  
    // Draw the rectangle
    doc.fillColor(rectangleColor).rect(10, 1160 , pageWidth - 20, rectangleHeight).fill();
    // Adjusted width of the rectangle to fit within the page boundaries
  
    // Set font, font size, and color for the text
    doc.font('Times-Roman').fontSize(fontSize).fillColor(textColor);
  
    // Adjust the position and width of the text to fit within the rectangle
    doc.text(
      `The content of this report is confidential and remains the property of MASS KG (pty). It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.`,
      15,
      1160  + textPositionAboveRectangle, // Adjust the vertical position of the text
      { width: pageWidth - 30,align: 'center'  } // Adjusted width of the text to fit within the page boundaries
    );
  
  }