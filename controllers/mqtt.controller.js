const {processData} = require('../services/mqtt.service');




exports.Mqttcontroller = async (req, res) => {
    try {
        // Access the id from the request body
        const { csvData } = req.body;

        let date;
        let iccid;

        const headers = csvData[0];

        const headerIndexMap = {};
        headers.forEach((header, index) => {
            headerIndexMap[header] = index;
        });

        // Mapping the columns to ad values
        const adMapping = {
            "Sample": 0.0,
            "Ash": 1.0,
            "Cal": 2.0,
        };

        let jsonResult = {
            "modbus-dev": {
                "addr": 99.0,
                "pts": [],
            },
        };

        let combinedResult =[];
        // Loop through each row in csvData (excluding headers)
        for (let i = 1; i < csvData.length; i++) {
            
            const row = csvData[i];

            //reset obj
            jsonResult = {
                "modbus-dev": {
                    "addr": 99.0,
                    "pts": [],
                },
            };

            // Populate jsonResult with data from row
            for (const key in adMapping) {
                if (adMapping.hasOwnProperty(key)) {
                    iccid = row[0]; // ICCID is the first element in each row
                    date = row[1]; // Date is the second element in each row

                    const adValue = adMapping[key];
                    const columnIndex = headerIndexMap[key];

                    if (columnIndex !== undefined) { // Ensure columnIndex is defined
                        jsonResult["modbus-dev"]["pts"].push({
                            "ad": adValue,
                            "rt": 3.0,
                            "va": row[columnIndex],
                        });
                    } else {
                        console.warn(`Column ${key} not found in headers`);
                    }
                }
            }

            if (date) {
                let isoDate = new Date(date).toISOString();
                jsonResult['date'] = isoDate;
            }


            let databaseJson = JSON.stringify(jsonResult);

            combinedResult.push(databaseJson)

  
        }

   
        try {
       
            
            // Publish MQTT message
             await processData(combinedResult, iccid);
        } catch (error) {
            console.error(`Error publishing MQTT message: ${error}`);
            throw error; // Optionally rethrow to propagate the error further
        }


        res.status(200).send('Data Published');
    } catch (error) {
        console.error('Error in Mqttcontroller:', error);
        res.status(500).send('Internal server error');
    }
}
