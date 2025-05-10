const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkRecordExists, getRecordById, getRecordsByUserId, insertRecord, updateRecord, deleteRecord } = require('../utils/dbUtils');

// Middleware para verificar o token JWT
router.use(verifyToken);

// GET /api/accounts - Listar todas as contas do usuário
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!user_id) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório' });
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    // console.log('accounts: [GET] Buscando contas do usuário:', user_id);
    const accounts = await getRecordsByUserId('accounts', user_id, dbConfig);
    // console.log('accounts: [GET] Contas encontradas:', JSON.stringify(accounts, null, 2));
    res.json({ ok: true, data: accounts });
  } catch (error) {
    console.error('accounts: [GET] Erro ao buscar contas:', error);
    res.status(500).json({ message: 'Erro ao buscar contas' });
  }
});

// POST /api/accounts - Criar nova conta
router.post('/', async (req, res) => {
  const { name, balance, initial_balance, type, color, bank, user_id } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!name || !type || !user_id) {
    return res.status(400).json({ message: 'Nome, tipo e ID do usuário são obrigatórios' });
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const accountData = {
      name,
      balance: Number(balance) || 0,
      initial_balance: Number(initial_balance) || 0,
      type,
      bank: bank || null,
      color: color || '#60a5fa',
      user_id
    };

    // console.log('accounts: [POST] Dados da conta a serem inseridos:', JSON.stringify(accountData, null, 2));

    const account = await insertRecord('accounts', accountData, dbConfig);
    // console.log('accounts: [POST] Conta criada com sucesso:', JSON.stringify(account, null, 2));
    res.status(201).json({ ok: true, account });
  } catch (error) {
    console.error('accounts: [POST] Erro ao criar conta:', error);
    res.status(500).json({ message: 'Erro ao criar conta' });
  }
});

// PUT /api/accounts/:id - Atualizar conta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, balance, initial_balance, type, color, bank } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const exists = await checkRecordExists('accounts', id, dbConfig);
    if (!exists) {
      // console.log('accounts: [PUT] Conta não encontrada:', id);
      return res.status(404).json({ message: 'Conta não encontrada' });
    }

    // console.log('accounts: [PUT] Dados recebidos na requisição:', JSON.stringify({
    //   id,
    //   name,
    //   balance,
    //   initial_balance,
    //   type,
    //   color,
    //   bank
    // }, null, 2));

    // Validação dos campos numéricos
    const numericBalance = Number(balance);
    const numericInitialBalance = Number(initial_balance);

    if (isNaN(numericBalance) || isNaN(numericInitialBalance)) {
      // console.log('accounts: [PUT] Valores de saldo inválidos:', JSON.stringify({ balance, initial_balance }, null, 2));
      return res.status(400).json({ message: 'Valores de saldo inválidos' });
    }

    const updateData = {
      name: name?.trim(),
      balance: numericBalance,
      initial_balance: numericInitialBalance,
      type,
      bank: bank?.trim() || null,
      color: color || '#60a5fa',
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // console.log('accounts: [PUT] Dados processados para atualização:', JSON.stringify(updateData, null, 2));

    // Remove campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        // console.log(`accounts: [PUT] Removendo campo ${key} por ser undefined`);
        delete updateData[key];
      }
    });

    // console.log('accounts: [PUT] Dados finais para atualização:', JSON.stringify(updateData, null, 2));

    const account = await updateRecord('accounts', id, updateData, dbConfig);
    // console.log('accounts: [PUT] Conta atualizada:', JSON.stringify(account, null, 2));
    
    res.json({ ok: true, account });
  } catch (error) {
    console.error('accounts: [PUT] Erro ao atualizar conta:', error);
    res.status(500).json({ message: 'Erro ao atualizar conta' });
  }
});

// DELETE /api/accounts/:id - Deletar conta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const exists = await checkRecordExists('accounts', id, dbConfig);
    if (!exists) {
      // console.log('accounts: [DELETE] Conta não encontrada para deleção:', id);
      return res.status(404).json({ message: 'Conta não encontrada' });
    }

    const success = await deleteRecord('accounts', id, dbConfig);
    if (success) {
      // console.log('accounts: [DELETE] Conta deletada com sucesso:', id);
      res.json({ ok: true, message: 'Conta deletada com sucesso' });
    } else {
      // console.log('accounts: [DELETE] Erro ao deletar conta:', id);
      res.status(500).json({ message: 'Erro ao deletar conta' });
    }
  } catch (error) {
    // console.error('accounts: [DELETE] Erro ao deletar conta:', error);
    res.status(500).json({ message: 'Erro ao deletar conta' });
  }
});

// GET /api/accounts/:id - Obter conta específica
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    // console.log('accounts: [GET] Buscando conta específica:', id);
    const account = await getRecordById('accounts', id, dbConfig);
    if (!account) {
      // console.log('accounts: [GET] Conta não encontrada:', id);
      return res.status(404).json({ message: 'Conta não encontrada' });
    }
    // console.log('accounts: [GET] Conta encontrada:', JSON.stringify(account, null, 2));
    res.json({ ok: true, account });
  } catch (error) {
    console.error('accounts: [GET] Erro ao buscar conta:', error);
    res.status(500).json({ message: 'Erro ao buscar conta' });
  }
});

module.exports = router; 