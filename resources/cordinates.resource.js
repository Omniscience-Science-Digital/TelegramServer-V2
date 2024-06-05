// predifined cordinates depending on th number of charts in a line

module.exports = (chartBuffer) => {

  

    //dertemine which row is being called
    var row = 1;
    var bufferSize = chartBuffer.length;


    if (bufferSize % 2 === 0) {
        chartsPerrow = bufferSize / 2;

        const firstrow = Math.floor(bufferSize / 2);
        const secondrow = firstrow ;
        
        let coord1 = retrieveCordinate(firstrow, row++);
        
        const minLength1 = Math.min(chartBuffer.length, coord1.length);
        
        for (let i = 0; i < minLength1; i++) {
            chartBuffer[i].cordx = coord1[i].x;
            chartBuffer[i].cordy = coord1[i].y;
        }
        
        let coord2 = retrieveCordinate(secondrow, row);
        
        const minLength2 = Math.min(chartBuffer.length - minLength1, coord2.length);
        
        for (let i = 0; i < minLength2; i++) {
            chartBuffer[i + minLength1].cordx = coord2[i].x;
            chartBuffer[i + minLength1].cordy = coord2[i].y;
        }
        

    }
    else {
        const firstrow = Math.floor(bufferSize / 2);
        const secondrow = firstrow + 1;
        
        let coord1 = retrieveCordinate(firstrow, row++);
        
        const minLength1 = Math.min(chartBuffer.length, coord1.length);
        
        for (let i = 0; i < minLength1; i++) {
            chartBuffer[i].cordx = coord1[i].x;
            chartBuffer[i].cordy = coord1[i].y;
        }
        
        let coord2 = retrieveCordinate(secondrow, row);
        
        const minLength2 = Math.min(chartBuffer.length - minLength1, coord2.length);
        
        for (let i = 0; i < minLength2; i++) {
            chartBuffer[i + minLength1].cordx = coord2[i].x;
            chartBuffer[i + minLength1].cordy = coord2[i].y;
        }
        
    }

 
}



function retrieveCordinate(chartsPerrow,row) {

    let coordinates=[];
    var cordy = (row ===1) ? 338: 508;

    switch (chartsPerrow) {
        case 1:
            coordinates = [{ x: 145, y: cordy }];
            break;
        case 2:
            coordinates = [{ x: 75, y: cordy }, { x: 215, y: cordy }];
            break;
        case 3:
            coordinates = [{ x: 8, y: cordy }, { x: 150, y: cordy }, { x: 285, y: cordy }];
            break;
        case 4:
            coordinates = [{ x: -60, y: cordy }, { x: 80, y:cordy}, { x: 225, y: cordy }, { x: 360, y: cordy }];
            break;
     
    }

    return coordinates;
}