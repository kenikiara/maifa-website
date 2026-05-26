-- Run this once in phpMyAdmin to create the subscribers table
-- Go to: phpMyAdmin → maifa database → SQL tab → paste and Run

CREATE TABLE IF NOT EXISTS subscribers (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
