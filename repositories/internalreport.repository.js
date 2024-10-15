const db = require('../configs/postgress_db');


exports.graphQueryModbus = async (startTime, endTime, triggerStart, triggerEnd, startdate, enddate, iccid) => {


    try {
        const query = `WITH ValueLag1 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
        (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0') AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
ValueLag2 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
        datasourcekey = 'modbus-2-13' AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
ValueLag3 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
         public.devicelogs_production_${iccid}
    WHERE 
        datasourcekey = 'modbus-1-9'  AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        AND NOT (date::time BETWEEN TIME '${triggerStart}' - INTERVAL '3 minutes'  AND TIME '${triggerStart}' + INTERVAL '3 minutes' ) 
	    AND NOT (date::time BETWEEN TIME '${triggerEnd}' - INTERVAL '3 minutes'  AND TIME '${triggerEnd}' + INTERVAL '3 minutes') 
),
DatapointsCount AS (
    SELECT 
        COUNT(value) AS count_ofDatapoints

        From
    public.devicelogs_production_${iccid}
    WHERE 
        (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1') AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
LastLog AS (
    SELECT 
        iccid,
        value,
        date
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
        (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1')  
        AND date BETWEEN ('${enddate} ${endTime}'::timestamp - INTERVAL '2 hours') AND '${enddate} ${endTime}'::timestamp
    ORDER BY date DESC
    LIMIT 1
)
SELECT
    CASE 
        WHEN (SELECT MAX(value::numeric) 
        From
        public.devicelogs_production_${iccid} 
              WHERE (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0') 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') > 750000 
        THEN 'exceeded' ELSE 'maintained' 
    END AS is_value_greater_than_750k,
    
    CASE 
        WHEN (SELECT MIN(value::numeric) 
         From
         public.devicelogs_production_${iccid} 
              WHERE datasourcekey = 'battery' 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') < 50 
        THEN 'critical' ELSE 'good' 
    END AS is_battery_less_than_50,

    CASE 
        WHEN (SELECT COUNT(CASE WHEN value = 'OFF' THEN 1 END) 
        From
              public.devicelogs_production_${iccid} 
              WHERE (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1') 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') > 0 
        THEN 'offline' ELSE 'online' 
    END AS is_Modbus_OFF,

    CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag1 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'decreased' ELSE 'stable' 
    END AS totalizer_reset,

    CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag2 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'reset' ELSE 'stable'
    END AS monthtons_reset,

        CASE 
        WHEN COALESCE((SELECT count_ofDatapoints FROM DatapointsCount), 0) = 0 
        THEN 'unsurpassed'
        WHEN (720 / COALESCE((SELECT count_ofDatapoints FROM DatapointsCount), 1)) > 15 
        THEN 'surpassed' 
        ELSE 'unsurpassed' 
    END AS datatransmission_require_attention,

      CASE 
        WHEN EXISTS (SELECT 1 FROM LastLog) 
        THEN 'updating' 
        ELSE 'iot offline' 
    END AS status,
       CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag3 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'shiftons reset' ELSE 'stable' 
    END AS shiftons_reset; `;


    console.log(query)

        const result = await db.query(query);


        // Extract the "flowdata" value from the rows
        const shiftons = result.rows;


        const rowArray = Object.values(shiftons[0]);



        return rowArray;
    } catch (error) {
        console.error('Error calculating graph Shifttons for evening:', error);
        return null; // Return null in case of an error
    }
};



exports.graphQueryModbusPlc = async (startTime, endTime, triggerStart, triggerEnd, startdate, enddate, modbusIccid, iccid) => {


    try {
        const query = `WITH ValueLag1 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
    
        datasourcekey = '${modbusIccid}' AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
ValueLag2 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
        datasourcekey = 'modbus-2-13' AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
ValueLag3 AS (
    SELECT  
        iccid,
        LAG(value::numeric, 1) OVER (ORDER BY date) AS prev_value,
        value::numeric AS value
    FROM
         public.devicelogs_production_${iccid}
    WHERE 
        datasourcekey = 'modbus-1-9'  AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        AND NOT (date::time BETWEEN TIME '${triggerStart}' - INTERVAL '3 minutes'  AND TIME '${triggerStart}' + INTERVAL '3 minutes' ) 
	    AND NOT (date::time BETWEEN TIME '${triggerEnd}' - INTERVAL '3 minutes'  AND TIME '${triggerEnd}' + INTERVAL '3 minutes') 
),
DatapointsCount AS (
    SELECT 
        COUNT(value) AS count_ofDatapoints

        From
    public.devicelogs_production_${iccid}
    WHERE 
        (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1') AND
        date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
),
LastLog AS (
    SELECT 
        iccid,
        value,
        date
    FROM
        public.devicelogs_production_${iccid}
    WHERE 
        (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1')  
        AND date BETWEEN ('${enddate} ${endTime}'::timestamp - INTERVAL '2 hours') AND '${enddate} ${endTime}'::timestamp
    ORDER BY date DESC
    LIMIT 1
)
SELECT
    CASE 
        WHEN (SELECT MAX(value::numeric) 
        From
        public.devicelogs_production_${iccid} 
              WHERE datasourcekey = '${modbusIccid}'
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') > 750000 
        THEN 'exceeded' ELSE 'maintained' 
    END AS is_value_greater_than_750k,
    
    CASE 
        WHEN (SELECT MIN(value::numeric) 
         From
         public.devicelogs_production_${iccid} 
              WHERE datasourcekey = 'battery' 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') < 50 
        THEN 'critical' ELSE 'good' 
    END AS is_battery_less_than_50,

    CASE 
        WHEN (SELECT COUNT(CASE WHEN value = 'OFF' THEN 1 END) 
        From
              public.devicelogs_production_${iccid} 
              WHERE (datasourcekey = 'modbus-1--1' OR datasourcekey = 'modbus-1-1') 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}') > 0 
        THEN 'offline' ELSE 'online' 
    END AS is_Modbus_OFF,

    CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag1 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'decreased' ELSE 'stable' 
    END AS totalizer_reset,

    CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag2 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'reset' ELSE 'stable'
    END AS monthtons_reset,

        CASE 
        WHEN COALESCE((SELECT count_ofDatapoints FROM DatapointsCount), 0) = 0 
        THEN 'unsurpassed'
        WHEN (720 / COALESCE((SELECT count_ofDatapoints FROM DatapointsCount), 1)) > 15 
        THEN 'surpassed' 
        ELSE 'unsurpassed' 
    END AS datatransmission_require_attention,

      CASE 
        WHEN EXISTS (SELECT 1 FROM LastLog) 
        THEN 'updating' 
        ELSE 'iot offline' 
    END AS status,
       CASE 
        WHEN EXISTS (
            SELECT 1 FROM ValueLag3 
            WHERE prev_value IS NOT NULL AND value < prev_value
        ) 
        THEN 'shiftons reset' ELSE 'stable' 
    END AS shiftons_reset; `;

        const result = await db.query(query);


        // Extract the "flowdata" value from the rows
        const shiftons = result.rows;


        const rowArray = Object.values(shiftons[0]);



        return rowArray;
    } catch (error) {
        console.error('Error calculating graph Shifttons for evening:', error);
        return null; // Return null in case of an error
    }
};