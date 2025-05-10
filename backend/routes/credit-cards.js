const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkRecordExists, getRecordById, getRecordsByUserId, insertRecord, updateRecord, deleteRecord } = require('../utils/dbUtils');

// Middleware para verificar o token JWT
router.use(verifyToken);

// GET /api/credit-cards - Listar todos os cartões do usuário
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!user_id) {
    return res.status(400).json({ 
      ok: false,
      message: 'ID do usuário é obrigatório' 
    });
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ 
      ok: false,
      message: 'Configuração do banco de dados inválida' 
    });
  }

  try {
    const cards = await getRecordsByUserId('credit_cards', user_id, dbConfig);
    res.json({ ok: true, data: cards });
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    res.status(500).json({ 
      ok: false,
      message: 'Erro ao buscar cartões',
      error: error.message 
    });
  }
});

// POST /api/credit-cards - Criar novo cartão
router.post('/', async (req, res) => {
  const { name, limit_amount, closing_day, due_day, color, user_id } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  // console.log('Dados recebidos:', {
  //   name,
  //   limit_amount,
  //   closing_day,
  //   due_day,
  //   color,
  //   user_id
  // });

  if (!name || !limit_amount || !closing_day || !due_day || !user_id) {
    return res.status(400).json({ 
      ok: false,
      message: 'Nome, limite, dia de fechamento, dia de vencimento e ID do usuário são obrigatórios' 
    });
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ 
      ok: false,
      message: 'Configuração do banco de dados inválida' 
    });
  }

  try {
    const cardData = {
      name,
      limit_amount: parseFloat(limit_amount),
      closing_day: parseInt(closing_day),
      due_day: parseInt(due_day),
      color: color || '#60a5fa',
      user_id
    };

    // console.log('Dados formatados:', cardData);

    const card = await insertRecord('credit_cards', cardData, dbConfig);
    // console.log('Cartão criado:', card);
    
    if (!card) {
      throw new Error('Falha ao criar cartão');
    }

    // Verifica se o cartão foi criado com sucesso
    const exists = await checkRecordExists('credit_cards', card.id, dbConfig);
    if (!exists) {
      throw new Error('Cartão não encontrado após criação');
    }

    res.status(201).json({ 
      ok: true, 
      card 
    });
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    res.status(500).json({ 
      ok: false,
      message: error.message || 'Erro ao criar cartão'
    });
  }
});

// PUT /api/credit-cards/:id - Atualizar cartão
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, limit_amount, closing_day, due_day, color } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ 
      ok: false,
      message: 'Configuração do banco de dados inválida' 
    });
  }

  try {
    const exists = await checkRecordExists('credit_cards', id, dbConfig);
    if (!exists) {
      return res.status(404).json({ 
        ok: false,
        message: 'Cartão não encontrado' 
      });
    }

    const updateData = {
      name,
      limit_amount: limit_amount ? parseFloat(limit_amount) : undefined,
      closing_day: closing_day ? parseInt(closing_day) : undefined,
      due_day: due_day ? parseInt(due_day) : undefined,
      color
    };

    // Remove campos undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const card = await updateRecord('credit_cards', id, updateData, dbConfig);
    if (!card) {
      throw new Error('Falha ao atualizar cartão');
    }

    res.json({ 
      ok: true, 
      card 
    });
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
    res.status(500).json({ 
      ok: false,
      message: 'Erro ao atualizar cartão',
      error: error.message 
    });
  }
});

// DELETE /api/credit-cards/:id - Deletar cartão
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ 
      ok: false,
      message: 'Configuração do banco de dados inválida' 
    });
  }

  try {
    const exists = await checkRecordExists('credit_cards', id, dbConfig);
    if (!exists) {
      return res.status(404).json({ 
        ok: false,
        message: 'Cartão não encontrado' 
      });
    }

    const success = await deleteRecord('credit_cards', id, dbConfig);
    if (!success) {
      throw new Error('Falha ao deletar cartão');
    }

    res.json({ 
      ok: true, 
      message: 'Cartão deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar cartão:', error);
    res.status(500).json({ 
      ok: false,
      message: 'Erro ao deletar cartão',
      error: error.message 
    });
  }
});

// GET /api/credit-cards/:id - Obter cartão específico
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ 
      ok: false,
      message: 'Configuração do banco de dados inválida' 
    });
  }

  try {
    const card = await getRecordById('credit_cards', id, dbConfig);
    if (!card) {
      return res.status(404).json({ 
        ok: false,
        message: 'Cartão não encontrado' 
      });
    }

    res.json({ 
      ok: true, 
      card 
    });
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
    res.status(500).json({ 
      ok: false,
      message: 'Erro ao buscar cartão',
      error: error.message 
    });
  }
});

module.exports = router;
