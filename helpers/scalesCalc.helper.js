
module.exports.parseScales = (scales) => {

    // Access the L array inside the first element of scales
    const sortedscales = scales?.L[0]?.L || [];


    // Check if sortedscales is an array and map over it
    return Array.isArray(sortedscales) ? sortedscales.map((scale) => {
        // Get the key of the object inside scale.M
        const scaleKey = Object.keys(scale.M)[0];

        // Get the value of the key, assuming it has a nested structure with S property
        const scaleValue = scale.M[scaleKey]?.S || '';

        // Create the scale object
        const scaleObject = {};
        scaleObject[scaleKey] = scaleValue;

        return scaleObject;
    }) : [];
}




module.exports.samePlantCalc_ProcessScales = (scales) => {
    // Filter scales array to exclude scales with `scaleName` starting with sitename prefix
    const newScales = scales.filter(scale => {
      const scaleName = scale?.scaleName?.S;
  
      // Check if scaleName starts with # 
      return !(scaleName && (scaleName.startsWith('#')));
    });



    return newScales;
  };


  module.exports.clearHashKeys = (obj) => {

    // Remove objects where the key starts with '#'
    obj.total_shifttons = obj.total_shifttons.filter(item => !item.key.startsWith('#'));

    return obj;

  };
  