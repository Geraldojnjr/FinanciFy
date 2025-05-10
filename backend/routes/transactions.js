const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createConnection } = require('../config/database');

const router = express.Router();

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  let connection;

  try {
    // console.log('Fetching transactions for user:', userId);
    
    const dbConfig = req.headers['x-db-config'] ? JSON.parse(req.headers['x-db-config']) : undefined;
    if (!dbConfig) {
      throw new Error('Database configuration not provided');
    }
    
    connection = await createConnection(dbConfig);
    
    const [transactions] = await connection.execute(`
      SELECT 
        t.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        c.type as category_type,
        a.name as account_name,
        a.type as account_type,
        a.balance as account_balance,
        a.initial_balance as account_initial_balance,
        a.bank as account_bank,
        a.color as account_color,
        a.active as account_active,
        cc.name as credit_card_name,
        cc.limit_amount as credit_card_limit,
        cc.closing_day as credit_card_closing_day,
        cc.due_day as credit_card_due_day,
        cc.color as credit_card_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN credit_cards cc ON t.credit_card_id = cc.id
      WHERE t.user_id = ? AND t.active = 1
      ORDER BY t.date DESC, t.created_at DESC
    `, [userId]);

    // console.log('Transactions fetched successfully');

    // Transform the data to include category information
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      user_id: t.user_id,
      category_id: t.category_id,
      description: t.description,
      amount: t.amount,
      date: t.date,
      type: t.type,
      payment_method: t.payment_method,
      expense_type: t.expense_type,
      account_id: t.account_id,
      credit_card_id: t.credit_card_id,
      installments: t.installments,
      current_installment: t.current_installment,
      parent_transaction_id: t.parent_transaction_id,
      notes: t.notes,
      created_at: t.created_at,
      updated_at: t.updated_at,
      paid: t.paid === 1 || t.paid === true,
      active: t.active !== false,
      category: t.category_name ? {
        id: t.category_id,
        name: t.category_name,
        icon: t.category_icon,
        color: t.category_color,
        type: t.category_type
      } : null,
      account: t.account_name ? {
        id: t.account_id,
        name: t.account_name,
        type: t.account_type,
        balance: Number(t.account_balance),
        initialBalance: Number(t.account_initial_balance),
        bank: t.account_bank,
        color: t.account_color,
        isActive: t.account_active
      } : null,
      creditCard: t.credit_card_name ? {
        id: t.credit_card_id,
        name: t.credit_card_name,
        limit: Number(t.credit_card_limit),
        closingDay: Number(t.credit_card_closing_day),
        dueDay: Number(t.credit_card_due_day),
        color: t.credit_card_color
      } : null
    }));

    res.json({
      success: true,
      transactions: formattedTransactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  const { 
    user_id, 
    category_id, 
    description, 
    amount, 
    date, 
    type, 
    id,
    payment_method,
    expense_type,
    account_id,
    credit_card_id,
    installments,
    current_installment,
    parent_transaction_id,
    notes
  } = req.body;
  let connection;

  try {
    // console.log('Creating transaction:', { 
    //   user_id, 
    //   category_id, 
    //   description, 
    //   amount, 
    //   date, 
    //   type, 
    //   id,
    //   payment_method,
    //   expense_type,
    //   account_id,
    //   credit_card_id,
    //   installments,
    //   current_installment,
    //   parent_transaction_id,
    //   notes
    // });
    
    const dbConfig = req.headers['x-db-config'] ? JSON.parse(req.headers['x-db-config']) : undefined;
    if (!dbConfig) {
      throw new Error('Database configuration not provided');
    }
    
    connection = await createConnection(dbConfig);
    
    const transactionId = id || uuidv4();
    const [result] = await connection.execute(
      `INSERT INTO transactions (
        id, 
        user_id, 
        category_id, 
        description, 
        amount, 
        date, 
        type,
        payment_method,
        expense_type,
        account_id,
        credit_card_id,
        installments,
        current_installment,
        parent_transaction_id,
        notes,
        paid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transactionId, 
        user_id, 
        category_id, 
        description, 
        amount, 
        date, 
        type,
        payment_method,
        expense_type,
        account_id,
        credit_card_id,
        installments,
        current_installment,
        parent_transaction_id,
        notes,
        req.body.paid === undefined ? false : !!req.body.paid
      ]
    );

    // console.log('Transaction created successfully');

    // Fetch the created transaction with category information
    const [transactions] = await connection.execute(`
      SELECT 
        t.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        c.type as category_type,
        a.name as account_name,
        a.type as account_type,
        a.balance as account_balance,
        a.initial_balance as account_initial_balance,
        a.bank as account_bank,
        a.color as account_color,
        a.active as account_active,
        cc.name as credit_card_name,
        cc.limit_amount as credit_card_limit,
        cc.closing_day as credit_card_closing_day,
        cc.due_day as credit_card_due_day,
        cc.color as credit_card_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN credit_cards cc ON t.credit_card_id = cc.id
      WHERE t.id = ?
    `, [transactionId]);

    if (transactions.length === 0) {
      throw new Error('Transaction was created but could not be retrieved');
    }

    const transaction = transactions[0];
    const formattedTransaction = {
      id: transaction.id,
      user_id: transaction.user_id,
      category_id: transaction.category_id,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      payment_method: transaction.payment_method,
      expense_type: transaction.expense_type,
      account_id: transaction.account_id,
      credit_card_id: transaction.credit_card_id,
      installments: transaction.installments,
      current_installment: transaction.current_installment,
      parent_transaction_id: transaction.parent_transaction_id,
      notes: transaction.notes,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      paid: transaction.paid === 1 || transaction.paid === true,
      active: transaction.active !== false,
      category: transaction.category_name ? {
        id: transaction.category_id,
        name: transaction.category_name,
        icon: transaction.category_icon,
        color: transaction.category_color,
        type: transaction.category_type
      } : null,
      account: transaction.account_name ? {
        id: transaction.account_id,
        name: transaction.account_name,
        type: transaction.account_type,
        balance: Number(transaction.account_balance),
        initialBalance: Number(transaction.account_initial_balance),
        bank: transaction.account_bank,
        color: transaction.account_color,
        isActive: transaction.account_active
      } : null,
      creditCard: transaction.credit_card_name ? {
        id: transaction.credit_card_id,
        name: transaction.credit_card_name,
        limit: Number(transaction.credit_card_limit),
        closingDay: Number(transaction.credit_card_closing_day),
        dueDay: Number(transaction.credit_card_due_day),
        color: transaction.credit_card_color
      } : null
    };

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction: formattedTransaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      message: 'Erro ao criar transação',
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = req.body;
  let connection;

  try {
    const dbConfig = req.headers['x-db-config'] ? JSON.parse(req.headers['x-db-config']) : undefined;
    if (!dbConfig) {
      throw new Error('Database configuration not provided');
    }
    
    connection = await createConnection(dbConfig);
    
    // Tratamento dos valores para evitar undefined
    const updateValues = [
      transaction.description || null,
      transaction.amount || null,
      transaction.date || null,
      transaction.category_id || null,
      transaction.type || null,
      transaction.payment_method || null,
      transaction.expense_type || null,
      transaction.account_id || null,
      transaction.credit_card_id || null,
      transaction.installments || null,
      transaction.current_installment || null,
      transaction.parent_transaction_id || null,
      transaction.notes || null,
      transaction.active === undefined ? true : Boolean(transaction.active),
      transaction.paid === undefined ? false : Boolean(transaction.paid),
      id
    ];
    
    const [result] = await connection.execute(
      `UPDATE transactions SET 
        description = ?,
        amount = ?,
        date = ?,
        category_id = ?,
        type = ?,
        payment_method = ?,
        expense_type = ?,
        account_id = ?,
        credit_card_id = ?,
        installments = ?,
        current_installment = ?,
        parent_transaction_id = ?,
        notes = ?,
        active = ?,
        paid = ?
      WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Fetch the updated transaction with all related data
    const [transactions] = await connection.execute(`
      SELECT 
        t.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        c.type as category_type,
        a.name as account_name,
        a.type as account_type,
        a.balance as account_balance,
        a.initial_balance as account_initial_balance,
        a.bank as account_bank,
        a.color as account_color,
        a.active as account_active,
        cc.name as credit_card_name,
        cc.limit_amount as credit_card_limit,
        cc.closing_day as credit_card_closing_day,
        cc.due_day as credit_card_due_day,
        cc.color as credit_card_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN credit_cards cc ON t.credit_card_id = cc.id
      WHERE t.id = ?
    `, [id]);

    if (transactions.length === 0) {
      throw new Error('Transaction was updated but could not be retrieved');
    }

    const updatedTransaction = transactions[0];
    const formattedTransaction = {
      id: updatedTransaction.id,
      user_id: updatedTransaction.user_id,
      category_id: updatedTransaction.category_id,
      description: updatedTransaction.description,
      amount: updatedTransaction.amount,
      date: updatedTransaction.date,
      type: updatedTransaction.type,
      payment_method: updatedTransaction.payment_method,
      expense_type: updatedTransaction.expense_type,
      account_id: updatedTransaction.account_id,
      credit_card_id: updatedTransaction.credit_card_id,
      installments: updatedTransaction.installments,
      current_installment: updatedTransaction.current_installment,
      parent_transaction_id: updatedTransaction.parent_transaction_id,
      notes: updatedTransaction.notes,
      created_at: updatedTransaction.created_at,
      updated_at: updatedTransaction.updated_at,
      paid: updatedTransaction.paid === 1 || updatedTransaction.paid === true,
      active: updatedTransaction.active !== false,
      category: updatedTransaction.category_name ? {
        id: updatedTransaction.category_id,
        name: updatedTransaction.category_name,
        icon: updatedTransaction.category_icon,
        color: updatedTransaction.category_color,
        type: updatedTransaction.category_type
      } : null,
      account: updatedTransaction.account_name ? {
        id: updatedTransaction.account_id,
        name: updatedTransaction.account_name,
        type: updatedTransaction.account_type,
        balance: Number(updatedTransaction.account_balance),
        initialBalance: Number(updatedTransaction.account_initial_balance),
        bank: updatedTransaction.account_bank,
        color: updatedTransaction.account_color,
        isActive: updatedTransaction.account_active
      } : null,
      creditCard: updatedTransaction.credit_card_name ? {
        id: updatedTransaction.credit_card_id,
        name: updatedTransaction.credit_card_name,
        limit: Number(updatedTransaction.credit_card_limit),
        closingDay: Number(updatedTransaction.credit_card_closing_day),
        dueDay: Number(updatedTransaction.credit_card_due_day),
        color: updatedTransaction.credit_card_color
      } : null
    };

    res.json({
      success: true,
      transaction: formattedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    const dbConfig = req.headers['x-db-config'] ? JSON.parse(req.headers['x-db-config']) : undefined;
    if (!dbConfig) {
      throw new Error('Database configuration not provided');
    }
    
    connection = await createConnection(dbConfig);
    
    await connection.execute('DELETE FROM transactions WHERE id = ?', [id]);

    res.json({
      message: 'Transação excluída com sucesso'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      message: 'Erro ao excluir transação',
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router; 