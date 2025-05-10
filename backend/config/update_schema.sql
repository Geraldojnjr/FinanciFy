-- Backup da tabela transactions
CREATE TABLE transactions_backup AS SELECT * FROM transactions;

-- Drop da tabela transactions
DROP TABLE transactions;

-- Recriação da tabela transactions com o novo schema
CREATE TABLE transactions (
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

-- Migração dos dados
INSERT INTO transactions
SELECT 
    id,
    user_id,
    category_id,
    account_id,
    credit_card_id,
    description,
    amount,
    date,
    type,
    CASE 
        WHEN payment_method = 'credit' THEN 'credit_card'
        WHEN payment_method = 'debit' THEN 'debit_card'
        ELSE payment_method
    END as payment_method,
    expense_type,
    installments,
    current_installment,
    parent_transaction_id,
    notes,
    created_at,
    updated_at
FROM transactions_backup;

-- Drop da tabela de backup
DROP TABLE transactions_backup; 