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



exports.BillableMessages = async () => {
  try {

    const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    `;



    const result = await db.query(query);


    const tables = result.rows.map(row => row);

    return tables;


  } catch (error) {
    console.error('Error listing Shiftons:', error);
    throw error;
  }
};


exports.getMessages = async (tableName) => {
  try {

    const query = `
    SELECT DISTINCT ON (date_trunc('hour', date), EXTRACT(HOUR FROM date))
    iccid,
    date,
    title,
    value
    FROM
    public.${tableName}
    WHERE
    title = 'TS Billiable Message Count' AND
    date >= DATE '2023-12-15' + INTERVAL '06:00'
    AND date < CURRENT_DATE + INTERVAL '1 day'
    AND EXTRACT(HOUR FROM date) IN (6, 0, 12, 18)
    ORDER BY
    date_trunc('hour', date), EXTRACT(HOUR FROM date), date ASC;
    `;




    const result = await db.query(query);


    const tables = result.rows.map(row => row);

    return tables;


  } catch (error) {
    console.error('Error listing Shiftons:', error);
    throw error;
  }
};
