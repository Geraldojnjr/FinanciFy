const mysql = require('mysql2/promise');
require('dotenv').config();

const createConnection = async (config) => {
  try {
    // Use provided config or fallback to environment variables
    const connectionConfig = {
      host: 'mariadb' || config?.host || process.env.DB_HOST,
      port: parseInt(config?.port || process.env.DB_PORT || '3306'),
      user: config?.user || process.env.DB_USER || 'financify_controler',
      password: config?.password || process.env.DB_PASSWORD || 'mksamdkmKMKALDS231',
      database: config?.database || process.env.DB_NAME || 'financify_db',
      // Configurações para suporte a emojis
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      // Additional configurations for better connection handling
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      queueLimit: 0,
      connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'),
      debug: process.env.DB_DEBUG === 'true'
    };

    console.log('Attempting to connect to database with config:', {
      host: connectionConfig.host,
      port: connectionConfig.port,
      database: connectionConfig.database,
      user: connectionConfig.user,
      charset: connectionConfig.charset,
      collation: connectionConfig.collation,
      connectTimeout: connectionConfig.connectTimeout,
      connectionLimit: connectionConfig.connectionLimit
    });

    // Test the connection before returning
    const connection = await mysql.createConnection(connectionConfig);
    
    // Configurar a conexão para usar utf8mb4
    await connection.execute('SET NAMES utf8mb4');
    await connection.execute('SET CHARACTER SET utf8mb4');
    await connection.execute('SET character_set_client = utf8mb4');
    await connection.execute('SET character_set_results = utf8mb4');
    await connection.execute('SET character_set_connection = utf8mb4');
    
    // Ping the database to ensure connection is working
    await connection.ping();
    
    console.log('Database connection established and verified successfully');
    return connection;
  } catch (error) {
    console.error('Error creating database connection:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
};

module.exports = { createConnection }; 