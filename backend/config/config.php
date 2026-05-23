<?php
/**
 * Maifa — App-wide configuration
 * Update ALL values before deploying.
 */

// ── Admin credentials ──────────────────────────────────
define('ADMIN_USER', 'maifa_admin');
define('ADMIN_PASS', password_hash('change_this_password', PASSWORD_DEFAULT));

// ── Site info ──────────────────────────────────────────
define('SITE_NAME',        'Maifa');
define('SITE_EMAIL',       'info@maifa.ke');
define('WHATSAPP_NUMBER',  '254791899602');   // Thika Road main line

// ── File uploads ───────────────────────────────────────
define('UPLOAD_DIR',    __DIR__ . '/../uploads/');
define('UPLOAD_URL',    '/backend/uploads/');
define('MAX_UPLOAD_MB', 8);
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

// ── Session ────────────────────────────────────────────
define('SESSION_NAME', 'maifa_admin');

// ── CORS ───────────────────────────────────────────────
define('ALLOWED_ORIGIN', 'https://maifa.ke');
