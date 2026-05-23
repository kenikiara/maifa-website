-- ═══════════════════════════════════════════════════════
-- Product image migration — run once in phpMyAdmin
-- Maps existing products to their image filenames
-- Images must be uploaded to maifa.ke/products/
-- ═══════════════════════════════════════════════════════

UPDATE products SET image = 'ns40.png'               WHERE sku = 'NS40-35A';
UPDATE products SET image = 'ns60.png'               WHERE sku = 'NS60-45A';
UPDATE products SET image = 'ns70l.png'              WHERE sku = 'NS70L-65A';
UPDATE products SET image = 'flo-350.png'            WHERE sku = 'FLO-350';
UPDATE products SET image = 'flo-600.png'            WHERE sku = 'FLO-600';
UPDATE products SET image = 'n95.png'                WHERE sku = 'N95-95A';
UPDATE products SET image = 'efb-500.png'            WHERE sku = 'EFB-500';
UPDATE products SET image = 'efb-660.png'            WHERE sku = 'EFB-660';
UPDATE products SET image = 'efb-650.png'            WHERE sku = 'EFB-650';
UPDATE products SET image = 't110.png'               WHERE sku = 'T110-110A';
UPDATE products SET image = 'n80-hiway.png'          WHERE sku = 'N80-80A';
UPDATE products SET image = 'pro-610.png'            WHERE sku = 'PRO-610';
UPDATE products SET image = 'pro-800.png'            WHERE sku = 'PRO-800';
UPDATE products SET image = 'pro-900.png'            WHERE sku = 'PRO-900';
UPDATE products SET image = 'din80-730.png'          WHERE sku = 'DIN80-730';
UPDATE products SET image = 'chloride-powerlast.png' WHERE sku = 'CHL-PL';
