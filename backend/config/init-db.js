const fs = require('fs');
const path = require('path');
const { createConnection } = require('./database');

async function initDatabase() {
  let connection;
  try {
    // Create connection without specifying database
    connection = await createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.execute(`USE ${process.env.DB_NAME}`);

    // Read schema file
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Split the schema into individual commands
    const commands = schema
      .split(';')
      .map(command => command.trim())
      .filter(command => command.length > 0);

    // Execute each command separately
    for (const command of commands) {
      if (command.includes('DELIMITER')) continue; // Skip DELIMITER commands
      
      try {
        await connection.execute(command);
      } catch (error) {
        console.error('Error executing command:', command);
        throw error;
      }
    }

    // console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase().catch(console.error);
}

module.exports = initDatabase; 