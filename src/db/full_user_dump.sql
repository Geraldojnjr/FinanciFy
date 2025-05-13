/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
  `active` tinyint(1) NOT NULL DEFAULT 1,
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES
('6e3c39a3-5080-4f39-80f8-830ea3e61bb3','53a75511-518c-499b-b324-cf5652fd17e8','BB',0.00,0.00,'checking','Banco do Brasil','#F59E0B',1,'2025-04-16 09:37:19','2025-04-16 09:37:19'),
('7bbb7e93-d881-4f23-a7cc-614c228c4315','53a75511-518c-499b-b324-cf5652fd17e8','Banco Inter',-368.24,2.18,'checking','Banco Inter','#F97316',1,'2025-04-16 09:41:45','2025-05-06 11:19:45'),
('98de5e8f-9a9d-4c72-9c7f-eafd756a5337','53a75511-518c-499b-b324-cf5652fd17e8','NuBank',0.00,0.00,'checking','NuBank','#9333EA',1,'2025-04-16 09:36:40','2025-04-16 09:36:40');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:24
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:26
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `credit_card_statements` WRITE;
/*!40000 ALTER TABLE `credit_card_statements` DISABLE KEYS */;
/*!40000 ALTER TABLE `credit_card_statements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:31
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `credit_cards` WRITE;
/*!40000 ALTER TABLE `credit_cards` DISABLE KEYS */;
INSERT INTO `credit_cards` VALUES
('05a2e86f-1f93-428f-bbc6-992816382bae','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Inter',11200.00,3,10,'#ff8d0a',1,'2025-04-16 09:43:14','2025-04-16 09:43:14'),
('28e22340-fc23-40bf-8c16-f5e738ff865b','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Porto Seguro',600.00,14,20,'#002de0',1,'2025-04-16 15:26:11','2025-04-16 15:30:33'),
('9acb10ba-4743-4005-b3a4-61a2480b49c4','53a75511-518c-499b-b324-cf5652fd17e8','Cartão Nu',12450.00,26,3,'#694cb8',1,'2025-04-16 09:45:14','2025-04-16 09:45:14');
/*!40000 ALTER TABLE `credit_cards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:29
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES
('73565037-b44c-435f-9ebd-687656bc3548','53a75511-518c-499b-b324-cf5652fd17e8','Amortização',100000.00,900.00,'2029-12-31','2228df4c-e2c5-4775-99e6-955677c2097e','Juntar o máximo possível para amortizar o financiamento da casa','#00ff2a',1,'2025-04-16 23:46:23','2025-05-09 19:25:54'),
('db67cb04-a625-42ba-b4c3-b6a72e3574cb','53a75511-518c-499b-b324-cf5652fd17e8','IPVA + Licenciamento 2026',1300.00,224.00,'2025-12-31','67990a28-f375-4f3f-a15e-261203d4aaf8','Juntar o valor para pagar IPVA e licenciamento do carro em 2026','#6750A4',1,'2025-04-16 23:41:26','2025-05-09 18:12:43'),
('fb9bdda7-1780-4e32-ac10-ed9301ef66c7','53a75511-518c-499b-b324-cf5652fd17e8','Reserva de Emergencia',30000.00,310.71,'2027-12-31','67a2eaae-c9ba-45a9-b01b-530e4c0aaa4a','Ter um valor para uma emergência','#ff0000',1,'2025-04-16 23:43:39','2025-04-16 23:44:37');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:35
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `investments` WRITE;
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
INSERT INTO `investments` VALUES
('00b64a01-505b-4e81-90c7-fc647be4df04','53a75511-518c-499b-b324-cf5652fd17e8','NuBank Caixinha - Carro','cdb',224.00,'2025-04-16','2025-12-31',NULL,NULL,'67a2eaae-c9ba-45a9-b01b-530e4c0aaa4a','db67cb04-a625-42ba-b4c3-b6a72e3574cb','',1,'2025-04-16 23:41:57','2025-05-09 18:12:42'),
('22ed84b3-a843-4323-a670-88ab15c456b5','53a75511-518c-499b-b324-cf5652fd17e8','NuBank Caixinha - Reserva Emergência','cdb',301071.00,'2025-04-16',NULL,NULL,NULL,'67a2eaae-c9ba-45a9-b01b-530e4c0aaa4a','fb9bdda7-1780-4e32-ac10-ed9301ef66c7','',0,'2025-04-16 23:44:37','2025-05-09 18:01:49'),
('617f5b94-6df2-45ed-961e-9b3df934a85a','53a75511-518c-499b-b324-cf5652fd17e8','44544','cdb',900.00,'2025-05-09',NULL,NULL,NULL,'789e6f04-2684-4642-85b5-323cab73305b','73565037-b44c-435f-9ebd-687656bc3548','',1,'2025-05-09 17:45:56','2025-05-09 19:25:54'),
('ba47253d-591c-4c2c-94c4-90f688bf2c67','53a75511-518c-499b-b324-cf5652fd17e8','NuBank Caixinha - Amortização','cdb',280.33,'2025-04-16',NULL,NULL,NULL,'67a2eaae-c9ba-45a9-b01b-530e4c0aaa4a','73565037-b44c-435f-9ebd-687656bc3548','',0,'2025-04-16 23:46:54','2025-05-09 17:54:40');
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:37
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  user_id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES
('00818ac5-a60a-47bc-8f50-401e944b07f0','53a75511-518c-499b-b324-cf5652fd17e8','Oxxo - Energetico',22.62,'2025-04-22','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:39:05','2025-05-06 11:19:44'),
('0364b1ae-27f4-4204-a147-47489c11d6e6','53a75511-518c-499b-b324-cf5652fd17e8','Compra Aliexpress ?',13.75,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',12,4,NULL,'Não se oq é',1,1,'2025-04-17 09:57:49','2025-05-06 11:19:45'),
('042b6dec-a8b1-42f9-86fb-6e0da0279b5f','53a75511-518c-499b-b324-cf5652fd17e8','Seguro cartao protegido (11/12)',9.99,'2025-06-24','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,11,'63f08b82-eac4-445a-857e-3c5b18b03b30','Seguro cartao protegido',1,0,'2025-04-17 17:54:50','2025-04-17 20:58:11'),
('07170f53-4e55-4932-a83e-bc058d75f3b8','53a75511-518c-499b-b324-cf5652fd17e8','Tim',52.99,'2025-04-16','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','debit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-16 15:32:20','2025-04-16 18:39:54'),
('08942617-564f-4fc7-a66d-5f6579d8f3c1','53a75511-518c-499b-b324-cf5652fd17e8','Seguro cartao protegido (9/12)',9.99,'2025-04-24','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,9,'63f08b82-eac4-445a-857e-3c5b18b03b30','Seguro cartao protegido',1,0,'2025-04-17 17:54:50','2025-04-17 20:59:31'),
('1157cfc5-cf72-4f35-8d9e-7073dabc4699','53a75511-518c-499b-b324-cf5652fd17e8','Seguro residencial (12/12)',146.65,'2025-07-24','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','fixed',NULL,'28e22340-fc23-40bf-8c16-f5e738ff865b',12,12,'fc95795b-418e-472f-9275-4787aa7d6af5',NULL,1,0,'2025-04-17 17:39:33','2025-04-17 20:57:59'),
('1486104a-7713-44c6-9c23-b6967a7f512a','53a75511-518c-499b-b324-cf5652fd17e8','stake fé',100.00,'2025-04-30','8f2918ae-96a9-4f0d-9661-4c457b4978f1','expense','pix','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:36:07','2025-05-05 15:33:54'),
('1c0df45c-f536-45df-afaf-a74878e598f3','53a75511-518c-499b-b324-cf5652fd17e8','FoodToSave',34.99,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:18:28','2025-05-06 11:19:45'),
('23aeef93-8465-4cae-a285-1a9598b586ef','53a75511-518c-499b-b324-cf5652fd17e8','Pagamento ipva 2025',190.59,'2025-04-16','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','transfer','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,6,4,NULL,NULL,1,1,'2025-04-16 14:19:44','2025-04-16 18:39:43'),
('26adb078-7cad-402b-8665-0601c3096f5b','53a75511-518c-499b-b324-cf5652fd17e8','Compra calça jeans',119.99,'2025-04-23','1081694a-9be5-4d93-85bd-6f3c4bd51b55','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Compra da calça nas perambucanas',1,1,'2025-04-30 16:39:59','2025-05-06 11:19:45'),
('288a51a3-521a-411a-8379-83e7667657bb','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro (9/12)',232.67,'2025-04-24','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,9,'d48c36c6-8108-4aa6-a0ec-1ff26e269de1',NULL,1,0,'2025-04-17 17:41:50','2025-04-17 20:59:44'),
('2955269a-3b8b-40eb-8870-23f8bc86892c','53a75511-518c-499b-b324-cf5652fd17e8','Office 365 - saamella',120.00,'2025-04-18','f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento referente a este ano ',1,1,'2025-04-22 17:24:21','2025-04-22 17:28:56'),
('2dd1b0f4-f840-4ed7-a3ac-a93856dbd6c3','53a75511-518c-499b-b324-cf5652fd17e8','Areia Pet',51.98,'2025-04-17','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:03:57','2025-05-06 11:19:45'),
('2de1c843-b4df-4594-94f8-8c6d8ef5d3af','53a75511-518c-499b-b324-cf5652fd17e8','Salada e fruta',32.61,'2025-04-23','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-24 17:58:24','2025-05-06 11:19:44'),
('32b75c69-4d9c-4a85-bf34-eceec1601090','53a75511-518c-499b-b324-cf5652fd17e8','Padaria caiubi',67.83,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:15:35','2025-05-06 11:19:45'),
('3f315e14-2db2-44a2-bace-70e94e81293f','53a75511-518c-499b-b324-cf5652fd17e8','Seguro residencial (9/12)',146.65,'2025-04-24','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','fixed',NULL,'28e22340-fc23-40bf-8c16-f5e738ff865b',12,9,'fc95795b-418e-472f-9275-4787aa7d6af5',NULL,1,0,'2025-04-17 17:39:33','2025-04-17 20:59:57'),
('4f435995-3a61-45ed-bf9d-d9f91ab4a021','53a75511-518c-499b-b324-cf5652fd17e8','Raspou gannhou familão',5.00,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','pix','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-17 20:45:35','2025-04-22 17:28:50'),
('54b196c7-e0e7-4936-9d84-f285601cd598','53a75511-518c-499b-b324-cf5652fd17e8','Compra monale - salada e fruta',24.74,'2025-04-23','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:42:29','2025-05-06 11:19:45'),
('5d78476e-80d3-499d-b01f-0dfe1979071f','53a75511-518c-499b-b324-cf5652fd17e8','Energetico',18.00,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:17:43','2025-05-06 11:19:45'),
('5f16bdbb-f088-42ad-a263-651a26e2ced0','53a75511-518c-499b-b324-cf5652fd17e8','Estacionamento',15.00,'2025-04-17','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Estacionamento Psicologo',1,1,'2025-04-17 11:19:57','2025-05-06 11:19:45'),
('6204dc7a-de4c-464a-9a26-31304ae53ba0','53a75511-518c-499b-b324-cf5652fd17e8','CompraSalada',7.98,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:22:05','2025-05-06 11:19:45'),
('63cbdc7a-9653-40a6-885b-184caf19b17a','53a75511-518c-499b-b324-cf5652fd17e8','Office 365 - saamella da samia',120.00,'2025-04-18','f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento referente a samia ano passado',1,1,'2025-04-22 17:25:00','2025-04-22 17:28:57'),
('63f08b82-eac4-445a-857e-3c5b18b03b30','53a75511-518c-499b-b324-cf5652fd17e8','Seguro cartao protegido',9.99,'2025-03-24','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,8,NULL,'Seguro cartao protegido',1,1,'2025-04-17 17:54:50','2025-04-17 20:55:00'),
('6c2ab948-bd95-4cca-adfe-244a0efa6f86','53a75511-518c-499b-b324-cf5652fd17e8','Seguro residencial (10/12)',146.65,'2025-05-24','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','fixed',NULL,'28e22340-fc23-40bf-8c16-f5e738ff865b',12,10,'fc95795b-418e-472f-9275-4787aa7d6af5',NULL,1,0,'2025-04-17 17:39:33','2025-04-17 20:59:14'),
('6e9bef32-0e6c-40aa-a325-d2ef90d97b4a','53a75511-518c-499b-b324-cf5652fd17e8','Salario',3134.89,'2025-04-15','e06a5177-e7c6-498e-b98c-b628a700f588','income','debit',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-16 13:48:07','2025-04-16 17:39:55'),
('6eba14ce-885e-4405-bf6d-a68ec361dbac','53a75511-518c-499b-b324-cf5652fd17e8','Seguro residencial (11/12)',146.65,'2025-06-24','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','fixed',NULL,'28e22340-fc23-40bf-8c16-f5e738ff865b',12,11,'fc95795b-418e-472f-9275-4787aa7d6af5',NULL,1,0,'2025-04-17 17:39:33','2025-04-17 20:58:37'),
('73d98ed4-f8ac-4353-be0c-14b96309becf','53a75511-518c-499b-b324-cf5652fd17e8','Guilhermeama?',15.00,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Sei la oq foi isso',1,1,'2025-04-22 16:37:13','2025-05-06 11:19:44'),
('75ab9788-8d23-4c4a-8a85-e13c406ef741','53a75511-518c-499b-b324-cf5652fd17e8','Mercado?',28.73,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:17:16','2025-05-06 11:19:45'),
('7986b7e3-8814-4c09-86a0-b4d701c03859','53a75511-518c-499b-b324-cf5652fd17e8','Seguro cartao protegido (10/12)',9.99,'2025-05-24','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,10,'63f08b82-eac4-445a-857e-3c5b18b03b30','Seguro cartao protegido',1,0,'2025-04-17 17:54:50','2025-04-17 20:58:51'),
('7b9d8ecd-89ff-4558-9762-1e3253ded506','53a75511-518c-499b-b324-cf5652fd17e8','Energetico',9.00,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:08:18','2025-05-06 11:19:45'),
('7c936783-6b64-421b-b851-3ffebcb7d21c','53a75511-518c-499b-b324-cf5652fd17e8','OxxoEnergetico',18.00,'2025-04-21','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-22 16:35:13','2025-05-06 11:19:44'),
('7c9a55f1-2d32-467f-8d3c-2ca86eb75685','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro (10/12)',232.67,'2025-05-24','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,10,'d48c36c6-8108-4aa6-a0ec-1ff26e269de1',NULL,1,0,'2025-04-17 17:41:51','2025-04-17 20:59:01'),
('7df69736-61ff-43c8-91c1-c222f17b6a18','53a75511-518c-499b-b324-cf5652fd17e8','Oxxo - Energetico',18.00,'2025-04-23','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:40:39','2025-05-06 11:19:44'),
('7f579f21-9507-4092-a1b1-762d67b1d6d9','53a75511-518c-499b-b324-cf5652fd17e8','Oxxo_Fusion',22.58,'2025-04-23','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-24 17:57:16','2025-05-06 11:19:44'),
('8494f9aa-4d3d-4562-87d5-b6e2a6908767','53a75511-518c-499b-b324-cf5652fd17e8','Adiantamento do pagamento',2729.36,'2025-04-30','e06a5177-e7c6-498e-b98c-b628a700f588','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:35:37','2025-04-30 16:35:43'),
('885d6fa7-09a1-4f95-8564-06ef1d968b0f','53a75511-518c-499b-b324-cf5652fd17e8','Familhão',20.00,'2025-04-17','8f2918ae-96a9-4f0d-9661-4c457b4978f1','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:20:50','2025-04-17 20:47:23'),
('8e9ab98f-526d-447e-8000-90bdb2d8af73','53a75511-518c-499b-b324-cf5652fd17e8','NoiteDoHamburguerCaseiro',67.95,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Compra no açougue carnes para hambuerguer',1,1,'2025-04-17 11:19:17','2025-05-06 11:19:45'),
('91762e9e-7af2-48ff-8a7c-f30080b960bb','53a75511-518c-499b-b324-cf5652fd17e8','StefanyRodrigues ?',82.98,'2025-04-20','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-22 16:32:45','2025-05-06 11:19:44'),
('98f5a739-80b6-4228-8603-912f362b64d3','53a75511-518c-499b-b324-cf5652fd17e8','FoodToSave',30.99,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:23:08','2025-05-06 11:19:44'),
('9b20baff-8d75-4ec3-83e4-e0901cd529f0','53a75511-518c-499b-b324-cf5652fd17e8','Burguer King',67.70,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:04:45','2025-05-06 11:19:45'),
('9ce40ebc-d3b4-4c07-8d47-96ab84c7af8a','53a75511-518c-499b-b324-cf5652fd17e8','Compra Darkness',179.83,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',3,1,NULL,'Felipe Vai transaferir meta das barrinhas.\nComprado Carnibol + 2 caixas de barrinhas para mim e 2 para o Felipe',1,1,'2025-04-17 11:24:27','2025-05-06 11:19:44'),
('9e721c37-2eb5-4647-bcca-2f0768bbc0d9','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro (12/12)',232.67,'2025-07-24','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,12,'d48c36c6-8108-4aa6-a0ec-1ff26e269de1',NULL,1,0,'2025-04-17 17:41:51','2025-04-17 20:57:50'),
('a1a8e4c9-da5d-43fc-92c7-940b6e98f3c7','53a75511-518c-499b-b324-cf5652fd17e8','FoodToSave',30.99,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:07:15','2025-05-06 11:19:44'),
('aa11991e-525a-41a0-aa85-a9bb19b91236','53a75511-518c-499b-b324-cf5652fd17e8','ReiDoMate',38.80,'2025-04-20','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Compra de salgados',1,1,'2025-04-22 16:33:20','2025-05-06 11:19:44'),
('ac56b294-2c5b-42be-8bfd-9cba534be220','53a75511-518c-499b-b324-cf5652fd17e8','TotalPass',89.90,'2025-04-23','ab93ef76-e127-43ba-b18a-a66ac2afbd04','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:41:07','2025-05-06 11:19:45'),
('b5aa30c1-bb08-4350-91c3-432e69aab898','53a75511-518c-499b-b324-cf5652fd17e8','CarregadorChina',140.64,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Metade do felipe',1,1,'2025-04-17 11:22:38','2025-05-06 11:19:45'),
('b95a60b9-b617-4ff0-aab7-418c03c40c9c','53a75511-518c-499b-b324-cf5652fd17e8','Pagamento Office365 - Jandira',87.80,'2025-04-17','f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,NULL,1,1,'2025-04-17 20:46:49','2025-04-17 20:47:55'),
('b985e949-b1bc-4b28-823a-285cd473bfc6','53a75511-518c-499b-b324-cf5652fd17e8','Pagamento financiamento casa',3043.52,'2025-04-30','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','pix','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento de mais uma parcela da casa',1,1,'2025-04-30 16:34:11','2025-04-30 16:34:39'),
('befdef42-6dfb-47b1-bb17-4bd61e2515dd','53a75511-518c-499b-b324-cf5652fd17e8','Compra Mercado',41.96,'2025-04-23','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-24 17:57:59','2025-05-06 11:19:45'),
('c53bb3ef-58bc-4237-a2fb-b04f529cb991','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro (11/12)',232.67,'2025-06-24','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,11,'d48c36c6-8108-4aa6-a0ec-1ff26e269de1',NULL,1,0,'2025-04-17 17:41:51','2025-04-17 20:58:25'),
('ca11a53c-f708-4aa7-ad0e-42910273d014','53a75511-518c-499b-b324-cf5652fd17e8','Curso NFC',40.80,'2025-04-17','b477d5c3-a095-463b-815e-006264f1f98f','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',10,4,NULL,'Curso Penegui',1,1,'2025-04-17 09:56:55','2025-05-06 11:19:44'),
('caf80b34-b411-425d-8083-f6e4947510ec','53a75511-518c-499b-b324-cf5652fd17e8','Mercado danatura?',58.80,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,'Não sei oq foi comprado',1,1,'2025-04-17 11:16:47','2025-05-06 11:19:45'),
('cf56fd61-4bc6-4778-a6a8-d449ba05ec91','53a75511-518c-499b-b324-cf5652fd17e8','Felipe pagamento ',258.89,'2025-04-23','f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento salada, Fruta, carregador e darkbar',1,1,'2025-04-24 18:00:03','2025-04-24 18:01:46'),
('d23d8a1a-d11e-4d00-b6cc-a8752ca312d8','53a75511-518c-499b-b324-cf5652fd17e8','Energetico',12.87,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:05:57','2025-05-06 11:19:45'),
('d2dde7b3-a866-4ac4-bc10-1e925030e899','53a75511-518c-499b-b324-cf5652fd17e8','Compra pacote Office',464.07,'2025-04-20','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','pix','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Compra do pacote office',1,1,'2025-04-22 17:27:26','2025-04-22 19:26:46'),
('d48c36c6-8108-4aa6-a0ec-1ff26e269de1','53a75511-518c-499b-b324-cf5652fd17e8','Seguro do carro',232.67,'2025-03-24','ce16800e-50e9-419b-845c-18b1b5f880cc','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,8,NULL,NULL,1,1,'2025-04-17 17:41:50','2025-04-17 20:55:10'),
('db90890d-317a-4bc1-a952-b8fe4c1ea49b','53a75511-518c-499b-b324-cf5652fd17e8','Office Samia',120.00,'2025-04-18','f4fdd868-71ad-4109-851b-f5f7ffe9a2ce','income','pix',NULL,'7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento deste ano',1,1,'2025-04-22 17:25:45','2025-04-22 17:28:58'),
('ea4019af-1d35-4bdf-97f7-6cd877c0758e','53a75511-518c-499b-b324-cf5652fd17e8','Aula de ingles',260.00,'2025-04-15','b477d5c3-a095-463b-815e-006264f1f98f','expense','transfer','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315',NULL,NULL,NULL,NULL,'Pagamento da aula',1,1,'2025-04-16 14:16:57','2025-04-16 18:27:17'),
('f3b4b5d3-7802-4d25-bcd6-4e52683b6296','53a75511-518c-499b-b324-cf5652fd17e8','FValor perdido faltatnte no cartao',64.29,'2025-04-23','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-30 16:43:57','2025-05-06 11:19:45'),
('f909d61d-e515-47b9-bfaf-f7c16edc2fb8','53a75511-518c-499b-b324-cf5652fd17e8','Oxxo - Energetico',45.13,'2025-04-17','354e86b3-d1c9-4ce8-9616-55bcfd7b16fd','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:21:23','2025-05-06 11:19:45'),
('fc95795b-418e-472f-9275-4787aa7d6af5','53a75511-518c-499b-b324-cf5652fd17e8','Seguro residencial',146.65,'2025-03-24','bbecf0d7-db41-4a6f-8387-a1c783d6a7d9','expense','credit','fixed',NULL,'28e22340-fc23-40bf-8c16-f5e738ff865b',12,8,NULL,NULL,1,1,'2025-04-17 17:39:33','2025-04-17 20:55:21'),
('fe14ca51-fa26-45c6-9c0b-4b68f876931f','53a75511-518c-499b-b324-cf5652fd17e8','Seguro cartao protegido (12/12)',9.99,'2025-07-24','7fe8a00d-651b-400a-9ccd-3644c443cb0a','expense','credit','fixed','7bbb7e93-d881-4f23-a7cc-614c228c4315','28e22340-fc23-40bf-8c16-f5e738ff865b',12,12,'63f08b82-eac4-445a-857e-3c5b18b03b30','Seguro cartao protegido',1,0,'2025-04-17 17:54:51','2025-04-17 20:57:42'),
('fea68f18-008d-4236-bdf9-658011ad92c9','53a75511-518c-499b-b324-cf5652fd17e8','Mecadinho?',15.90,'2025-04-17','ca3ff964-06b9-45a8-8318-2a93597ed832','expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',NULL,NULL,NULL,NULL,1,1,'2025-04-17 11:20:28','2025-05-06 11:19:45'),
('ff170412-476d-460b-8ecf-a5b20856d678','53a75511-518c-499b-b324-cf5652fd17e8','Barra de protein',61.56,'2025-04-17',NULL,'expense','credit','variable','7bbb7e93-d881-4f23-a7cc-614c228c4315','05a2e86f-1f93-428f-bbc6-992816382bae',4,4,NULL,NULL,1,1,'2025-04-17 11:00:36','2025-05-06 11:19:45');
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 10:57:33
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: financial_app
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
-- WHERE:  id = '53a75511-518c-499b-b324-cf5652fd17e8'

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
('53a75511-518c-499b-b324-cf5652fd17e8','teste@teste','Geraldo','$2b$10$fz5SJ0Bz45Gg8.zHvoD/uOkRiKXOS/koT8pSwtQRSD2AhMjzrkphu',1,'2025-04-15 18:31:26','2025-05-11 00:51:07');
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

-- Dump completed on 2025-05-12 10:57:21
