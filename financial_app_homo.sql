/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: homolog_financial_app
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `initial_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `type` enum('checking','savings','wallet','investment','other') NOT NULL,
  `bank` varchar(100) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_accounts_user` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES
('6e3c39a3-5080-4f39-80f8-830ea3e61bb3','53a75511-518c-499b-b324-cf5652fd17e8','BB',0.00,0.00,'checking','Banco do Brasil','#F59E0B',1,'2025-04-16 09:37:19','2025-04-16 09:37:19'),
('7bbb7e93-d881-4f23-a7cc-614c228c4315','53a75511-518c-499b-b324-cf5652fd17e8','Banco Inter',2244.18,2.18,'checking','Banco Inter','#F97316',1,'2025-04-16 09:41:45','2025-04-16 15:32:20'),
('98de5e8f-9a9d-4c72-9c7f-eafd756a5337','53a75511-518c-499b-b324-cf5652fd17e8','NuBank',0.00,0.00,'checking','NuBank','#9333EA',1,'2025-04-16 09:36:40','2025-04-16 09:36:40');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('income','expense','investment') NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_categories_user_type` (`user_id`,`type`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
('1081694a-9be5-4d93-85bd-6f3c4bd51b55','53a75511-518c-499b-b324-cf5652fd17e8','Vestuário','expense','shirt','#00BCD4',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('2228df4c-e2c5-4775-99e6-955677c2097e','53a75511-518c-499b-b324-cf5652fd17e8','Fundos','investment','chart-pie','#673AB7',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','53a75511-518c-499b-b324-cf5652fd17e8','Alimentação','expense','food','#FF9800',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('3b10411c-d74a-4380-a426-ff7b5cfb7c3c','53a75511-518c-499b-b324-cf5652fd17e8','Outros','investment','money','#607D8B',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('531f1590-7dca-44a6-8cf6-e357dae5edf9','53a75511-518c-499b-b324-cf5652fd17e8','Presentes','income','gift','#E91E63',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('67990a28-f375-4f3f-a15e-261203d4aaf8','53a75511-518c-499b-b324-cf5652fd17e8','Criptomoedas','investment','coin','#FF9800',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('67a2eaae-c9ba-45a9-b01b-530e4c0aaa4a','53a75511-518c-499b-b324-cf5652fd17e8','Renda Fixa','investment','chart-bar','#4CAF50',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('789e6f04-2684-4642-85b5-323cab73305b','53a75511-518c-499b-b324-cf5652fd17e8','Ações','investment','chart-line','#2196F3',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('7fe8a00d-651b-400a-9ccd-3644c443cb0a','53a75511-518c-499b-b324-cf5652fd17e8','Assinaturas','expense','mobile','#FF5722',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('8f2918ae-96a9-4f0d-9661-4c457b4978f1','53a75511-518c-499b-b324-cf5652fd17e8','Lazer','expense','game','#9C27B0',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('ab93ef76-e127-43ba-b18a-a66ac2afbd04','53a75511-518c-499b-b324-cf5652fd17e8','Saúde','expense','health','#009688',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('b477d5c3-a095-463b-815e-006264f1f98f','53a75511-518c-499b-b324-cf5652fd17e8','Educação','expense','book','#3F51B5',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','53a75511-518c-499b-b324-cf5652fd17e8','Moradia','expense','home','#F44336',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('ca3ff964-06b9-45a8-8318-2a93597ed832','53a75511-518c-499b-b324-cf5652fd17e8','Outros','expense','cart','#607D8B',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('ce16800e-50e9-419b-845c-18b1b5f880cc','53a75511-518c-499b-b324-cf5652fd17e8','Transporte','expense','car','#795548',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('d2de5229-d9ac-437b-a3dc-f01c8bdd16d0','53a75511-518c-499b-b324-cf5652fd17e8','Freelance','income','laptop','#2196F3',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('e06a5177-e7c6-498e-b98c-b628a700f588','53a75511-518c-499b-b324-cf5652fd17e8','Salário','income','money-bag','#4CAF50',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('efe361cd-f1e1-49aa-b394-9e5951346378','53a75511-518c-499b-b324-cf5652fd17e8','Investimentos','income','chart-up','#673AB7',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26'),
('f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','53a75511-518c-499b-b324-cf5652fd17e8','Outros','income','dollar','#607D8B',NULL,1,'2025-04-15 18:31:26','2025-04-15 18:31:26');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_card_statements`
--

DROP TABLE IF EXISTS `credit_card_statements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_card_statements` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `credit_card_id` varchar(36) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `closing_date` date NOT NULL,
  `due_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('open','closed','paid') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `credit_card_id` (`credit_card_id`,`month`,`year`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `credit_card_statements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `credit_card_statements_ibfk_2` FOREIGN KEY (`credit_card_id`) REFERENCES `credit_cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_card_statements`
--

LOCK TABLES `credit_card_statements` WRITE;
/*!40000 ALTER TABLE `credit_card_statements` DISABLE KEYS */;
/*!40000 ALTER TABLE `credit_card_statements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_cards`
--

DROP TABLE IF EXISTS `credit_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_cards` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `limit_amount` decimal(10,2) NOT NULL,
  `closing_day` int(11) NOT NULL,
  `due_day` int(11) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_credit_cards_user` (`user_id`),
  CONSTRAINT `credit_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_cards`
--

LOCK TABLES `credit_cards` WRITE;
/*!40000 ALTER TABLE `credit_cards` DISABLE KEYS */;
INSERT INTO `credit_cards` VALUES
('05a2e86f-1f93-428f-bbc6-992816382bae','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Inter',11200.00,3,10,'#ff8d0a',1,'2025-04-16 09:43:14','2025-04-16 09:43:14'),
('28e22340-fc23-40bf-8c16-f5e738ff865b','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Porto Seguro',600.00,14,20,'#002de0',1,'2025-04-16 15:26:11','2025-04-16 15:30:33'),
('9acb10ba-4743-4005-b3a4-61a2480b49c4','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Nu',12450.00,26,3,'#694cb8',1,'2025-04-16 09:45:14','2025-04-16 09:45:14');
/*!40000 ALTER TABLE `credit_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `goals` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `target_amount` decimal(15,2) NOT NULL,
  `current_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `deadline` date DEFAULT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `idx_goals_user` (`user_id`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `goals_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES
('35e684e7-c814-43fa-bba6-092383b950b5','53a75511-518c-499b-b324-cf5652fd17e8','IPVA + Licenciamento 2026',1300.00,130.39,'2025-12-31','efe361cd-f1e1-49aa-b394-9e5951346378','Juntar o valor para poder pagar todo o ipva + licenciamento do carro','#f500c0',1,'2025-04-16 09:49:40','2025-04-16 09:49:40');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investments`
--

DROP TABLE IF EXISTS `investments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `investments` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('cdb','lci','lca','tesouro','funds','stocks','crypto','others') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `initial_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `expected_return` decimal(10,6) DEFAULT NULL,
  `current_return` decimal(10,6) DEFAULT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `goal_id` varchar(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_investments_user` (`user_id`),
  KEY `idx_investments_goal` (`goal_id`),
  KEY `idx_investments_category` (`category_id`),
  CONSTRAINT `investments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `investments_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `investments_ibfk_3` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investments`
--

LOCK TABLES `investments` WRITE;
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date` date NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `type` enum('income','expense','credit','investment') NOT NULL,
  `payment_method` enum('cash','debit','credit','pix','transfer') NOT NULL,
  `expense_type` enum('fixed','variable') DEFAULT NULL,
  `account_id` varchar(36) DEFAULT NULL,
  `credit_card_id` varchar(36) DEFAULT NULL,
  `installments` int(11) DEFAULT NULL,
  `current_installment` int(11) DEFAULT NULL,
  `parent_transaction_id` varchar(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `parent_transaction_id` (`parent_transaction_id`),
  KEY `idx_transactions_date` (`date`),
  KEY `idx_transactions_type` (`type`),
  KEY `idx_transactions_user_date` (`user_id`,`date`),
  KEY `idx_transactions_account` (`account_id`),
  KEY `idx_transactions_credit_card` (`credit_card_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`credit_card_id`) REFERENCES `credit_cards` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`parent_transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES
('07170f53-4e55-4932-a83e-bc058d75f3b8','53a75511-518c-499b-b324-cf5652fd17e8','Tim',52.99,'2025-04-16','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','debit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-16 15:32:20','2025-04-16 15:32:20'),
('0f6bcee6-1814-4f84-bd6c-1cb4257e1387','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro',389.31,'2025-04-01','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,5,NULL,NULL,1,0,'2025-04-16 15:29:59','2025-04-16 15:29:59'),
('23aeef93-8465-4cae-a285-1a9598b586ef','53a75511-518c-499b-b324-cf5652fd17e8','Pagamento ipva 2025',190.59,'2025-04-16','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','transfer','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,6,4,NULL,NULL,1,0,'2025-04-16 14:19:44','2025-04-16 14:19:44'),
('6e9bef32-0e6c-40aa-a325-d2ef90d97b4a','53a75511-518c-499b-b324-cf5652fd17e8','Salario',3134.89,'2025-04-15','e06a5177-e7c6-498e-b98c-b628a700f588','income','debit',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-16 13:48:07','2025-04-16 13:48:07'),
('ea4019af-1d35-4bdf-97f7-6cd877c0758e','53a75511-518c-499b-b324-cf5652fd17e8','Aula de ingles',260.00,'2025-04-15','b477d5c3-a095-463b-815e-006264f1f98f','expense','transfer','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento da aula',1,0,'2025-04-16 14:16:57','2025-04-16 14:16:57');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_transaction_insert
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_transaction_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
  IF NEW.account_id IS NOT NULL THEN
    
    IF OLD.account_id IS NOT NULL THEN
      IF OLD.type = 'income' THEN
        UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
      ELSEIF OLD.type IN ('expense', 'investment') THEN
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
      END IF;
    END IF;
    
    
    IF NEW.type = 'income' THEN
      UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSEIF NEW.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSEIF OLD.account_id IS NOT NULL THEN
    
    IF OLD.type = 'income' THEN
      UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSEIF OLD.type IN ('expense', 'investment') THEN
      UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_transaction_delete
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
('53a75511-518c-499b-b324-cf5652fd17e8','geraldojnjr@gmail.com','Geraldo','$2b$10$RCBNBSdVDFUI.nnlQbcMLOGz7p4Y9GbLmGXoLpcUMzkUunPx7tgoa',1,'2025-04-15 18:31:26','2025-04-15 18:31:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-16 13:05:21
