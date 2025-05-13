const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');
const accountsRoutes = require('./routes/accounts');
const creditCardsRoutes = require('./routes/credit-cards');
const investmentsRoutes = require('./routes/investments');
const goalsRoutes = require('./routes/goals');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8090', 'http://192.168.1.24:8090', 'https://geraldo.killers.com.br:9930'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-DB-Config'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/credit-cards', creditCardsRoutes);
app.use('/api/investments', investmentsRoutes);
app.use('/api/goals', goalsRoutes);

// Test connection endpoint
app.use('/api/test-connection', (req, res) => {
  if (req.method === 'HEAD') {
    return res.sendStatus(200);
  }
  res.json({ success: true });
});

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

let server;

if (process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true') {
  // Configuração do HTTPS para produção
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/geraldo.killers.com.br/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/geraldo.killers.com.br/fullchain.pem')
  };
  server = https.createServer(options, app);
} else {
  // Usar HTTP para desenvolvimento
  server = http.createServer(app);
}

server.listen(PORT, HOST, () => {
  console.log(`Server running on ${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${HOST}:${PORT}`);
}); 