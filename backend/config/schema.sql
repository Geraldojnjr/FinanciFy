-- Configuração do banco de dados para suportar emojis
ALTER DATABASE financial_app CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('checking', 'savings', 'wallet', 'investment', 'other') NOT NULL,
    bank VARCHAR(255),
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    initial_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    color VARCHAR(7) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense', 'investment') NOT NULL,
    icon VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS credit_cards (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    closing_day INT NOT NULL,
    due_day INT NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36),
    credit_card_id VARCHAR(36),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    type ENUM('income', 'expense', 'investment') NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'pix', 'transfer'),
    expense_type ENUM('fixed', 'variable'),
    installments INT,
    current_installment INT,
    parent_transaction_id VARCHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id),
    FOREIGN KEY (parent_transaction_id) REFERENCES transactions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS create_default_categories(IN p_user_id VARCHAR(36))
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