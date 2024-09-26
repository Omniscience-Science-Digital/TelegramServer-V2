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
    SELECT
        iccid,
        MIN(date) AS First_date,
        MAX(date) AS Last_date,
        SUM(CAST(value AS numeric)) AS Total_Billablepoints
    FROM (
        SELECT DISTINCT ON (date_trunc('hour', date), EXTRACT(HOUR FROM date))
            iccid,
            value,
            date,
            title
        FROM
            public.${tableName}
        WHERE
            title = 'TS Billiable Message Count'
            AND date >= TIMESTAMP '2024-09-01 22:00:00' 
            AND date < CURRENT_DATE + INTERVAL '22:00' -- Up to today at 22:00
            AND EXTRACT(HOUR FROM date) IN (0, 6, 12, 18)
        ORDER BY
            date_trunc('hour', date), EXTRACT(HOUR FROM date), date ASC
    ) AS distinct_data
    GROUP BY
        iccid;
`;


    // const query = `
    // SELECT DISTINCT ON (date_trunc('hour', date), EXTRACT(HOUR FROM date))
    // iccid,
    // date,
    // title,
    // value
    // FROM
    // public.${tableName}
    // WHERE
    // title = 'TS Billiable Message Count' AND
    // date >= DATE '2024-09-1' + INTERVAL '06:00'
    // AND date < CURRENT_DATE + INTERVAL '1 day'
    // AND EXTRACT(HOUR FROM date) IN (6, 0, 12, 18)
    // ORDER BY
    // date_trunc('hour', date), EXTRACT(HOUR FROM date), date ASC;
    // `;




    const result = await db.query(query);


    const tables = result.rows.map(row => row);

    return tables;


  } catch (error) {
    console.error('Error listing Shiftons:', error);
    throw error;
  }
};
