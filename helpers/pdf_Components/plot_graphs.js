
async function generateflowShifttonsGraph(doc, flowBuffer,  flowheight, shiftheight) {


    if (flowBuffer) {
      doc.image(flowBuffer, 50, flowheight, { width: 500 });
    } else {
      console.error('Error: flowbuffer is undefined.');
      return;
    }
  
    // if (cyclonebuffer) {
    //   doc.image(cyclonebuffer, 50, shiftheight, { width: 500 });
    // }
    // else {
  
      doc.image("./assets/shift.png", 23, shiftheight, { width: 550, height: 190 })
        .fillColor("#61677A")
        .moveDown();
  //  }
  
  
  
  
  
  }


  async function drawPieCharts(doc, pieCharts) {

    

    // Iterate over pieCharts
    for (const pieChart of pieCharts) {
      const { buffer, cordx, cordy } = pieChart;
  
  
      // Check if both buffer and cordx, cordy are defined
      if (buffer && cordx !== undefined && cordy !== undefined) {
        // Use doc.image to embed the image in the PDF with width and height options
        doc.image(buffer, cordx, cordy, { width: 300, height: 115 }); // Adjust width and height as needed
      }
    }
  }
  module.exports={
    drawPieCharts,
    generateflowShifttonsGraph
  }