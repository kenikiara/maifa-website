-- ═══════════════════════════════════════════════════════
-- MAIFA — Orders migration
-- Run once in phpMyAdmin SQL tab
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
    id             INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    -- Product snapshot
    product_id     INT UNSIGNED   NOT NULL DEFAULT 0,
    product_name   VARCHAR(300)   NOT NULL DEFAULT '',
    product_sku    VARCHAR(100)   NOT NULL DEFAULT '',
    product_price  VARCHAR(100)   NOT NULL DEFAULT '',
    product_url    VARCHAR(500)   NOT NULL DEFAULT '',
    -- Customer
    customer_name  VARCHAR(200)   NOT NULL,
    customer_phone VARCHAR(50)    NOT NULL,
    customer_area  VARCHAR(200)   NOT NULL DEFAULT '',
    notes          TEXT,
    -- Status
    status         ENUM('pending','confirmed','delivered','cancelled') NOT NULL DEFAULT 'pending',
    -- Order source
    source         ENUM('online','whatsapp') NOT NULL DEFAULT 'online',
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
