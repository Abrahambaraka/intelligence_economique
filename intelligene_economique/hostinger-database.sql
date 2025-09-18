-- Script SQL pour créer la base de données MySQL Hostinger
-- Exécutez ce script via phpMyAdmin ou l'interface Hostinger

-- Création de la base de données (remplacez intelligene_economique par le nom souhaité)
CREATE DATABASE IF NOT EXISTS `intelligene_economique` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `intelligene_economique`;

-- Création des tables pour Intelligence Économique

-- Table des rubriques
CREATE TABLE IF NOT EXISTS `Rubrique` (
  `slug` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des articles
CREATE TABLE IF NOT EXISTS `Article` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `excerpt` TEXT,
  `body` LONGTEXT NOT NULL,
  `image` VARCHAR(191),
  `publishedAt` DATETIME(3),
  `author` VARCHAR(191),
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `rubriqueSlug` VARCHAR(191),
  PRIMARY KEY (`id`),
  INDEX `Article_rubriqueSlug_idx` (`rubriqueSlug`),
  INDEX `Article_publishedAt_idx` (`publishedAt`),
  FOREIGN KEY (`rubriqueSlug`) REFERENCES `Rubrique` (`slug`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tags
CREATE TABLE IF NOT EXISTS `Tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL UNIQUE,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de liaison articles-tags
CREATE TABLE IF NOT EXISTS `ArticleTag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `articleId` VARCHAR(191) NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `ArticleTag_articleId_idx` (`articleId`),
  INDEX `ArticleTag_tagId_idx` (`tagId`),
  FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des magazines
CREATE TABLE IF NOT EXISTS `Magazine` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `issueNumber` INT,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT,
  `coverImage` VARCHAR(191),
  `pdfUrl` VARCHAR(191),
  `publishedAt` DATETIME(3),
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Magazine_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des vidéos
CREATE TABLE IF NOT EXISTS `Video` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT,
  `videoUrl` VARCHAR(191) NOT NULL,
  `thumbnail` VARCHAR(191),
  `duration` INT,
  `publishedAt` DATETIME(3),
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Video_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des abonnés newsletter
CREATE TABLE IF NOT EXISTS `NewsletterSubscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `confirmedAt` DATETIME(3),
  `source` VARCHAR(191),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des rubriques par défaut
INSERT IGNORE INTO `Rubrique` (`slug`, `label`) VALUES
('economie-finance', 'Économie & Finance'),
('actualite-societe', 'Actualité & Société'),
('mines-petrole-gaz', 'Mines, Pétrole & Gaz'),
('agriculture-elevage', 'Agriculture & Élevage'),
('transport-logistique', 'Transport & Logistique'),
('technologie-innovation', 'Technologie & Innovation'),
('environnement-climat', 'Environnement & Climat'),
('politique-gouvernance', 'Politique & Gouvernance');