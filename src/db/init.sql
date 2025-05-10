-- Database schema for financial management application
-- Compatible with MariaDB and MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS financial_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE financial_app;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('income', 'expense', 'investment') NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bank accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  initial_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  type ENUM('checking', 'savings', 'wallet', 'investment', 'other') NOT NULL,
  bank VARCHAR(100),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Credit cards table
CREATE TABLE IF NOT EXISTS credit_cards (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  closing_day INT NOT NULL,
  due_day INT NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  category_id VARCHAR(36),
  type ENUM('income', 'expense', 'credit', 'investment') NOT NULL,
  payment_method ENUM('cash', 'debit', 'credit', 'pix', 'transfer') NOT NULL,
  expense_type ENUM('fixed', 'variable'),
  account_id VARCHAR(36),
  credit_card_id VARCHAR(36),
  installments INT,
  current_installment INT,
  parent_transaction_id VARCHAR(36),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);

-- Credit card statements table
CREATE TABLE IF NOT EXISTS credit_card_statements (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  credit_card_id VARCHAR(36) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  closing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('open', 'closed', 'paid') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
  UNIQUE KEY (credit_card_id, month, year)
);

-- Financial goals table
CREATE TABLE IF NOT EXISTS goals (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  deadline DATE,
  category_id VARCHAR(36),
  notes TEXT,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('cdb', 'lci', 'lca', 'tesouro', 'funds', 'stocks', 'crypto', 'others') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  initial_date DATE NOT NULL,
  due_date DATE,
  expected_return DECIMAL(10,6),
  current_return DECIMAL(10,6),
  category_id VARCHAR(36),
  goal_id VARCHAR(36),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_credit_card ON transactions(credit_card_id);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_credit_cards_user ON credit_cards(user_id);
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_investments_goal ON investments(goal_id);
CREATE INDEX idx_investments_category ON investments(category_id);

-- Default categories for new users (stored procedure)
DELIMITER //
CREATE PROCEDURE create_default_categories(IN p_user_id VARCHAR(36))
BEGIN
  -- Income categories
  INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
    (UUID(), p_user_id, 'Salário', 'income', 'money-bag', '#4CAF50'),
    (UUID(), p_user_id, 'Freelance', 'income', 'laptop', '#2196F3'),
    (UUID(), p_user_id, 'Investimentos', 'income', 'chart-up', '#673AB7'),
    (UUID(), p_user_id, 'Presentes', 'income', 'gift', '#E91E63'),
    (UUID(), p_user_id, 'Outros', 'income', 'dollar', '#607D8B');
  
  -- Expense categories
  INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
    (UUID(), p_user_id, 'Moradia', 'expense', 'home', '#F44336'),
    (UUID(), p_user_id, 'Alimentação', 'expense', 'food', '#FF9800'),
    (UUID(), p_user_id, 'Transporte', 'expense', 'car', '#795548'),
    (UUID(), p_user_id, 'Saúde', 'expense', 'health', '#009688'),
    (UUID(), p_user_id, 'Educação', 'expense', 'book', '#3F51B5'),
    (UUID(), p_user_id, 'Lazer', 'expense', 'game', '#9C27B0'),
    (UUID(), p_user_id, 'Vestuário', 'expense', 'shirt', '#00BCD4'),
    (UUID(), p_user_id, 'Assinaturas', 'expense', 'mobile', '#FF5722'),
    (UUID(), p_user_id, 'Outros', 'expense', 'cart', '#607D8B');
  
  -- Investment categories
  INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
    (UUID(), p_user_id, 'Renda Fixa', 'investment', 'chart-bar', '#4CAF50'),
    (UUID(), p_user_id, 'Ações', 'investment', 'chart-line', '#2196F3'),
    (UUID(), p_user_id, 'Fundos', 'investment', 'chart-pie', '#673AB7'),
    (UUID(), p_user_id, 'Criptomoedas', 'investment', 'coin', '#FF9800'),
    (UUID(), p_user_id, 'Outros', 'investment', 'money', '#607D8B');
END //
DELIMITER ;

-- Trigger to update account balance when a transaction is added, updated or deleted
DELIMITER //

-- Update account balance on new transaction
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
  IF NEW.account_id IS NOT NULL THEN
    IF NEW.type = 'income' THEN
      UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSEIF NEW.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  END IF;
END //

-- Update account balance on transaction update
CREATE TRIGGER after_transaction_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
  IF NEW.account_id IS NOT NULL THEN
    -- Reverse old transaction effect if account_id exists
    IF OLD.account_id IS NOT NULL THEN
      IF OLD.type = 'income' THEN
        UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
      ELSEIF OLD.type IN ('expense', 'investment') THEN
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
      END IF;
    END IF;
    
    -- Apply new transaction effect
    IF NEW.type = 'income' THEN
      UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSEIF NEW.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSEIF OLD.account_id IS NOT NULL THEN
    -- Just reverse old transaction if new one has no account
    IF OLD.type = 'income' THEN
      UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSEIF OLD.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;
END //

-- Update account balance on transaction delete
CREATE TRIGGER after_transaction_delete
AFTER DELETE ON transactions
FOR EACH ROW
BEGIN
  IF OLD.account_id IS NOT NULL THEN
    IF OLD.type = 'income' THEN
      UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSEIF OLD.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;
END //

DELIMITER ;
