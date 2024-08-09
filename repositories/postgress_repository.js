const db = require('../configs/postgress_db');



//shifttons 

const shiftTons = async (startTime, endTime, startdate, enddate, iccid, modbus_key) => {
  try {

    let query;


    //hard coding Discard kleinfontein
    if (iccid === 'devicelogs_production_8944501412219744671') {

      query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                value::numeric,
                date,
                ROW_NUMBER() OVER (ORDER BY date ASC) AS asc_row,
                ROW_NUMBER() OVER (ORDER BY date DESC) AS desc_row
            FROM
                public.devicelogs_production_8944501412219744671
            WHERE
                title = 'Totalizer1'
                AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            SUM(CASE WHEN desc_row = 1 THEN value::numeric ELSE 0 END) -
            SUM(CASE WHEN asc_row = 1 THEN value::numeric ELSE 0 END) AS Shifttons
        FROM
            filtered_data;
            
          `;
    }
    else {

      query = `
          WITH filtered_data AS (
              SELECT
              iccid,
              value::numeric,
              date,
              ROW_NUMBER() OVER (ORDER BY date ASC) as asc_row,
              ROW_NUMBER() OVER (ORDER BY date DESC) as desc_row
              FROM
              public.devicelogs_production_${iccid}
              WHERE
              ${modbus_key}
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
              )
              SELECT
              MAX(CASE WHEN desc_row = 1 THEN value::numeric END) - MAX(CASE WHEN asc_row = 1 THEN value::numeric END)
              AS Shifttons
              FROM
              filtered_data;
          
          `;

    }



    const result = await db.query(query);


    const shifttons = result.rows.map(row => row.shifttons);


    return shifttons;
  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }
};

const shiftTonsplc = async (startTime, endTime, startdate, enddate, title, plcIccid) => {
  try {

    let query;


    query = `
          WITH filtered_data AS (
              SELECT
              iccid,
              value::numeric,
              date,
              ROW_NUMBER() OVER (ORDER BY date ASC) as asc_row,
              ROW_NUMBER() OVER (ORDER BY date DESC) as desc_row
              FROM
              public.devicelogs_production_${plcIccid}
              WHERE
              (datasourcekey = '${title}') 
              AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
              )
              SELECT
              MAX(CASE WHEN desc_row = 1 THEN value::numeric END) - MAX(CASE WHEN asc_row = 1 THEN value::numeric END)
              AS Shifttons
              FROM
              filtered_data;
          
          `;





    const result = await db.query(query);


    const shifttons = result.rows.map(row => row.shifttons);


    return shifttons;
  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }
};


const startingHourtons = async (startTime, endTime, startdate, enddate, iccid, modbus_key) => {

  // Split the startTime string into hours and minutes
  const [startHour, startMinute] = endTime.split(':');



  // Convert the hours and minutes to numbers
  const hour = parseInt(startHour, 10);
  const minute = parseInt(startMinute, 10);

  const originalendTime = endTime;

  // Add one hour
  let newHour = (hour + 1) % 24;




  // Format the result as a 24-hour time string (HH:mm)
  endTime = `${newHour < 10 ? '0' : ''}${newHour}:${minute < 10 ? '0' : ''}${minute}`;



  let query;
  try {


    query = `WITH ranked_data AS (
      SELECT
          iccid,
          title,
          value,
          date,
          ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('hour', date) ORDER BY date DESC) AS row_num
      FROM
      public.devicelogs_production_${iccid}
      WHERE
      
      ${modbus_key}
      AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
  ),
  latest_value AS (
      SELECT
          iccid,
          title,
          value,
          date
      FROM
          ranked_data
      WHERE
          row_num = 1
  ),
  first_value AS (
      SELECT
          iccid,
          title,
          value,
          date
      FROM
      public.devicelogs_production_${iccid}
      WHERE
      
      ${modbus_key}
      AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
      ORDER BY
          date ASC
      LIMIT 1
  )
  SELECT
      iccid,
      title,
      value AS hourly_tons,
      date
  FROM
      first_value
  UNION ALL
  SELECT
      iccid,
      title,
      value AS hourly_tons,
      date
  FROM
      latest_value
  ORDER BY
      date;`;




    const result = await db.query(query);

    // Extract the "shifttons" value from the rows
    const starting_hourly_shifttons = result.rows.map(row => row.hourly_tons);


    return starting_hourly_shifttons;

  } catch (error) {
    console.error('Error listing starting Shiftons:', error);
    throw error;
  }
}
const startingPlcHourtons = async (shift, startTime, endTime, startdate, enddate, title, plcIccid) => {

  // Split the startTime string into hours and minutes
  const [startHour, startMinute] = endTime.split(':');

  // Convert the hours and minutes to numbers
  const hour = parseInt(startHour, 10);
  const minute = parseInt(startMinute, 10);

  const originalendTime = endTime;

  // Add one hour
  let newHour = (hour + 1) % 24;




  // Format the result as a 24-hour time string (HH:mm)
  endTime = `${newHour < 10 ? '0' : ''}${newHour}:${minute < 10 ? '0' : ''}${minute}`;


  let query;
  try {

    if (startTime === originalendTime) {
      query = `
      WITH ranked_data AS (
        (
            SELECT
                iccid,
                title,
                value,
                date,
                ROW_NUMBER() OVER (PARTITION BY EXTRACT(HOUR FROM date) ORDER BY date ASC) AS row_num
            FROM
               public.devicelogs_production_${plcIccid}
            WHERE
                (datasourcekey = '${title}' )
         AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        
        )
        UNION ALL
        (
            SELECT
                iccid,
                title,
                value,
                date,
                ROW_NUMBER() OVER (PARTITION BY EXTRACT(HOUR FROM date) ORDER BY date ASC) AS row_num
            FROM
               
           public.devicelogs_production_${plcIccid}
            WHERE
                (datasourcekey = '${title}' OR datasourcekey = 'modbus-17-0')
                AND date BETWEEN  timestamp  '${enddate} ${startTime}' AND  timestamp  '${enddate} ${endTime}' + interval '5 minutes'
        
        
        
        )
    )
    SELECT
        iccid,
        title,
        value as hourly_tons,
        date
    FROM
        ranked_data
    WHERE
        row_num = 1
    ORDER BY
        date;
    
     
      `;



    } else {

      query = `
      WITH ranked_data AS (
        SELECT
            iccid,
            title,
            value,
            date,
            ROW_NUMBER() OVER (PARTITION BY EXTRACT(HOUR FROM date) ORDER BY date ASC) AS row_num
        FROM
        public.devicelogs_production_${plcIccid}
        WHERE
        (datasourcekey = '${title}' )
        AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    )
    SELECT
        iccid,
        title,
        value as hourly_tons,
        date
    FROM
        ranked_data
    WHERE
        row_num = 1
    ORDER BY
        date;
      `;


    }



    const result = await db.query(query);

    // Extract the "shifttons" value from the rows
    const starting_hourly_shifttons = result.rows.map(row => row.hourly_tons);


    return starting_hourly_shifttons;

  } catch (error) {
    console.error('Error listing starting Shiftons:', error);
    throw error;
  }
}

exports.hourlyShifttons = async (shift, startTime, endTime, startdate, enddate, iccid) => {

  try {


    var modbus_key = `(datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0')`;
    //for period shift tons
    let Shifttons = await shiftTons(startTime, endTime, startdate, enddate, iccid, modbus_key);

    let myData = await startingHourtons(startTime, endTime, startdate, enddate, iccid, modbus_key);

    if (Shifttons) {
      if (parseFloat(Shifttons[0]) < 0) {
        var modbus_key = `(datasourcekey = 'modbus-1-13')`;
        Shifttons = await shiftTons(startTime, endTime, startdate, enddate, iccid, modbus_key);
        myData = await startingHourtons(startTime, endTime, startdate, enddate, iccid, modbus_key);


      }


    }







    // Initialize the result array
    const differences = [];
    let accumulating_sum = 0;

    // Calculate differences with error handling
    for (let i = 1; i < myData.length; i++) {
      const num1 = parseFloat(myData[i - 1]);
      const num2 = parseFloat(myData[i]);

      if (!isNaN(num1) && !isNaN(num2)) {
        let diff = (num2 - num1);
        if (diff < 0)
          diff = 0
        accumulating_sum += (diff)

        differences.push(parseFloat(accumulating_sum).toFixed(2));
      } else {
        console.error(`Invalid data at index ${i - 1} or ${i}`);
      }
    }



    return { Shifttons: Shifttons, Accumulating_Sum: parseFloat(accumulating_sum).toFixed(2), hourlytons: differences };



  } catch (error) {
    console.error('Error:', error);
    throw error;
  }

}


exports.hourlyPlcShifttons = async (shift, startTime, endTime, startdate, enddate, title, plcIccid) => {

  try {


    //for period shift tons
    const Shifttons = await shiftTonsplc(startTime, endTime, startdate, enddate, title, plcIccid);


    //hourly Shift tons
    const myData = await startingPlcHourtons(shift, startTime, endTime, startdate, enddate, title, plcIccid);





    // Initialize the result array
    const differences = [];
    let accumulating_sum = 0;

    // Calculate differences with error handling
    for (let i = 1; i < myData.length; i++) {
      const num1 = parseFloat(myData[i - 1]);
      const num2 = parseFloat(myData[i]);

      if (!isNaN(num1) && !isNaN(num2)) {
        let diff = (num2 - num1);
        if (diff < 0)
          diff = 0
        accumulating_sum += (diff)

        differences.push(parseFloat(accumulating_sum).toFixed(2));
      } else {
        console.error(`Invalid data at index ${i - 1} or ${i}`);
      }
    }



    return { Shifttons: Shifttons, Accumulating_Sum: parseFloat(accumulating_sum).toFixed(2), hourlytons: differences };



  } catch (error) {
    console.error('Error:', error);
    throw error;
  }

}

//flow data values


exports.getFlowValues = async (startTime, endTime, startdate, enddate, iccid) => {
  try {
    const query = `SELECT DISTINCT ON (date)
    date AS interval_start,
    iccid,
    value::numeric AS monthTons
    FROM
    public.devicelogs_production_${iccid}
    WHERE
    (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
    AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    ORDER BY
        date ASC;

      
      `;


    const result = await db.query(query);


    // Extract the "flowdata" value from the rows
    const flowdata = result.rows;



    return flowdata;
  } catch (error) {
    console.error('Error calculating averages:', error);
    throw error;
  }
};

exports.getPlcFlowValues = async (startTime, endTime, startdate, enddate, title, plcIccid) => {
  try {
    const query = `SELECT DISTINCT ON (date)
    date AS interval_start,
    iccid,
    value::numeric AS monthTons
    FROM
    public.devicelogs_production_${plcIccid}
    WHERE
    datasourcekey='${title}'
    AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    ORDER BY
        date ASC;      
      `;


    const result = await db.query(query);


    // Extract the "flowdata" value from the rows
    const flowdata = result.rows;



    return flowdata;
  } catch (error) {
    console.error('Error calculating averages:', error);
    throw error;
  }
};


//cyclone data graph 

exports.getPlcCycloneValues = async (startTime, endTime, startdate, enddate, title, plcIccid) => {
  try {
    const query = `SELECT DISTINCT ON (date)
    date AS interval_start,
    iccid,
    value::numeric AS monthTons
    FROM
    public.devicelogs_production_${plcIccid}
    WHERE
    datasourcekey='${title}'
    AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    ORDER BY
        date ASC;      
      `;


    const result = await db.query(query);


    // Extract the "flowdata" value from the rows
    const flowdata = result.rows;



    return flowdata;
  } catch (error) {
    console.error('Error calculating averages:', error);
    throw error;
  }
};


//shift tons data 


exports.graphQueryShiftons = async (startTime, endTime, startdate, enddate, iccid) => {
  try {
    const query = `
      SELECT DISTINCT ON (date)
      date AS interval_start,
      iccid,
      value::numeric AS monthTons
    FROM
    public.devicelogs_production_${iccid}
    WHERE
    (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0') 
    AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    ORDER BY
      date ASC;
    `;


    const result = await db.query(query);

    // Extract the "flowdata" value from the rows
    const shiftons = result.rows;

    return shiftons;
  } catch (error) {
    console.error('Error calculating graph Shifttons for evening:', error);
    return null; // Return null in case of an error
  }
};


exports.graphQueryPlcShiftons = async (startTime, endTime, startdate, enddate, title, plcIccid) => {
  try {
    const query = `
      SELECT DISTINCT ON (date)
      date AS interval_start,
      iccid,
      value::numeric AS monthTons
    FROM
    public.devicelogs_production_${plcIccid}
    WHERE
    (datasourcekey = '${title}') 
    AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    ORDER BY
      date ASC;
    `;


    const result = await db.query(query);

    // Extract the "flowdata" value from the rows
    const shiftons = result.rows;

    return shiftons;
  } catch (error) {
    console.error('Error calculating graph Shifttons for evening:', error);
    return null; // Return null in case of an error
  }
};

/**Series Scale cals**/

//flow value function
exports.averageFlowWithIccid = async (startTime, endTime, startdate, enddate, flowtitle, flowiccid, runningtph) => {
  try {
    const query = `
        WITH AllValues AS (
            SELECT
                COUNT(*) AS total_count,
                AVG(value::numeric) AS average_flow
            FROM
                public.devicelogs_production_${flowiccid}
            WHERE
                title = '${flowtitle}'
                AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        ),
        Above10Values AS (
            SELECT
                COUNT(*) AS count_above_runningFlow,
                AVG(value::numeric) AS average_flow_above_runningFlow,
                SUM(value::numeric) AS sum_above_runningFlow
            FROM
                public.devicelogs_production_${flowiccid}
            WHERE
                title = '${flowtitle}'
                AND value::numeric > ${runningtph}
                AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        
        SELECT
            total_count,
            average_flow,
            count_above_runningFlow,
            average_flow_above_runningFlow,
            sum_above_runningFlow,
            CASE
                WHEN total_count > 0 THEN count_above_runningFlow::numeric / total_count
                ELSE NULL -- or set to 0 or any default value you prefer
            END AS availability
        FROM
            Above10Values, AllValues;
        `;


    const result = await db.query(query);

    // Extract the "shifttons" value from the rows
    const flowdata = result.rows[0];

    return flowdata;

  } catch (error) {
    console.error('Error calculating averages:', error);
    throw error;
  }
};

//calculate run time
exports.runtimeFlowIccid = async (flowtitle, flowiccid, startTime, endTime, startdate, enddate, runningtph) => {
  try {

    const query = `
      WITH filtered_data AS (
        SELECT
            title,
            value::numeric AS numeric_value,
            date,
            LAG(date) OVER (ORDER BY date) AS previous_date
        FROM
        public.devicelogs_production_${flowiccid}
         WHERE
        title = '${flowtitle}'
        AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    )
    SELECT
        
        SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
    FROM
        filtered_data
    WHERE
    numeric_value > ${runningtph}
        AND previous_date IS NOT NULL
  
      `;



    const result = await db.query(query);


    let runtime = result.rows.map(row => row);


    if (runtime.length === 0) {

      runtime = [{ 'sum_of_time_delta_in_hours': 0 }];

    }


    return runtime;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


//actual start time 

exports.ActualStart = async (startTime, endTime, startdate, enddate, running_tph, iccid) => {
  try {
    const query = `WITH FlowData AS (
          SELECT
            title,
            CAST(value AS numeric) AS value,
            date,
            LAG(CAST(value AS numeric)) OVER (ORDER BY date) AS prev_value,
            LEAD(CAST(value AS numeric)) OVER (ORDER BY date) AS next_value
          FROM
          public.devicelogs_production_${iccid}
          WHERE
          (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
          AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
          MIN(date) AS first_time_above_10
        FROM (
          SELECT

            date,
            value,
            LEAD(CAST(value AS numeric)) OVER (ORDER BY date) AS next_value,
            LEAD(CAST(value AS numeric), 2) OVER (ORDER BY date) AS second_next_value
          FROM
            FlowData
        ) subquery
        WHERE
          CAST(value AS numeric) > ${running_tph}
          AND CAST(next_value AS numeric) > ${running_tph}
          AND CAST(second_next_value AS numeric) > ${running_tph}
     
      `;


    const result = await db.query(query);

    const actualStart = result.rows.map(row => row);


    return actualStart;
  } catch (error) {
    console.error('Error listing actualStart tables:', error);
    throw error;
  }
};


//actual end time
exports.ActualEnd = async (startTime, endTime, startdate, enddate, running_tph, iccid) => {
  try {
    const query = ` WITH FlowData AS (
        SELECT
            iccid,
            title,
            CAST(value AS numeric) AS value,
            date,
            LAG(CAST(value AS numeric)) OVER (ORDER BY date) AS prev_value,
            LAG(CAST(value AS numeric), 2) OVER (ORDER BY date) AS second_prev_value
        FROM
        public.devicelogs_production_${iccid}
        WHERE
          (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
          AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    )
    SELECT
        iccid,
        MAX(date) AS last_time_above_10
    FROM
        FlowData
    WHERE
        CAST(value AS numeric) > ${running_tph}
        AND CAST(prev_value AS numeric) > ${running_tph}
        AND CAST(second_prev_value AS numeric) > ${running_tph}
    GROUP BY
        iccid;
          
      `;

    const result = await db.query(query);

    const actualStart = result.rows.map(row => row);


    return actualStart;
  } catch (error) {
    console.error('Error listing actualStart tables:', error);
    throw error;
  }
};

//


exports.ActualPlcStart = async (startTime, endTime, startdate, enddate, plcIccid, flowtitle, runningtph) => {
  try {
    const query = `WITH FlowData AS (
          SELECT
            title,
            CAST(value AS numeric) AS value,
            date,
            LAG(CAST(value AS numeric)) OVER (ORDER BY date) AS prev_value,
            LEAD(CAST(value AS numeric)) OVER (ORDER BY date) AS next_value
          FROM
          public.devicelogs_production_${plcIccid}
          WHERE
          datasourcekey='${flowtitle}'
          
          AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
          MIN(date) AS first_time_above_10
        FROM (
          SELECT

            date,
            value,
            LEAD(CAST(value AS numeric)) OVER (ORDER BY date) AS next_value,
            LEAD(CAST(value AS numeric), 2) OVER (ORDER BY date) AS second_next_value
          FROM
            FlowData
        ) subquery
        WHERE
          CAST(value AS numeric) > ${runningtph}
          AND CAST(next_value AS numeric) > ${runningtph}
          AND CAST(second_next_value AS numeric) > ${runningtph}
     
      `;



    const result = await db.query(query);

    const actualStart = result.rows.map(row => row);


    return actualStart;
  } catch (error) {
    console.error('Error listing actualStart tables:', error);
    throw error;
  }
};


exports.ActualPlcEnd = async (startTime, endTime, startdate, enddate, plcIccid, flowtitle, runningtph) => {
  try {
    const query = ` WITH FlowData AS (
        SELECT
            iccid,
            title,
            CAST(value AS numeric) AS value,
            date,
            LAG(CAST(value AS numeric)) OVER (ORDER BY date) AS prev_value,
            LAG(CAST(value AS numeric), 2) OVER (ORDER BY date) AS second_prev_value
        FROM
        public.devicelogs_production_${plcIccid}
        WHERE
        datasourcekey='${flowtitle}'
          AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
    )
    SELECT
        iccid,
        MAX(date) AS last_time_above_10
    FROM
        FlowData
    WHERE
        CAST(value AS numeric) > ${runningtph}
        AND CAST(prev_value AS numeric) > ${runningtph}
        AND CAST(second_prev_value AS numeric) > ${runningtph}
    GROUP BY
        iccid;
          
      `;

    const result = await db.query(query);

    const actualStart = result.rows.map(row => row);


    return actualStart;
  } catch (error) {
    console.error('Error listing actualStart tables:', error);
    throw error;
  }
};


/***Single Scale calcs ***/

exports.singleScaleFlow = async (startTime, endTime, startdate, enddate, iccid, running_tph) => {

  try {
    const query = `    WITH AllValues AS (
            SELECT
                COUNT(*) AS total_count,
                AVG(value::numeric) AS average_flow
            FROM
            public.devicelogs_production_${iccid}
            WHERE
            (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        ),
        Above10Values AS (
            SELECT
                COUNT(*) AS count_above_runningFlow,
                AVG(value::numeric) AS average_flow_above_runningFlow,
                SUM(value::numeric) AS sum_above_runningFlow
            FROM
            public.devicelogs_production_${iccid}
            WHERE
            (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
                AND value::numeric > ${running_tph}
                AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        
        SELECT
            total_count,
            average_flow,
            count_above_runningFlow,
            average_flow_above_runningFlow,
            sum_above_runningFlow,
            CASE
                WHEN total_count > 0 THEN count_above_runningFlow::numeric / total_count
                ELSE NULL -- or set to 0 or any default value you prefer
            END AS availability
        
        FROM
            Above10Values, AllValues;
        
        `;

    const result = await db.query(query);

    // Extract the "shifttons" value from the rows
    const flowdata = result.rows[0];




    return flowdata;
  } catch (error) {
    console.error('Error listing Single scale flow values :', error);
    throw error;
  }

}



exports.plcScaleFlow = async (startTime, endTime, startdate, enddate, iccid, title, running_tph) => {

  try {
    const query = `    WITH AllValues AS (
            SELECT
                COUNT(*) AS total_count,
                AVG(value::numeric) AS average_flow
            FROM
            public.devicelogs_production_${iccid}
            WHERE
         datasourcekey='${title}'
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        ),
        Above10Values AS (
            SELECT
                COUNT(*) AS count_above_runningFlow,
                AVG(value::numeric) AS average_flow_above_runningFlow,
                SUM(value::numeric) AS sum_above_runningFlow
            FROM
            public.devicelogs_production_${iccid}
            WHERE
            datasourcekey='${title}'
                AND value::numeric > ${running_tph}
                AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        
        SELECT
            total_count,
            average_flow,
            count_above_runningFlow,
            average_flow_above_runningFlow,
            sum_above_runningFlow,
            CASE
                WHEN total_count > 0 THEN count_above_runningFlow::numeric / total_count
                ELSE NULL -- or set to 0 or any default value you prefer
            END AS availability
        
        FROM
            Above10Values, AllValues;
        
        `;


    const result = await db.query(query);

    // Extract the "shifttons" value from the rows
    const flowdata = result.rows[0];




    return flowdata;
  } catch (error) {
    console.error('Error listing Single scale flow values :', error);
    throw error;
  }

}

//Independentflow


exports.runtimeFlowValues = async (startTime, endTime, startdate, enddate, runningtph, iccid) => {
  try {


    const query = `WITH filtered_data AS (
      SELECT
          iccid,
          title,
          value::numeric AS numeric_value,
          date,
          LAG(date) OVER (PARTITION BY iccid ORDER BY date) AS previous_date,
          ROW_NUMBER() OVER (PARTITION BY iccid ORDER BY date) AS row_number
      FROM
          public.devicelogs_production_${iccid}
      WHERE
          (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
  )
  
  SELECT
      SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS "Run Time (hrs)",
      MAX(numeric_value) AS "Run Max (tph)",
      AVG(numeric_value) AS "Run Avge (tph)"
  FROM
      filtered_data
  WHERE
      numeric_value > '${runningtph}'
      AND previous_date IS NOT NULL
  GROUP BY
      iccid;
  `;
  


    const result = await db.query(query);



    const flowvalues = result.rows.map(row => row);


    return flowvalues;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}

//runtime single scale

exports.runtimeFlow = async (startTime, endTime, startdate, enddate, runningtph, iccid) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${iccid}
            WHERE
            (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            iccid,
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
        FROM
            filtered_data
        WHERE
            numeric_value > '${runningtph}'
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;



    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


exports.runtimePlcFlow = async (startTime, endTime, startdate, enddate, plcIccid, flowtitle, runningtph) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${plcIccid}
            WHERE
            datasourcekey='modbus-1-4'
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            iccid,
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
        FROM
            filtered_data
        WHERE
            numeric_value > '${runningtph}'
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;

      

    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


exports.runtimePlcAllscalesFlow = async (startTime, endTime, startdate, enddate, plcIccid,title,  runningtph) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${plcIccid}
            WHERE
            datasourcekey='${title}'
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
        
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS "Run Time (hrs)",
               MAX(numeric_value) AS "Run Max (tph)",
      AVG(numeric_value) AS "Run Avge (tph)"
        FROM
            filtered_data
        WHERE
            numeric_value > '${runningtph}'
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;

      

    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}

exports.runtimeAccumulatingSingleFlow = async (startTime, endTime, startdate, enddate, runningtph, flowiccid) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${flowiccid}
            WHERE
  
            (datasourcekey = 'modbus-1-4' OR datasourcekey = 'modbus-17-4')
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            iccid,
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
        FROM
            filtered_data
        WHERE
            numeric_value > '${runningtph}'
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;


    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


exports.runtimeAccumulatingFlow = async (startTime, endTime, startdate, enddate, runningtph, flowtitle, flowiccid) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${flowiccid}
            WHERE
            title='${flowtitle}' 
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            iccid,
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
        FROM
            filtered_data
        WHERE
            numeric_value > ${runningtph}
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;


    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


exports.runtimeAccumulatingPlcFlow = async (startTime, endTime, startdate, enddate, runningtph, title, plcIccid) => {
  try {

    const query = `
          WITH filtered_data AS (
            SELECT
                iccid,
                title,
                value::numeric AS numeric_value,
                date,
                LAG(date) OVER (ORDER BY date) AS previous_date
            FROM
            public.devicelogs_production_${plcIccid}
            WHERE
            (datasourcekey = '${title}')
            AND date BETWEEN '${startdate} ${startTime}' AND '${enddate} ${endTime}'
        )
        SELECT
            iccid,
            SUM(EXTRACT(EPOCH FROM (date - previous_date)))/3600 AS sum_of_time_delta_in_hours
        FROM
            filtered_data
        WHERE
            numeric_value > '${runningtph}'
            AND previous_date IS NOT NULL
        GROUP BY
            iccid;
        
      `;

    const result = await db.query(query);



    const downtons = result.rows.map(row => row);



    return downtons;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}

//monthtodate

exports.monthToDate = async (startTime, endTime, startdate, enddate, iccid) => {
  try {



    const query = ` SELECT
    top_value.iccid,
    top_value.mtdTopValue - bottom_value.mtdBottomValue AS month_todate

    FROM
        (
            SELECT
                iccid,
                value::numeric AS mtdTopValue,
                date
            FROM
                    public.devicelogs_production_${iccid}
            WHERE
                (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0')  
                AND date < '${enddate} ${endTime}'
            ORDER BY
                date DESC
            LIMIT 1
        ) AS top_value
    JOIN
        (
            SELECT
                iccid,
                value::numeric AS mtdBottomValue,
                date
            FROM
                  public.devicelogs_production_${iccid}
            WHERE
                (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0')  
                AND date >'${startdate} ${startTime}'
            ORDER BY
                date ASC
            LIMIT 1
        ) AS bottom_value
    ON top_value.iccid = bottom_value.iccid;
`;



    const result = await db.query(query);

    const monthToDate = result.rows.map(row => ({
      iccid: row.iccid,
      month_to_date: row.month_todate
    }));


    return monthToDate;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}



exports.monthToPlcDate = async (startTime, endTime, startdate, enddate, title, plcIccid) => {
  try {



    const query = ` SELECT
    top_value.iccid,
    top_value.mtdTopValue - bottom_value.mtdBottomValue AS month_todate

    FROM
        (
            SELECT
                iccid,
                value::numeric AS mtdTopValue,
                date
            FROM
                    public.devicelogs_production_${plcIccid}
            WHERE
                (datasourcekey = '${title}')  
                AND date < '${enddate} ${endTime}'
            ORDER BY
                date DESC
            LIMIT 1
        ) AS top_value
    JOIN
        (
            SELECT
                iccid,
                value::numeric AS mtdBottomValue,
                date
            FROM
                  public.devicelogs_production_${plcIccid}
            WHERE
            (datasourcekey = '${title}')  
                AND date >'${startdate} ${startTime}'
            ORDER BY
                date ASC
            LIMIT 1
        ) AS bottom_value
    ON top_value.iccid = bottom_value.iccid;
`;




    const result = await db.query(query);

    const monthToDate = result.rows.map(row => ({
      iccid: row.iccid,
      month_to_date: row.month_todate
    }));


    return monthToDate;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}



//month to date with defined opening

exports.monthToDatewithOpeningsToDate = async (endTime, enddate, iccid, openingvalue) => {
  try {



    const query = `SELECT
      iccid,
      value::numeric - ${openingvalue} AS month_to_date,
      date
  FROM
  public.devicelogs_production_${iccid}
  WHERE
  (datasourcekey = 'modbus-1-0' OR datasourcekey = 'modbus-17-0')  
  AND date <  '${enddate} ${endTime}'
  
  ORDER BY
      date DESC
  LIMIT 1;

    `;



    const result = await db.query(query);

    const monthToDate = result.rows.map(row => ({
      iccid: row.iccid,
      month_to_date: row.month_to_date
    }));




    return monthToDate;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}


exports.monthToDatePlcwithOpeningsToDate = async (endTime, enddate, title, plcIccid, openingScaletons) => {
  try {

    const query = `SELECT
      iccid,
      value::numeric - ${openingScaletons} AS month_to_date,
      date
  FROM
  public.devicelogs_production_${plcIccid}
  WHERE
  (datasourcekey = '${title}' )  
  AND date <  '${enddate} ${endTime}'
  
  ORDER BY
      date DESC
  LIMIT 1;

    `;



    const result = await db.query(query);

    const monthToDate = result.rows.map(row => ({
      iccid: row.iccid,
      month_to_date: row.month_to_date
    }));




    return monthToDate;

  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

}



