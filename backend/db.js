const mariadb = require('mariadb');
const dotenv = require('dotenv');

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 20,
  acquireTimeout: 30000,
  idleTimeout: 60000,
  maxIdle: 10
});

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
};

const releaseConnection = async (connection) => {
  try {
    if (connection) {
      await connection.release();
    }
  } catch (error) {
    console.error('Error releasing database connection:', error);
  }
};

module.exports = { getConnection, releaseConnection }; 