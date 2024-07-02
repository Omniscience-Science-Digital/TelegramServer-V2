const { processData } = require('../services/mqtt.service');



exports.Mqttcontroller = async (req, res) => {
    try {
        // Access the id from the request body
        const { csvData, adMapping, address } = req.body;

        let date;
        let iccid;

        const headers = csvData[0];


        const headerIndexMap = {};
        headers.forEach((header, index) => {
            headerIndexMap[header] = index;
        });


        // delete adMapping['Name'];

        let jsonResult = {
            "modbus-dev": {
                "addr": address,
                "pts": [],
            },
        };

        let combinedResult = [];

        // Loop through each row in csvData (excluding headers)
        for (let i = 1; i < csvData.length; i++) {

            const row = csvData[i];


            //reset obj
            jsonResult = {
                "modbus-dev": {
                    "addr": address,
                    "pts": [],
                },
            };



            for (let key in adMapping) {
                if (key === "Name") {
                    delete adMapping[key];
                }

                if (adMapping.hasOwnProperty(key)) {

                    if (row[0]) {

                        iccid = row[0];
                    }

                    date = row[1];

                    const adValue = adMapping[key];
                    const columnIndex = headerIndexMap[key];

                    if (columnIndex !== undefined) {
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
            
            // console.log(combinedResult)
            // Publish MQTT message
            // await processData(combinedResult, '7082229037010123040');
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
