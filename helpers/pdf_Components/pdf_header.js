
module.exports.generateHeader=(doc)=> {
    doc.image("./assets/logo.png", 15, 20, { width: 112 })
      .fillColor("#61677A")
      .fontSize(8)
      .text("info@mass.kg ,012 943 0118", 410, 20)
      .text("234 Glover Avenue, Die Hoewes", 410, 30)
      .text("Waterford court, Unit D-19 Centurion, South Africa", 410, 40)
      .moveDown();
  }

  module.exports.generateHeaderStatusreport=(doc)=> {
    doc.image("./assets/logo.png", 15, 20, { width: 112 })
      .fillColor("#0D63A5")
      .fontSize(8)
      .text("info@mass.kg ,012 943 0118", 660, 20)
      .text("234 Glover Avenue, Die Hoewes", 660, 30)
      .text("Waterford court, Unit D-19 Centurion, South Africa", 660, 40)
      .moveDown();
  }

module.exports.drawRectangleWithNoText=(doc, posY) =>{
  const pageWidth = 595.28; // Adjust as needed

  const darkGrayShade = '#45474B'; // Dark gray color

  const darkGrayHeight = 2;   // Adjust the height of the dark gray rectangle on top

  // Draw a smaller dark gray rectangle on top
  doc.fillColor(darkGrayShade).rect(20, posY, pageWidth - 40, darkGrayHeight).fill();

}

module.exports.drawRectangleWithNoTextStatusreport=(doc, posY) =>{
  const pageWidth = 841.89; // Adjust as needed

  const darkGrayShade = '#03346E'; // Dark gray color

  const darkGrayHeight = 2;   // Adjust the height of the dark gray rectangle on top

  // Draw a smaller dark gray rectangle on top
  doc.fillColor(darkGrayShade).rect(16, posY, pageWidth-32 , darkGrayHeight).fill();

}



module.exports.generatePlantName=(doc, plantName,customerInformationTop)=> {
  const len = plantName.length;
  const pageWidth = 595.28;
  const textSpacer = 5;
  const lightGrayHeight = 15; // Adjust the height as needed
  const grayShade = '#f2f2f2'; // Use a valid color value

  // Draw the light gray rectangle
  doc.fillColor(grayShade).rect(20, customerInformationTop, pageWidth - 40, lightGrayHeight).fill();

  // Draw the plant name
  doc
    .font('Times-Bold')
    .fontSize(9)
    .fillColor('black')
    .text(plantName.toUpperCase(), len / 2, customerInformationTop + textSpacer, {
      width: pageWidth - 2 * textSpacer - 40, // Adjust for padding
      align: 'center',
      underline: true,
    })
    .moveDown(); // Move down for spacing
}

module.exports.generateStatusName=(doc, plantName,customerInformationTop)=> {
  const len = plantName.length;
  const pageWidth = 841.89;
  const textSpacer = 5;
  const lightGrayHeight = 18; // Adjust the height as needed
  const grayShade = '#0D63A5'; // Use a valid color value

  // Draw the light gray rectangle
  doc.fillColor(grayShade).rect(16, customerInformationTop, pageWidth -32, lightGrayHeight).fill();

  // Draw the plant name
  doc
    .font('Times-Bold')
    .fontSize(10)
    .fillColor('white')
    .text(plantName.toUpperCase(), len / 2, customerInformationTop + textSpacer, {
      width: pageWidth - 2 * textSpacer - 40, // Adjust for padding
      align: 'center'
    })
    .moveDown(); // Move down for spacing
}