const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  checkRecordExists, 
  getRecordById, 
  getRecordsByUserId, 
  insertRecord, 
  updateRecord, 
  deleteRecord,
  formatDate,
  formatNumber,
  validateRequiredFields
} = require('../utils/dbUtils');
const { v4: uuidv4 } = require('uuid');

// Middleware para verificar o token JWT
router.use(verifyToken);

// Obter todos os investimentos do usuário
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');
    
    if (!user_id) {
      return res.status(400).json({ 
        ok: false, 
        status: 400, 
        error: 'user_id é obrigatório' 
      });
    }

    const investments = await getRecordsByUserId('investments', user_id, dbConfig);
    
    const formattedInvestments = investments
      .filter(investment => investment.active !== false) // Filtrar apenas investimentos ativos
      .map(investment => ({
        id: investment.id,
        name: investment.name,
        type: investment.type,
        amount: formatNumber(investment.amount),
        initial_date: investment.initial_date,
        due_date: investment.due_date,
        expected_return: formatNumber(investment.expected_return, 6),
        current_return: formatNumber(investment.current_return, 6),
        category_id: investment.category_id,
        goal_id: investment.goal_id,
        notes: investment.notes,
        created_at: investment.created_at,
        updated_at: investment.updated_at
      }));

    res.json({ 
      ok: true, 
      status: 200, 
      data: formattedInvestments 
    });
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    res.status(500).json({ 
      ok: false, 
      status: 500, 
      error: 'Erro ao buscar investimentos: ' + error.message 
    });
  }
});

// Criar um novo investimento
router.post('/', async (req, res) => {
  try {
    const { name, type, amount, initial_date, due_date, expected_return, current_return, notes, user_id, category_id, goal_id } = req.body;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');
    
    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'type', 'amount', 'initial_date', 'user_id'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
      });
    }
    
    // Formata os valores
    const formattedAmount = formatNumber(amount);
    const formattedExpectedReturn = expected_return ? formatNumber(expected_return) : null;
    const formattedCurrentReturn = current_return ? formatNumber(current_return) : null;
    const formattedInitialDate = formatDate(initial_date);
    const formattedDueDate = due_date ? formatDate(due_date) : null;
    
    const investmentData = {
      name,
      type,
      amount: formattedAmount,
      initial_date: formattedInitialDate,
      due_date: formattedDueDate,
      expected_return: formattedExpectedReturn,
      current_return: formattedCurrentReturn,
      notes,
      user_id,
      category_id,
      goal_id,
      active: true
    };
    
    const result = await insertRecord('investments', investmentData, dbConfig);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao criar investimento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar investimento: ' + error.message
    });
  }
});

// Atualizar um investimento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      type, 
      amount, 
      initial_date, 
      due_date, 
      expected_return, 
      current_return, 
      category_id, 
      goal_id, 
      notes 
    } = req.body;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    // Verificar se o investimento existe
    const investmentExists = await checkRecordExists('investments', id, dbConfig);
    if (!investmentExists) {
      return res.status(404).json({
        ok: false,
        status: 404,
        error: 'Investimento não encontrado'
      });
    }

    // Verificar se a categoria existe (se fornecida)
    if (category_id) {
      const categoryExists = await checkRecordExists('categories', category_id, dbConfig);
      if (!categoryExists) {
        return res.status(400).json({
          ok: false,
          status: 400,
          error: 'Categoria não encontrada'
        });
      }
    }

    // Verificar se a meta existe (se fornecida)
    if (goal_id) {
      const goalExists = await checkRecordExists('goals', goal_id, dbConfig);
      if (!goalExists) {
        return res.status(400).json({
          ok: false,
          status: 400,
          error: 'Meta não encontrada'
        });
      }
    }

    const updateData = {
      name: name,
      type: type,
      amount: amount ? formatNumber(amount) : undefined,
      initial_date: initial_date ? formatDate(initial_date) : undefined,
      due_date: due_date ? formatDate(due_date) : undefined,
      expected_return: expected_return ? formatNumber(expected_return, 6) : undefined,
      current_return: current_return ? formatNumber(current_return, 6) : undefined,
      category_id: category_id,
      goal_id: goal_id,
      notes: notes
    };

    // Remover campos undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedInvestment = await updateRecord('investments', id, updateData, dbConfig);

    const formattedInvestment = {
      id: updatedInvestment.id,
      name: updatedInvestment.name,
      type: updatedInvestment.type,
      amount: formatNumber(updatedInvestment.amount),
      initial_date: updatedInvestment.initial_date,
      due_date: updatedInvestment.due_date,
      expected_return: formatNumber(updatedInvestment.expected_return, 6),
      current_return: formatNumber(updatedInvestment.current_return, 6),
      category_id: updatedInvestment.category_id,
      goal_id: updatedInvestment.goal_id,
      notes: updatedInvestment.notes,
      created_at: updatedInvestment.created_at,
      updated_at: updatedInvestment.updated_at
    };

    res.json({
      ok: true,
      status: 200,
      data: formattedInvestment,
      message: 'Investimento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar investimento:', error);
    res.status(500).json({
      ok: false,
      status: 500,
      error: 'Erro ao atualizar investimento: ' + error.message
    });
  }
});

// Excluir um investimento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbConfig = JSON.parse(req.headers['x-db-config'] || '{}');

    // Verificar se o investimento existe
    const investmentExists = await checkRecordExists('investments', id, dbConfig);
    if (!investmentExists) {
      return res.status(404).json({ 
        ok: false, 
        status: 404, 
        error: 'Investimento não encontrado' 
      });
    }

    // Atualizar o investimento para desativá-lo
    const updateData = {
      active: false,
      updated_at: new Date()
    };

    const updatedInvestment = await updateRecord('investments', id, updateData, dbConfig);

    res.json({ 
      ok: true, 
      status: 200, 
      data: { 
        message: 'Investimento desativado com sucesso',
        investment: updatedInvestment
      } 
    });
  } catch (error) {
    console.error('Erro ao desativar investimento:', error);
    res.status(500).json({ 
      ok: false, 
      status: 500, 
      error: 'Erro ao desativar investimento: ' + error.message 
    });
  }
});

module.exports = router;
