-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: ucms
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_login`
--

DROP TABLE IF EXISTS `admin_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_login` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_info_id` int NOT NULL,
  `adminLoginName` varchar(100) DEFAULT NULL,
  `password` text,
  `lastLogin` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '0 – Inactive, 1 – Active, 2 – Blocked, default : 1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  KEY `user_info_id` (`user_info_id`),
  KEY `adminLoginName` (`adminLoginName`),
  CONSTRAINT `admin_login_ibfk_1` FOREIGN KEY (`user_info_id`) REFERENCES `user_info` (`user_info_id`),
  CONSTRAINT `admin_login_ibfk_2` FOREIGN KEY (`adminLoginName`) REFERENCES `user_info` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_login`
--

LOCK TABLES `admin_login` WRITE;
/*!40000 ALTER TABLE `admin_login` DISABLE KEYS */;
INSERT INTO `admin_login` VALUES (1,1,'master','$2b$10$8ANbMZ7CIA3OZ32QqfsF.OJFt1NHaU6toriq8yRcPTNTF04TkgTjq','2023-01-07 22:05:39',1,'2022-10-16 15:35:33','2023-01-07 16:35:39'),(2,2,'admin','$2b$10$8ANbMZ7CIA3OZ32QqfsF.OJFt1NHaU6toriq8yRcPTNTF04TkgTjq',NULL,1,'2022-10-16 15:35:33','2023-01-07 16:35:39');
/*!40000 ALTER TABLE `admin_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_groups`
--

DROP TABLE IF EXISTS `contact_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_groups` (
  `cg_id` int NOT NULL AUTO_INCREMENT,
  `main_group` varchar(50) NOT NULL,
  `group_info` text,
  `status` tinyint(1) DEFAULT NULL COMMENT '0-Inactive, 1-Active, 2-Blocked',
  `created_by` varchar(50) NOT NULL COMMENT 'Admin Site Loggedin User',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_groups`
--

LOCK TABLES `contact_groups` WRITE;
/*!40000 ALTER TABLE `contact_groups` DISABLE KEYS */;
INSERT INTO `contact_groups` VALUES (1,'Intelligent Group','filtered group',1,'master','2022-10-29 16:46:34','2022-10-29 11:16:34'),(2,'Phone','default group',1,'master','2022-10-29 16:47:24','2022-10-29 11:17:24'),(3,'Email','cloud storage group',1,'master','2022-10-29 16:47:41','2022-10-29 11:17:41');
/*!40000 ALTER TABLE `contact_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_info`
--

DROP TABLE IF EXISTS `contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_info` (
  `ci_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL COMMENT 'Primary Key Id from admin_login table',
  `displayname` varchar(100) NOT NULL,
  `firstname` varchar(100) DEFAULT 'NULL',
  `middlename` varchar(100) DEFAULT 'NULL',
  `lastname` varchar(100) DEFAULT 'NULL',
  `nickname` varchar(50) DEFAULT 'NULL',
  `prefix_name` varchar(20) DEFAULT 'NULL',
  `company` varchar(100) DEFAULT 'NULL' COMMENT 'Company Name',
  `title` varchar(50) DEFAULT 'NULL' COMMENT 'Company Title',
  `phone_info` json DEFAULT NULL COMMENT 'Prefix,PhoneNumber,Label',
  `email_info` json DEFAULT NULL COMMENT 'Email,Label',
  `address_info` json DEFAULT NULL COMMENT 'Address,Label',
  `im_info` json DEFAULT NULL COMMENT 'IM,Label',
  `website_info` json DEFAULT NULL COMMENT 'Website Name',
  `date_info` json DEFAULT NULL COMMENT 'Date,Label',
  `notes` text COMMENT 'Bio or About',
  `profile_image` text COMMENT 'Contact Profile Pic',
  `status` tinyint(1) DEFAULT NULL COMMENT '0-Inactive, 1-Active, 2-Blocked',
  `created_by` varchar(50) NOT NULL COMMENT 'Admin Site Logged In Username',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ci_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_info`
--

LOCK TABLES `contact_info` WRITE;
/*!40000 ALTER TABLE `contact_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_save_locations`
--

DROP TABLE IF EXISTS `contact_save_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_save_locations` (
  `csl_id` int NOT NULL AUTO_INCREMENT,
  `save_location` varchar(100) NOT NULL COMMENT 'Contact Saved Location Name',
  `label` enum('Phone','Email','Sim') NOT NULL COMMENT 'Phone,Email,Sim',
  `status` tinyint(1) DEFAULT NULL COMMENT '0-Inactive, 1-Active, 2-Blocked',
  `created_by` varchar(50) NOT NULL COMMENT 'Admin Site Loggedin User',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`csl_id`),
  UNIQUE KEY `save_location` (`save_location`,`label`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_save_locations`
--

LOCK TABLES `contact_save_locations` WRITE;
/*!40000 ALTER TABLE `contact_save_locations` DISABLE KEYS */;
INSERT INTO `contact_save_locations` VALUES (1,'Phone','Phone',1,'master','2022-10-22 22:01:44','2022-10-22 16:31:44'),(2,'Jio','Sim',1,'master','2022-10-22 22:03:03','2022-10-22 16:33:03'),(3,'Idea','Sim',1,'master','2022-10-22 22:03:10','2022-10-22 16:33:10'),(4,'maheshmahi1599@gmail.com','Email',1,'master','2022-10-22 22:03:38','2022-10-22 16:33:38'),(5,'maheshpm1599@gmail.com','Email',1,'master','2022-10-22 22:03:45','2022-10-22 16:33:45');
/*!40000 ALTER TABLE `contact_save_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_sub_groups`
--

DROP TABLE IF EXISTS `contact_sub_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_sub_groups` (
  `csg_id` int NOT NULL AUTO_INCREMENT,
  `cg_id` int NOT NULL COMMENT 'Primary Key Id From contact_groups table',
  `sub_group` varchar(50) NOT NULL,
  `group_info` text,
  `status` tinyint(1) DEFAULT NULL COMMENT '0-Inactive, 1-Active, 2-Blocked',
  `created_by` varchar(50) NOT NULL COMMENT 'Admin Site Loggedin User',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`csg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_sub_groups`
--

LOCK TABLES `contact_sub_groups` WRITE;
/*!40000 ALTER TABLE `contact_sub_groups` DISABLE KEYS */;
INSERT INTO `contact_sub_groups` VALUES (1,1,'Company group','filtered by company',1,'master','2022-10-29 22:32:08','2022-12-08 12:44:36'),(2,1,'Contact time','filtered by time',1,'master','2022-10-29 22:38:27','2022-12-08 12:44:36'),(3,2,'Test group','test group',1,'master','2022-10-29 22:38:47','2022-12-08 12:44:36'),(4,2,'Main group','main group',1,'master','2022-10-29 22:39:05','2022-12-08 12:44:36');
/*!40000 ALTER TABLE `contact_sub_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_sub_info`
--

DROP TABLE IF EXISTS `contact_sub_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_sub_info` (
  `csi_id` int NOT NULL AUTO_INCREMENT,
  `contact_id` int NOT NULL COMMENT 'Primary Key Id From contact_info table',
  `groups` json DEFAULT NULL COMMENT 'Group Ids Array From contact_sub_groups table',
  `csl_id` int NOT NULL COMMENT 'Contact Saved Location Id',
  `status` tinyint(1) DEFAULT NULL COMMENT '0-Inactive, 1-Active, 2-Blocked',
  `created_by` varchar(50) NOT NULL COMMENT 'Admin Site Loggedin User',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`csi_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_sub_info`
--

LOCK TABLES `contact_sub_info` WRITE;
/*!40000 ALTER TABLE `contact_sub_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_sub_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_sps`
--

DROP TABLE IF EXISTS `test_sps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_sps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sp_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `file_name` text,
  `status` enum('1','0') DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_sps`
--

LOCK TABLES `test_sps` WRITE;
/*!40000 ALTER TABLE `test_sps` DISABLE KEYS */;
INSERT INTO `test_sps` VALUES (1,'CALL test_sp(@p_report_type,@p_company_id);','Billing_scheme_fees','1','2023-01-04 14:53:05','2023-01-05 13:15:10'),(2,'new_sp','Residuals_fee_items','1','2023-01-04 14:53:12','2023-01-05 13:15:25'),(3,'textdata','','1','2023-01-06 16:56:05','2023-01-06 11:26:05');
/*!40000 ALTER TABLE `test_sps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_info_id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `profile` json DEFAULT NULL,
  `role` varchar(50) DEFAULT 'student' COMMENT 'admin, employee, student, default : student',
  `status` tinyint(1) DEFAULT '1' COMMENT '0 – Inactive, 1 – Active, 2 – Blocked, default : 1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_info_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (1,'test master','master','master123@gmail.com','9876543210','8th block, koramangala','Bengaluru','Karnataka','India','560095','{\"image\": \"http://localhost:3636/uploads\\\\profile-1672586782024.jpeg\", \"github\": \"https://github.com/maheshpcse\", \"aboutme\": \"I am what I am\", \"website\": \"http://localhost:5200\", \"facebook\": \"https://www.facebook.com/pmahesh1599\", \"instagram\": \"https://www.instagram.com/maheshpm599\", \"department\": \"Engineering - CSE\", \"designation\": \"Mean Stack Developer\"}','admin',1,'2022-10-16 15:35:04','2023-01-07 16:04:12'),(2,'test admin','admin','admin123@gmail.com','9876543210','8th block, koramangala','Bengaluru','Karnataka','India','560095',NULL,'admin',1,'2022-10-16 15:35:04','2022-12-26 17:59:04');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_login` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_info_id` int NOT NULL,
  `userLoginName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` text,
  `lastLogin` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '0 – Inactive, 1 – Active, 2 – Blocked, default : 1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `user_info_id` (`user_info_id`),
  KEY `userLoginName` (`userLoginName`),
  CONSTRAINT `user_login_ibfk_1` FOREIGN KEY (`user_info_id`) REFERENCES `user_info` (`user_info_id`),
  CONSTRAINT `user_login_ibfk_2` FOREIGN KEY (`userLoginName`) REFERENCES `user_info` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login`
--

LOCK TABLES `user_login` WRITE;
/*!40000 ALTER TABLE `user_login` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_login` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-07 22:18:35
