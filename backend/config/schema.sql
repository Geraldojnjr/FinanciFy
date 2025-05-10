-- Configuração do banco de dados para suportar emojis e caracteres especiais
ALTER DATABASE financial_app CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de contas bancárias
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    initial_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    type ENUM('checking','savings','wallet','investment','other') NOT NULL,
    bank VARCHAR(100) DEFAULT NULL,
    color VARCHAR(20) DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_accounts_user (user_id),
    CONSTRAINT accounts_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('income','expense','investment') NOT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    color VARCHAR(20) DEFAULT NULL,
    budget DECIMAL(10,2) DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_categories_user_type (user_id,type),
    CONSTRAINT categories_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de cartões de crédito
CREATE TABLE IF NOT EXISTS credit_cards (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    closing_day INT(11) NOT NULL,
    due_day INT(11) NOT NULL,
    color VARCHAR(20) DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_credit_cards_user (user_id),
    CONSTRAINT credit_cards_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de faturas do cartão de crédito
CREATE TABLE IF NOT EXISTS credit_card_statements (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    credit_card_id VARCHAR(36) NOT NULL,
    month INT(11) NOT NULL,
    year INT(11) NOT NULL,
    closing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('open','closed','paid') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY credit_card_id (credit_card_id,month,year),
    KEY user_id (user_id),
    CONSTRAINT credit_card_statements_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT credit_card_statements_ibfk_2 FOREIGN KEY (credit_card_id) REFERENCES credit_cards (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    category_id VARCHAR(36) DEFAULT NULL,
    type ENUM('income','expense','credit','investment') NOT NULL,
    payment_method ENUM('cash','debit','credit','pix','transfer') NOT NULL,
    expense_type ENUM('fixed','variable') DEFAULT NULL,
    account_id VARCHAR(36) DEFAULT NULL,
    credit_card_id VARCHAR(36) DEFAULT NULL,
    installments INT(11) DEFAULT NULL,
    current_installment INT(11) DEFAULT NULL,
    parent_transaction_id VARCHAR(36) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    paid TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY category_id (category_id),
    KEY parent_transaction_id (parent_transaction_id),
    KEY idx_transactions_date (date),
    KEY idx_transactions_type (type),
    KEY idx_transactions_user_date (user_id,date),
    KEY idx_transactions_account (account_id),
    KEY idx_transactions_credit_card (credit_card_id),
    CONSTRAINT transactions_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT transactions_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    CONSTRAINT transactions_ibfk_3 FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE SET NULL,
    CONSTRAINT transactions_ibfk_4 FOREIGN KEY (credit_card_id) REFERENCES credit_cards (id) ON DELETE SET NULL,
    CONSTRAINT transactions_ibfk_5 FOREIGN KEY (parent_transaction_id) REFERENCES transactions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    deadline DATE DEFAULT NULL,
    category_id VARCHAR(36) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    color VARCHAR(20) DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY category_id (category_id),
    KEY idx_goals_user (user_id),
    CONSTRAINT goals_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT goals_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investments (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('cdb','lci','lca','tesouro','funds','stocks','crypto','others') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    initial_date DATE NOT NULL,
    due_date DATE DEFAULT NULL,
    expected_return DECIMAL(10,6) DEFAULT NULL,
    current_return DECIMAL(10,6) DEFAULT NULL,
    category_id VARCHAR(36) DEFAULT NULL,
    goal_id VARCHAR(36) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_investments_user (user_id),
    KEY idx_investments_goal (goal_id),
    KEY idx_investments_category (category_id),
    CONSTRAINT investments_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT investments_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    CONSTRAINT investments_ibfk_3 FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger para atualizar saldo da conta após inserção de transação
DELIMITER ;;
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
END;;
DELIMITER ;

-- Stored Procedure para criar categorias padrão
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_default_categories(IN p_user_id VARCHAR(36))
BEGIN
    -- Categorias de Receita
    INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
        (UUID(), p_user_id, 'Salário', 'income', '💰', '#4CAF50'),
        (UUID(), p_user_id, 'Freelance', 'income', '💻', '#2196F3'),
        (UUID(), p_user_id, 'Investimentos', 'income', '📈', '#673AB7'),
        (UUID(), p_user_id, 'Presentes', 'income', '🎁', '#E91E63'),
        (UUID(), p_user_id, 'Outros', 'income', '💵', '#607D8B');
    
    -- Categorias de Despesa
    INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
        (UUID(), p_user_id, 'Moradia', 'expense', '🏠', '#F44336'),
        (UUID(), p_user_id, 'Alimentação', 'expense', '🍽️', '#FF9800'),
        (UUID(), p_user_id, 'Transporte', 'expense', '🚗', '#795548'),
        (UUID(), p_user_id, 'Saúde', 'expense', '⚕️', '#009688'),
        (UUID(), p_user_id, 'Educação', 'expense', '📚', '#3F51B5'),
        (UUID(), p_user_id, 'Lazer', 'expense', '🎮', '#9C27B0'),
        (UUID(), p_user_id, 'Vestuário', 'expense', '👕', '#00BCD4'),
        (UUID(), p_user_id, 'Assinaturas', 'expense', '📱', '#FF5722'),
        (UUID(), p_user_id, 'Outros', 'expense', '🛒', '#607D8B');
    
    -- Categorias de Investimento
    INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
        (UUID(), p_user_id, 'Renda Fixa', 'investment', '📊', '#4CAF50'),
        (UUID(), p_user_id, 'Ações', 'investment', '📈', '#2196F3'),
        (UUID(), p_user_id, 'Fundos', 'investment', '🥧', '#673AB7'),
        (UUID(), p_user_id, 'Criptomoedas', 'investment', '🪙', '#FF9800'),
        (UUID(), p_user_id, 'Outros', 'investment', '💰', '#607D8B');
END //
DELIMITER ; 