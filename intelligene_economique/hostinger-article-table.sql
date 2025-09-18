-- Script SQL pour créer la table Article sur MySQL Hostinger
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
  PRIMARY KEY (`id`),
  INDEX `Article_publishedAt_idx` (`publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajoutez d'autres tables si besoin (Rubrique, Magazine, etc.)