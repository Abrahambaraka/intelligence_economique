-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 17, 2025 at 07:53 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `intelligene_economique`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `rubriqueSlug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `Article_rubriqueSlug_idx` (`rubriqueSlug`),
  KEY `Article_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `articletag`
--

DROP TABLE IF EXISTS `articletag`;
CREATE TABLE IF NOT EXISTS `articletag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ArticleTag_articleId_idx` (`articleId`),
  KEY `ArticleTag_tagId_idx` (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `magazine`
--

DROP TABLE IF EXISTS `magazine`;
CREATE TABLE IF NOT EXISTS `magazine` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issueNumber` int DEFAULT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `coverImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdfUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `Magazine_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newslettersubscription`
--

DROP TABLE IF EXISTS `newslettersubscription`;
CREATE TABLE IF NOT EXISTS `newslettersubscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `confirmedAt` datetime(3) DEFAULT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rubrique`
--

DROP TABLE IF EXISTS `rubrique`;
CREATE TABLE IF NOT EXISTS `rubrique` (
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rubrique`
--

INSERT INTO `rubrique` (`slug`, `label`) VALUES
('actualite-societe', 'Actualité & Société'),
('agriculture-elevage', 'Agriculture & Élevage'),
('economie-finance', 'Économie & Finance'),
('environnement-climat', 'Environnement & Climat'),
('mines-petrole-gaz', 'Mines, Pétrole & Gaz'),
('politique-gouvernance', 'Politique & Gouvernance'),
('technologie-innovation', 'Technologie & Innovation'),
('transport-logistique', 'Transport & Logistique');

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
CREATE TABLE IF NOT EXISTS `video` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `videoUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `Video_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `article_ibfk_1` FOREIGN KEY (`rubriqueSlug`) REFERENCES `rubrique` (`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `articletag`
--
ALTER TABLE `articletag`
  ADD CONSTRAINT `articletag_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `articletag_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
