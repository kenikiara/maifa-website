<?php
/**
 * /api/auth.php
 * POST   — login
 * DELETE — logout
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

session_name(SESSION_NAME);
session_start();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_body();
    if ($data['username'] === ADMIN_USER && password_verify($data['password'] ?? '', ADMIN_PASS)) {
        $_SESSION['admin'] = true;
        json_ok(['message' => 'Logged in']);
    }
    json_err('Invalid credentials', 401);
}

if ($method === 'DELETE') {
    session_destroy();
    json_ok(['message' => 'Logged out']);
}

json_err('Method not allowed', 405);
