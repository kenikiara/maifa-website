-- ═══════════════════════════════════════════════════════
-- MAIFA — MySQL Schema
-- Run once in phpMyAdmin (SQL tab) after creating your DB
-- ═══════════════════════════════════════════════════════

-- ── Products (car batteries) ───────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id                INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(200)     NOT NULL,
    sku               VARCHAR(100)     NOT NULL DEFAULT '',
    category          VARCHAR(100)     NOT NULL DEFAULT '',  -- Standard|Large Car|EFB|Heavy Duty|European
    price_label       VARCHAR(100)     NOT NULL DEFAULT '',  -- e.g. "KES 17,500"
    price_from        INT UNSIGNED     NOT NULL DEFAULT 0,   -- numeric for sort/filter
    sale_price        INT UNSIGNED     NOT NULL DEFAULT 0,   -- 0 = no sale
    description       TEXT,
    short_desc        VARCHAR(500)     NOT NULL DEFAULT '',
    voltage           TINYINT UNSIGNED NOT NULL DEFAULT 12,  -- always 12
    ah                TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- amp-hours
    cca               SMALLINT UNSIGNED NOT NULL DEFAULT 0,  -- cold cranking amps
    image             VARCHAR(500)     NOT NULL DEFAULT '',
    badge             VARCHAR(50)      NOT NULL DEFAULT '',  -- Best seller|New arrival|Save X|EFB
    whatsapp_message  TEXT,
    sort_order        TINYINT UNSIGNED NOT NULL DEFAULT 0,
    active            TINYINT(1)       NOT NULL DEFAULT 1,
    created_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Warranty Registrations ─────────────────────────────
CREATE TABLE IF NOT EXISTS warranty_registrations (
    id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    -- Owner
    full_name       VARCHAR(200)  NOT NULL,
    national_id     VARCHAR(50)   DEFAULT NULL,
    phone           VARCHAR(30)   NOT NULL,
    email           VARCHAR(200)  NOT NULL,
    city            VARCHAR(100)  NOT NULL DEFAULT '',
    area            VARCHAR(100)  DEFAULT NULL,
    -- Battery
    battery_model   VARCHAR(200)  NOT NULL,
    serial_number   VARCHAR(100)  NOT NULL,
    purchase_date   DATE          NOT NULL,
    purchased_at    VARCHAR(100)  NOT NULL DEFAULT '',
    invoice_number  VARCHAR(100)  NOT NULL DEFAULT '',
    fitted_by_maifa TINYINT(1)   NOT NULL DEFAULT 1,
    trade_in        TINYINT(1)   NOT NULL DEFAULT 0,
    -- Vehicle
    vehicle_make    VARCHAR(100)  NOT NULL DEFAULT '',
    vehicle_model   VARCHAR(100)  NOT NULL DEFAULT '',
    vehicle_year    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    number_plate    VARCHAR(30)   NOT NULL DEFAULT '',
    mileage         INT UNSIGNED  DEFAULT NULL,
    primary_use     ENUM('personal','commercial','heavy-duty') NOT NULL DEFAULT 'personal',
    -- Receipt upload
    receipt_file    VARCHAR(500)  DEFAULT NULL,
    -- Status
    warranty_code   VARCHAR(20)   UNIQUE NOT NULL,   -- MFA-XXXX-XXXX auto-generated
    status          ENUM('active','claimed','expired','voided') NOT NULL DEFAULT 'active',
    notes           TEXT,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Contact Messages ───────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    email       VARCHAR(200) NOT NULL DEFAULT '',
    phone       VARCHAR(30)  DEFAULT NULL,
    subject     VARCHAR(300) NOT NULL DEFAULT 'General Enquiry',
    message     TEXT         NOT NULL,
    read_status TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══════════════════════════════════════════════════════
-- Sample seed data — Amaron battery catalogue
-- ═══════════════════════════════════════════════════════

INSERT INTO products (name, sku, category, price_label, price_from, sale_price, short_desc, ah, cca, badge, whatsapp_message, sort_order) VALUES
('Amaron Hi Life NS40 42B20L 35Ah',      'NS40-35A',    'Standard',   'KES 10,500', 10500, 11200, '12V maintenance-free starter battery for small sedans. High Heat Technology.', 35,  335,  '',           'Hi! I''m interested in the Amaron NS40 (35Ah) battery. Can I get more details?', 1),
('Amaron Hi Life 55B24L 45Ah',           'NS60-45A',    'Standard',   'KES 12,800', 12800, 13900, '12V 45Ah starter battery engineered for Kenyan weather. Factory charged.', 45,  380,  '',           'Hi! I''m interested in the Amaron 55B24L (45Ah) battery. Can I get more details?', 2),
('Amaron Hi Life NS70L 65Ah',            'NS70L-65A',   'Standard',   'KES 17,000', 17000, 18200, 'Kenya''s top-selling battery. 65Ah, 600 CCA. Fits Toyota, Nissan, Honda & more.', 65, 600,  'Best seller', 'Hi! I''m interested in the Amaron NS70L (65Ah) battery. Can I get more details?', 3),
('Amaron Flo 50B20L 350 CCA',            'FLO-350',     'Standard',   'KES 9,800',  9800,  0,     '12V Flo series. Compact size, 350 CCA. Ideal for light hatchbacks.', 35,  350,  '',           'Hi! I''m interested in the Amaron Flo 50B20L battery. Can I get more details?', 4),
('Amaron Flo 600 CCA 95D26L',            'FLO-600',     'Large Car',  'KES 19,000', 19000, 0,     '12V 70Ah 600 CCA. High-performance Flo series for large cars and SUVs.', 70,  600,  '',           'Hi! I''m interested in the Amaron Flo 600 CCA (95D26L) battery. Can I get more details?', 5),
('Amaron N95 125D31R 95Ah',              'N95-95A',     'Large Car',  'KES 22,800', 22800, 24500, '12V 95Ah 600 CCA. SUVs, pickups and heavy cars. Dimensions: 306×173×205mm.', 95,  600,  '',           'Hi! I''m interested in the Amaron N95 (95Ah) battery. Can I get more details?', 6),
('Amaron Onyx EFB 500 CCA',              'EFB-500',     'EFB',        'KES 16,500', 16500, 0,     'Enhanced Flooded Battery for idle-stop-start vehicles. 500 CCA.', 55,  500,  'Idle stop-start', 'Hi! I''m interested in the Amaron Onyx EFB 500 CCA battery. Can I get more details?', 7),
('Amaron Onyx EFB 660 CCA Q85/90DL',    'EFB-660',     'EFB',        'KES 19,500', 19500, 0,     'Top EFB for hybrid-ready stop-start systems. 75Ah, 660 CCA.', 75,  660,  'Idle stop-start', 'Hi! I''m interested in the Amaron Onyx EFB 660 CCA battery. Can I get more details?', 8),
('Amaron Hegmo EFB Q85L 650 CCA',       'EFB-650',     'EFB',        'KES 18,000', 18000, 0,     'EFB technology. 650 CCA. Designed for frequent start-stop cycles.', 60,  650,  '',           'Hi! I''m interested in the Amaron Hegmo EFB Q85L battery. Can I get more details?', 9),
('Amaron Hi Life T110 145D31L',          'T110-110A',   'Heavy Duty', 'KES 28,500', 28500, 0,     '12V 110Ah heavy-duty battery. Maximum vibration resistance for Kenyan terrain.', 110, 550,  '',           'Hi! I''m interested in the Amaron T110 Heavy Duty battery. Can I get more details?', 10),
('Amaron N80 Hi-Way Heavy Duty',         'N80-80A',     'Heavy Duty', 'KES 24,000', 24000, 0,     '12V 80Ah Hi-Way series. Built for trucks, matatus and commercial vehicles.', 80,  550,  '',           'Hi! I''m interested in the Amaron N80 Hi-Way battery. Can I get more details?', 11),
('Amaron Pro 610 CCA H5 DIN66L',        'PRO-610',     'European',   'KES 24,500', 24500, 0,     '12V 66Ah 610 CCA. European standard DIN66 for BMW, Mercedes, Audi.', 66,  610,  '',           'Hi! I''m interested in the Amaron Pro 610 CCA H5 battery. Can I get more details?', 12),
('Amaron Pro 800 CCA DIN',               'PRO-800',     'European',   'KES 27,000', 27000, 0,     '12V 800 CCA Pro series. High CCA for German luxury vehicles.', 80,  800,  'New arrival', 'Hi! I''m interested in the Amaron Pro 800 CCA battery. Can I get more details?', 13),
('Amaron Pro 900 CCA H8 DIN100L',       'PRO-900',     'European',   'KES 29,500', 29500, 30000, '12V 100Ah 900 CCA. Top of the range. For BMW 7-series, Mercedes S-Class.', 100, 900,  'New arrival', 'Hi! I''m interested in the Amaron Pro 900 CCA H8 battery. Can I get more details?', 14),
('Amaron 730 CCA T-DIN80L',              'DIN80-730',   'European',   'KES 26,500', 26500, 0,     '12V 80Ah 730 CCA DIN series. Versatile European-spec battery.', 80,  730,  '',           'Hi! I''m interested in the Amaron 730 CCA T-DIN80L battery. Can I get more details?', 15),
('Chloride Exide Powerlast',             'CHL-PL',      'Heavy Duty', 'KES 21,000', 21000, 0,     'Reliable Chloride Exide for commercial fleets. Long cycle life.', 88,  550,  '',           'Hi! I''m interested in the Chloride Exide Powerlast battery. Can I get more details?', 16);
