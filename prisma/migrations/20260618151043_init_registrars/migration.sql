-- CreateTable
CREATE TABLE `registrars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logo` TEXT NULL,
    `description` TEXT NULL,
    `website` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `support_email` VARCHAR(191) NULL,
    `support_phone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Actif',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `accredited_since` DATETIME(3) NULL,
    `domains_count` INTEGER NOT NULL DEFAULT 0,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `registrars_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
