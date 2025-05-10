const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('../config/database');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, name, dbConfig } = req.body;
  let connection;

  try {
    // console.log('Starting signup process for:', email);
    
    // Create database connection
    connection = await createConnection(dbConfig);
    // console.log('Database connection established');

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    // console.log('Checked for existing user');

    if (existingUsers.length > 0) {
      // console.log('User already exists:', email);
      return res.status(400).json({ 
        message: 'Usuário já existe' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Password hashed successfully');

    // Generate UUID for user
    const userId = uuidv4();
    // console.log('Generated UUID:', userId);

    // Create user
    await connection.execute(
      'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)',
      [userId, email, name, hashedPassword]
    );
    // console.log('User created successfully');

    // Create default categories for the new user
    // console.log('Creating default categories for user:', userId);
    
    // Income categories
    const incomeCategories = [
      ['Salário', 'income', 'money-bag', '#4CAF50'],
      ['Freelance', 'income', 'laptop', '#2196F3'],
      ['Investimentos', 'income', 'chart-up', '#673AB7'],
      ['Presentes', 'income', 'gift', '#E91E63'],
      ['Outros', 'income', 'dollar', '#607D8B']
    ];

    // Expense categories
    const expenseCategories = [
      ['Moradia', 'expense', 'home', '#F44336'],
      ['Alimentação', 'expense', 'food', '#FF9800'],
      ['Transporte', 'expense', 'car', '#795548'],
      ['Saúde', 'expense', 'health', '#009688'],
      ['Educação', 'expense', 'book', '#3F51B5'],
      ['Lazer', 'expense', 'game', '#9C27B0'],
      ['Vestuário', 'expense', 'shirt', '#00BCD4'],
      ['Assinaturas', 'expense', 'mobile', '#FF5722'],
      ['Outros', 'expense', 'cart', '#607D8B']
    ];

    // Investment categories
    const investmentCategories = [
      ['Renda Fixa', 'investment', 'chart-bar', '#4CAF50'],
      ['Ações', 'investment', 'chart-line', '#2196F3'],
      ['Fundos', 'investment', 'chart-pie', '#673AB7'],
      ['Criptomoedas', 'investment', 'coin', '#FF9800'],
      ['Outros', 'investment', 'money', '#607D8B']
    ];

    // Insert all categories
    const allCategories = [...incomeCategories, ...expenseCategories, ...investmentCategories];
    for (const [name, type, icon, color] of allCategories) {
      await connection.execute(
        'INSERT INTO categories (id, user_id, name, type, icon, color) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, name, type, icon, color]
      );
    }
    
    // console.log('Default categories created successfully');

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    // console.log('JWT token generated');

    // console.log('Signup successful for:', email);
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId,
      token,
      name
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Erro ao criar usuário',
      error: error.message 
    });
  } finally {
    if (connection) {
      await connection.end();
      // console.log('Database connection closed');
    }
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password, dbConfig } = req.body;
  let connection;

  try {
    // console.log('Starting login process for:', email);
    
    // Create database connection
    connection = await createConnection(dbConfig);
    // console.log('Database connection established');

    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    // console.log('User lookup completed');

    if (users.length === 0) {
      // console.log('No user found with email:', email);
      return res.status(401).json({ 
        message: 'Email ou senha inválidos' 
      });
    }

    const user = users[0];
    // console.log('User found, verifying password');

    // Verify password - using password_hash field instead of password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      // console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        message: 'Email ou senha inválidos' 
      });
    }

    // console.log('Password verified successfully');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    // console.log('JWT token generated');

    res.json({
      message: 'Login realizado com sucesso',
      userId: user.id,
      token,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Erro ao fazer login',
      error: error.message 
    });
  } finally {
    if (connection) {
      await connection.end();
      // console.log('Database connection closed');
    }
  }
});

// Rota para resetar usuário: desativar e alterar email
router.post('/reset-user', async (req, res) => {
  const { user_id } = req.body;
  const dbConfig = req.headers['x-db-config'] ? JSON.parse(req.headers['x-db-config']) : undefined;
  let connection;

  console.log('user_id:', user_id);
  console.log('dbConfig recebido:', dbConfig);

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id é obrigatório' });
  }
  if (!dbConfig) {
    return res.status(400).json({ success: false, error: 'Configuração do banco de dados não fornecida' });
  }

  try {
    connection = await createConnection(dbConfig);
    // Buscar email atual pelo id
    const [users] = await connection.execute('SELECT email FROM users WHERE id = ?', [user_id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    const email = users[0].email;
    // Atualizar active e email
    let newEmail = email;
    if (!email.endsWith(`_${user_id}`)) {
      newEmail = `${email}_${user_id}`;
    }
    await connection.execute('UPDATE users SET active = 0, email = ? WHERE id = ?', [newEmail, user_id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao resetar usuário:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

module.exports = router; 