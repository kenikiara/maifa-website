<?php
/**
 * Maifa — Shared helpers
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

function json_ok(array $data = [], int $status = 200): never {
    http_response_code($status);
    echo json_encode(['success' => true, ...$data]);
    exit;
}

function json_err(string $message, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

function set_cors(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function require_auth(): void {
    session_name(SESSION_NAME);
    session_start();
    if (empty($_SESSION['admin'])) json_err('Unauthorized', 401);
}

function json_body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function handle_upload(string $field, string $sub): string|null {
    if (empty($_FILES[$field]['tmp_name'])) return null;

    $file = $_FILES[$field];
    if (!in_array($file['type'], ALLOWED_TYPES)) {
        json_err('Invalid file type. Use JPG, PNG, WebP or PDF.');
    }
    if ($file['size'] > MAX_UPLOAD_MB * 1024 * 1024) {
        json_err('File too large (max ' . MAX_UPLOAD_MB . ' MB).');
    }

    $ext  = pathinfo($file['name'], PATHINFO_EXTENSION);
    $name = uniqid($sub . '_', true) . '.' . strtolower($ext);
    $dir  = UPLOAD_DIR . $sub . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    if (!move_uploaded_file($file['tmp_name'], $dir . $name)) {
        json_err('Upload failed. Check folder permissions.');
    }
    return UPLOAD_URL . $sub . '/' . $name;
}

function clean(string $s): string {
    return htmlspecialchars(trim($s), ENT_QUOTES, 'UTF-8');
}

function notify_email(string $message, string $subject = 'New Maifa Notification'): void {
    $to      = SITE_EMAIL;
    $headers = implode("\r\n", [
        'From: noreply@maifa.ke',
        'Reply-To: ' . SITE_EMAIL,
        'Content-Type: text/plain; charset=UTF-8',
    ]);
    @mail($to, $subject, $message, $headers);
}

function make_slug(string $title, string $override = ''): string {
    if ($override) return preg_replace('/[^a-z0-9-]/', '', strtolower(trim($override)));
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    return trim($slug, '-');
}

function generate_warranty_code(): string {
    do {
        $code = 'MFA-' . strtoupper(substr(md5(uniqid()), 0, 4)) . '-' . strtoupper(substr(md5(microtime()), 0, 4));
        $exists = db()->prepare('SELECT id FROM warranty_registrations WHERE warranty_code = ?');
        $exists->execute([$code]);
    } while ($exists->fetch());
    return $code;
}
