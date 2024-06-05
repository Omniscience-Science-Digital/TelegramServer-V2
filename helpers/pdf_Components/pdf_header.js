
module.exports.generateHeader=(doc)=> {
    doc.image("./assets/logo.png", 15, 20, { width: 112 })
      .fillColor("#61677A")
      .fontSize(8)
      .text("info@mass.kg ,012 943 0118", 410, 20)
      .text("234 Glover Avenue, Die Hoewes", 410, 30)
      .text("Waterford court, Unit D-19 Centurion, South Africa", 410, 40)
      .moveDown();
  }


module.exports.drawRectangleWithNoText=(doc, posY) =>{
  const pageWidth = 595.28; // Adjust as needed

  const darkGrayShade = '#45474B'; // Dark gray color

  const darkGrayHeight = 2;   // Adjust the height of the dark gray rectangle on top

  // Draw a smaller dark gray rectangle on top
  doc.fillColor(darkGrayShade).rect(20, posY, pageWidth - 40, darkGrayHeight).fill();

}