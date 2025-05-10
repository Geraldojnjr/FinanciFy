const express = require('express');
const { createConnection } = require('../config/database');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Generic query endpoint
router.get('/:table', verifyToken, async (req, res) => {
  const { table } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config']);
  let connection;

  try {
    connection = await createConnection(dbConfig);
    
    // Get query parameters
    const queryParams = req.query;
    let query = `SELECT * FROM ${table}`;
    let values = [];

    // Add WHERE clauses for each query parameter
    if (Object.keys(queryParams).length > 0) {
      query += ' WHERE ';
      const conditions = [];
      for (const [key, value] of Object.entries(queryParams)) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
      query += conditions.join(' AND ');
    }

    const [rows] = await connection.execute(query, values);
    res.json(rows);
  } catch (error) {
    console.error(`Error querying ${table}:`, error);
    res.status(500).json({ 
      message: `Erro ao buscar dados da tabela ${table}`,
      error: error.message 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Insert data endpoint
router.post('/:table', verifyToken, async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config']);
  let connection;

  try {
    connection = await createConnection(dbConfig);
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = new Array(values.length).fill('?').join(', ');
    
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await connection.execute(query, values);
    
    res.status(201).json({
      message: 'Dados inseridos com sucesso',
      insertId: result.insertId
    });
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    res.status(500).json({ 
      message: `Erro ao inserir dados na tabela ${table}`,
      error: error.message 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router; 