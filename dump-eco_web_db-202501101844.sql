-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 192.168.0.4    Database: eco_web_db
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `board_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(400) DEFAULT NULL,
  `board_date` datetime DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `member_id` int unsigned NOT NULL,
  `content_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`board_id`),
  KEY `board_member_id_fk` (`member_id`),
  KEY `board_content_type_id_fk` (`content_type_id`),
  CONSTRAINT `board_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `board_ibfk_2` FOREIGN KEY (`content_type_id`) REFERENCES `content_type` (`content_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (1,'첫 번째 게시글','안녕하세요, 첫 번째 게시글입니다.','2024-12-23 11:21:28','https://placehold.co/250x200',1,1),(2,'두 번째 게시글','이것은 두 번째 게시글입니다.','2024-12-23 11:21:28','https://placehold.co/250x200',2,1);
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board_view`
--

DROP TABLE IF EXISTS `board_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board_view` (
  `view_date` datetime DEFAULT NULL,
  `heart` int DEFAULT NULL,
  `board_id` int unsigned NOT NULL,
  `member_id` int unsigned NOT NULL,
  PRIMARY KEY (`member_id`,`board_id`),
  KEY `board_view_board_id_fk` (`board_id`),
  KEY `board_view_member_id_fk` (`member_id`),
  CONSTRAINT `board_view_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `board` (`board_id`),
  CONSTRAINT `board_view_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board_view`
--

LOCK TABLES `board_view` WRITE;
/*!40000 ALTER TABLE `board_view` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_category`
--

DROP TABLE IF EXISTS `content_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_category` (
  `content_category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`content_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_category`
--

LOCK TABLES `content_category` WRITE;
/*!40000 ALTER TABLE `content_category` DISABLE KEYS */;
INSERT INTO `content_category` VALUES (1,'커뮤니티'),(2,'고객문의');
/*!40000 ALTER TABLE `content_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_type`
--

DROP TABLE IF EXISTS `content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_type` (
  `content_type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  `content_category_id` int unsigned NOT NULL,
  PRIMARY KEY (`content_type_id`),
  KEY `content_type_category_id_fk` (`content_category_id`),
  CONSTRAINT `content_type_ibfk_1` FOREIGN KEY (`content_category_id`) REFERENCES `content_category` (`content_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_type`
--

LOCK TABLES `content_type` WRITE;
/*!40000 ALTER TABLE `content_type` DISABLE KEYS */;
INSERT INTO `content_type` VALUES (1,'친환경뉴스',1),(2,'친환경팁',1),(3,'자유게시판',1),(4,'배송',2),(5,'상품',2),(6,'교환/반품',2);
/*!40000 ALTER TABLE `content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eco_bag`
--

DROP TABLE IF EXISTS `eco_bag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eco_bag` (
  `added_date` datetime NOT NULL,
  `member_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  PRIMARY KEY (`member_id`,`product_id`),
  KEY `eco_member_id_fk` (`member_id`),
  KEY `eco_product_id_fk` (`product_id`),
  CONSTRAINT `eco_bag_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `eco_bag_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eco_bag`
--

LOCK TABLES `eco_bag` WRITE;
/*!40000 ALTER TABLE `eco_bag` DISABLE KEYS */;
INSERT INTO `eco_bag` VALUES ('2024-12-23 11:21:28',1,1),('2024-12-23 11:21:28',2,2);
/*!40000 ALTER TABLE `eco_bag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry`
--

DROP TABLE IF EXISTS `inquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry` (
  `inquiry_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(400) DEFAULT NULL,
  `inquiry_date` datetime DEFAULT NULL,
  `member_id` int unsigned NOT NULL,
  `inquiry_status_id` int unsigned NOT NULL,
  `content_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`inquiry_id`),
  KEY `inquiry_member_id_fk` (`member_id`),
  KEY `inquiry_status_id_fk` (`inquiry_status_id`),
  KEY `inquiry_content_type_id_fk` (`content_type_id`),
  CONSTRAINT `inquiry_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `inquiry_ibfk_2` FOREIGN KEY (`inquiry_status_id`) REFERENCES `inquiry_status` (`inquiry_status_id`),
  CONSTRAINT `inquiry_ibfk_3` FOREIGN KEY (`content_type_id`) REFERENCES `content_type` (`content_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry`
--

LOCK TABLES `inquiry` WRITE;
/*!40000 ALTER TABLE `inquiry` DISABLE KEYS */;
INSERT INTO `inquiry` VALUES (1,'문의 1','첫 번째 문의입니다.','2024-12-23 11:21:28',1,1,1),(2,'문의 2','두 번째 문의입니다.','2024-12-23 11:21:28',2,2,1);
/*!40000 ALTER TABLE `inquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_comment`
--

DROP TABLE IF EXISTS `inquiry_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_comment` (
  `inquiry_comment_id` int unsigned NOT NULL AUTO_INCREMENT,
  `comment` varchar(300) DEFAULT NULL,
  `comment_date` datetime DEFAULT NULL,
  `inquiry_id` int unsigned NOT NULL,
  PRIMARY KEY (`inquiry_comment_id`),
  KEY `inquiry_comment_inquiry_id_fk` (`inquiry_id`),
  CONSTRAINT `inquiry_comment_ibfk_1` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiry` (`inquiry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_comment`
--

LOCK TABLES `inquiry_comment` WRITE;
/*!40000 ALTER TABLE `inquiry_comment` DISABLE KEYS */;
INSERT INTO `inquiry_comment` VALUES (1,'첫 번째 댓글입니다.','2024-12-23 11:21:28',1),(2,'두 번째 댓글입니다.','2024-12-23 11:21:28',2);
/*!40000 ALTER TABLE `inquiry_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_status`
--

DROP TABLE IF EXISTS `inquiry_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_status` (
  `inquiry_status_id` int unsigned NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) NOT NULL,
  PRIMARY KEY (`inquiry_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_status`
--

LOCK TABLES `inquiry_status` WRITE;
/*!40000 ALTER TABLE `inquiry_status` DISABLE KEYS */;
INSERT INTO `inquiry_status` VALUES (1,'답변대기'),(2,'답변완료');
/*!40000 ALTER TABLE `inquiry_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pwd` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `eco_point` int unsigned DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `member_type_id` int unsigned NOT NULL,
  `subs_id` int unsigned NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  KEY `member_type_id_fk` (`member_type_id`),
  KEY `member_subs_id_fk` (`subs_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`member_type_id`) REFERENCES `member_type` (`member_type_id`),
  CONSTRAINT `member_ibfk_2` FOREIGN KEY (`subs_id`) REFERENCES `subs` (`subs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'홍길동','hong@example.com','$2b$10$n2X3Sp5ArEQ0yBAtDPND6eORcnaY3.LSjf5QHET7a6wepk4rJzI/2','010-1234-5678',100,'https://placehold.co/250x200',1,1,'서울시 동작구 상도동'),(2,'김철수','kim@example.com','password456','010-9876-5432',150,'https://placehold.co/250x200',2,1,'서울시 금천구 가산디지털단지'),(3,'이영희','lee@example.com','password789','010-5555-5555',200,'https://placehold.co/250x200',1,2,'경기도 시흥시 롯데아울렛'),(4,'오준명','elephant@example.com','$2b$10$CwDnKfsJwIwh1BzXPjSE9On6c67ksr0JimEMx4isnOr1zgKrmUux2','010-1234-5678',100,'https://placehold.co/250x200',1,1,'서울 금천구 가마산로 70 A동'),(7,'test','123','$2b$10$UCb//CYxkAGNuIXQvHSbt./kycnx/XCKFtbZZCJS5pginboSm50rK','01024545555',100,'https://placehold.co/250x200',1,1,'가산동'),(8,'ㅈㅁㄷ','ㅇㅈㅁ','$2b$10$E9Z5CpGBD4KNx9t8OxO43OXOtxGXZ8gqNdwb2Lk7cVuL1AmmDxLgy','ㅇㅁㅈ',100,'https://placehold.co/250x200',1,1,'서울 영등포구 문래동2가 1 ㅁㅈㄷ'),(9,'장예원','mindstate@naver.com','$2b$10$vXTPmxwEE/vq654m./PqDu1y2TM45hg.2.iVb0Oe1F0VzURr.jyGC','010-1111-2222',100,'https://placehold.co/250x200',1,1,'경기 광명시 시청로 20 '),(16,'111','123123','$2b$10$gXnewGEAzgdoSIh9Jb7RPOnFVlMP/a9xk61c9ajdhEY4v3gFBJaHW','111',100,'https://placehold.co/250x200',1,1,' '),(17,'12322','123@123','$2b$10$YoUqcIn4ZnKoppZ/rAuYtOKvZlxub8fL0UhdKX0wiLLJz75UdsWyu','12322',100,'https://placehold.co/250x200',1,1,' '),(19,'54','doh440711@gmail.com','$2b$10$ila35weJhDCM1FAOIYmG9.AvpU7QmLqNSPthlQbhuFJZs2V40Eo.i',NULL,100,'https://lh3.googleusercontent.com/a/ACg8ocJE6TtRKqMlKTn6qsveCkY4z_g56JJBRPEsTLCIzxccF9nTkwM=s96-c',2,1,NULL),(21,'12322','dawd@111','$2b$10$Vijo3Je./tSuWi4BzMzOu.IycZKTpMDm7hGVHkrCrikBxD6MeYsWy','123333',100,'https://placehold.co/250x200',1,1,' '),(33,'루돌프','12345@email.com','$2b$10$K74K9Zjo98OYnj7BfSzaoeUR8DSExseANDjXxK8ZlDV/ivfYwOLgK','010-333-3333',100,'https://placehold.co/250x200',1,1,'경기 파주시 파주읍 봉암길 218 루돌프 상사'),(37,'김도훈','doh40711@naver.com','$2b$10$0rke5XnggijQeB4vOzs/FOvIdDj0F2WS1yuV7Qtl20WcUUp1Q6/8e','010-8768-9896',100,'https://phinf.pstatic.net/contact/20240814_231/1723617992677htTCY_PNG/%B0%E6%C1%A6%C0%FB%C0%DA%C0%AF1.png',3,1,NULL),(39,'오준명','junmyung2020@gmail.com','$2b$10$kUe/acXtYk5POLKh2iVRlOAZrJ34h3Oi/T2jrctSvECuzAVi17aIC',NULL,100,'https://lh3.googleusercontent.com/a/ACg8ocKKd8G7VehI344TzrIe11Uo7pUcrNMwn2JbKnqLjZaEUyWUxA=s96-c',2,1,NULL),(42,'오준명','junmyung2020@naver.com','$2b$10$NhL6okpxsdLYjZJGOaWhdeVLFbtPH77ZNHUpCnq01oaoMbIYYzSii','010-9334-2299',100,'https://phinf.pstatic.net/contact/20171214_278/1513254713231m1ROJ_PNG/avatar_profile.png',2,1,NULL),(43,'33','123@123','$2b$10$xT6NdqJOG7kkYmvM2bBxl.eR7QW5botqu86WVIsrICEkRMN56lXGS','33',100,'https://placehold.co/250x200',1,1,'서울 영등포구 경인로 702 33'),(44,'강사님','123@123','$2b$10$/zS7ifoZMn.uUnu9f3Mh.uOf/Jzs9RnjF7CMm37m6/9pdM.ScR0W6','123123132132',100,'https://placehold.co/250x200',1,1,' '),(49,'민석','alstjr@asd.asd','$2b$10$KtKy/qzEbkvf5a8hmkSZdOGk3LG9gxLk7qPTsn1QsIazXQEKEWRU2','010-1010-2021',100,'https://placehold.co/250x200',1,1,'충북 청주시 서원구 1순환로 627 ');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_type`
--

DROP TABLE IF EXISTS `member_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_type` (
  `member_type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`member_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_type`
--

LOCK TABLES `member_type` WRITE;
/*!40000 ALTER TABLE `member_type` DISABLE KEYS */;
INSERT INTO `member_type` VALUES (1,'일반회원가입'),(2,'구글로그인'),(3,'네이버로그인');
/*!40000 ALTER TABLE `member_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(400) DEFAULT NULL,
  `notice_date` datetime DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `member_id` int unsigned NOT NULL,
  `content_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`notice_id`),
  KEY `notice_member_id_fk` (`member_id`),
  KEY `notice_content_type_id_fk` (`content_type_id`),
  CONSTRAINT `notice_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `notice_ibfk_2` FOREIGN KEY (`content_type_id`) REFERENCES `content_type` (`content_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (1,'공지 1','첫 번째 공지사항입니다.','2024-12-23 11:21:28','https://placehold.co/250x200',1,1),(2,'공지 2','두 번째 공지사항입니다.','2024-12-23 11:21:28','https://placehold.co/250x200',2,1);
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_view`
--

DROP TABLE IF EXISTS `notice_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_view` (
  `view_date` datetime DEFAULT NULL,
  `notice_id` int unsigned NOT NULL,
  `member_id` int unsigned NOT NULL,
  PRIMARY KEY (`notice_id`,`member_id`),
  KEY `notice_view_notice_id_fk` (`notice_id`),
  KEY `notice_view_member_id_fk` (`member_id`),
  CONSTRAINT `notice_view_ibfk_1` FOREIGN KEY (`notice_id`) REFERENCES `notice` (`notice_id`),
  CONSTRAINT `notice_view_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_view`
--

LOCK TABLES `notice_view` WRITE;
/*!40000 ALTER TABLE `notice_view` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int unsigned NOT NULL AUTO_INCREMENT,
  `payment_date` date DEFAULT NULL,
  `payment_token` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `member_id` int unsigned NOT NULL,
  `subs_id` int unsigned NOT NULL,
  `payment_type_id` int unsigned NOT NULL,
  `subs_status_id` int unsigned NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `payment_member_id_fk` (`member_id`),
  KEY `payment_subs_id_fk` (`subs_id`),
  KEY `payment_type_id_fk` (`payment_type_id`),
  KEY `payment_subs_status_id_fk` (`subs_status_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`subs_id`) REFERENCES `subs` (`subs_id`),
  CONSTRAINT `payment_ibfk_3` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type` (`payment_type_id`),
  CONSTRAINT `payment_ibfk_4` FOREIGN KEY (`subs_status_id`) REFERENCES `subs_status` (`subs_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'2024-12-23','token1','2024-12-23','2025-01-23',1,1,1,1),(2,'2024-12-23','token2','2024-12-23','2025-01-23',2,1,1,1);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_type`
--

DROP TABLE IF EXISTS `payment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_type` (
  `payment_type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`payment_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_type`
--

LOCK TABLES `payment_type` WRITE;
/*!40000 ALTER TABLE `payment_type` DISABLE KEYS */;
INSERT INTO `payment_type` VALUES (1,'신용카드'),(2,'체크카드'),(3,'계좌이체'),(4,'휴대폰 결제'),(5,'가상계좌');
/*!40000 ALTER TABLE `payment_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `price` int unsigned DEFAULT NULL,
  `product_type_id` int unsigned NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `product_type_fk` (`product_type_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`product_type_id`) REFERENCES `product_type` (`product_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'제품 A','제품 A의 설명입니다.',10000,1),(2,'제품 B','제품 B의 설명입니다.',20000,2);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_type`
--

DROP TABLE IF EXISTS `product_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_type` (
  `product_type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`product_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_type`
--

LOCK TABLES `product_type` WRITE;
/*!40000 ALTER TABLE `product_type` DISABLE KEYS */;
INSERT INTO `product_type` VALUES (1,'타입 A'),(2,'타입 B');
/*!40000 ALTER TABLE `product_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subs`
--

DROP TABLE IF EXISTS `subs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subs` (
  `subs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` int unsigned DEFAULT NULL,
  PRIMARY KEY (`subs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subs`
--

LOCK TABLES `subs` WRITE;
/*!40000 ALTER TABLE `subs` DISABLE KEYS */;
INSERT INTO `subs` VALUES (1,'기본형',1000),(2,'프리미엄',2000);
/*!40000 ALTER TABLE `subs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subs_status`
--

DROP TABLE IF EXISTS `subs_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subs_status` (
  `subs_status_id` int unsigned NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) NOT NULL,
  PRIMARY KEY (`subs_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subs_status`
--

LOCK TABLES `subs_status` WRITE;
/*!40000 ALTER TABLE `subs_status` DISABLE KEYS */;
INSERT INTO `subs_status` VALUES (1,'활성'),(2,'비활성');
/*!40000 ALTER TABLE `subs_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'eco_web_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-10 18:44:07
