const db = require('../configs/postgress_db');

exports.listTables = async () => {
  try {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
      AND table_schema NOT LIKE 'pg_%'
      AND table_name NOT IN ('sql_implementation_info', 'sql_features', 'sql_sizing')
      ORDER BY table_name;
    `;

    const result = await db.query(query);
    const tables = result.rows.map(row => row.table_name);

    const countQuery = `
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
      AND table_schema NOT LIKE 'pg_%'
      AND table_name NOT IN ('sql_implementation_info', 'sql_features', 'sql_sizing');
    `;

    const countResult = await db.query(countQuery);
    const count = countResult.rows[0].count;

    return { table_name: tables, count };
  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }
};


exports.getMessages = async (tableName) => {
  try {
    

    const query = `
    WITH ValueData AS (
    SELECT 
        iccid,
        value::numeric AS numeric_value,  -- Convert value to numeric
        date,
        FIRST_VALUE(value::numeric) OVER (ORDER BY date ASC) AS first_value,  -- First value
        LAST_VALUE(value::numeric) OVER (ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_value,  -- Last value across the full result set
        MAX(value::numeric) OVER () AS max_value  -- Maximum value in the entire result set
    FROM 
        public.${tableName}
    WHERE 
        datasourcekey = 'calculated.ts-billable-message-count' 
        AND date >= date_trunc('month', CURRENT_DATE)  -- Beginning of the current month
        AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'  -- Up to the end of the current month
        AND date < CURRENT_DATE + INTERVAL '1 day'  -- Up to the current day + 1 day
)
SELECT 
    iccid,
    MIN(date) AS First_date,  -- Earliest date
    MAX(date) AS Last_date,    -- Latest date
    (MAX(max_value) + MAX(last_value) - MAX(first_value)) AS Total_Billablepoints  -- Calculate billapoints
FROM 
    ValueData
GROUP BY iccid
LIMIT 1;


`;


    const result = await db.query(query);


    const tables = result.rows.map(row => row);

    return tables;


  } catch (error) {
    console.error('Error listing Shiftons:', error);
    throw error;
  }
};
