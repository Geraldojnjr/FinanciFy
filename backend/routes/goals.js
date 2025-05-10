const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkRecordExists, getRecordById, getRecordsByUserId, insertRecord, updateRecord, deleteRecord } = require('../utils/dbUtils');

// Função para formatar data para o formato MySQL
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
};

// Middleware para verificar o token JWT
router.use(verifyToken);

// GET /api/goals - Listar todas as metas do usuário
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
    const goals = await getRecordsByUserId('goals', user_id, dbConfig);
    res.json({ ok: true, data: goals });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ message: 'Erro ao buscar metas' });
  }
});

// POST /api/goals - Criar nova meta
router.post('/', async (req, res) => {
  const { name, target_amount, current_amount, deadline, category_id, notes, color, user_id } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!name || !target_amount || !user_id) {
    return res.status(400).json({ message: 'Nome, valor alvo e ID do usuário são obrigatórios' });
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const goalData = {
      name,
      target_amount,
      current_amount: current_amount || 0,
      deadline,
      category_id,
      notes,
      color: color || '#60a5fa',
      user_id
    };

    const goal = await insertRecord('goals', goalData, dbConfig);
    res.status(201).json({ ok: true, data: goal });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ message: 'Erro ao criar meta' });
  }
});

// PUT /api/goals/:id - Atualizar meta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, target_amount, current_amount, deadline, category_id, notes, color } = req.body;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    console.error('Configuração do banco de dados inválida:', dbConfig);
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const exists = await checkRecordExists('goals', id, dbConfig);
    if (!exists) {
      console.error('Meta não encontrada para update:', id);
      return res.status(404).json({ message: 'Meta não encontrada' });
    }

    const updateData = {
      name,
      target_amount,
      current_amount,
      deadline: formatDateForMySQL(deadline),
      category_id,
      notes,
      color
    };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    console.log('Atualizando meta:', id, updateData);
    await updateRecord('goals', id, updateData, dbConfig);
    console.log('Update realizado com sucesso');
    const updatedGoal = await getRecordById('goals', id, dbConfig);
    if (!updatedGoal) {
      console.error('Erro ao buscar meta atualizada após update:', id);
      return res.status(500).json({ message: 'Erro ao buscar meta atualizada' });
    }
    res.json({ ok: true, data: updatedGoal });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error, 'Dados recebidos:', req.body);
    res.status(500).json({ message: 'Erro ao atualizar meta', error: error.message });
  }
});

// DELETE /api/goals/:id - Deletar meta (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const exists = await checkRecordExists('goals', id, dbConfig);
    if (!exists) {
      return res.status(404).json({ message: 'Meta não encontrada' });
    }

    // Soft delete: atualiza active para 0
    const connection = await require('mysql2/promise').createConnection(dbConfig);
    await connection.execute('UPDATE goals SET active = 0 WHERE id = ?', [id]);
    await connection.end();

    res.json({ ok: true, message: 'Meta desativada com sucesso' });
  } catch (error) {
    console.error('Erro ao desativar meta:', error);
    res.status(500).json({ message: 'Erro ao desativar meta' });
  }
});

// GET /api/goals/:id - Obter meta específica
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    return res.status(500).json({ message: 'Configuração do banco de dados inválida' });
  }

  try {
    const goal = await getRecordById('goals', id, dbConfig);
    if (!goal) {
      return res.status(404).json({ message: 'Meta não encontrada' });
    }
    res.json({ ok: true, data: goal });
  } catch (error) {
    console.error('Erro ao buscar meta:', error);
    res.status(500).json({ message: 'Erro ao buscar meta' });
  }
});

module.exports = router;
