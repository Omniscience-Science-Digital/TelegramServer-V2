const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 2, // Adjust based on your needs
  idleTimeoutMillis: 60000, 
  connectionTimeoutMillis: 20000,
});

async function connectToDatabase() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(-1);
  }
}

// Wrap your connection logic in an immediately invoked asynchronous function
(async () => {
  await connectToDatabase();
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
