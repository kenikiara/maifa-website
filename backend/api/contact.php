<?php
/**
 * /api/contact.php
 * POST — submit contact message (public)
 * GET  — list messages (admin)
 * PUT  — mark as read (admin)
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $d = json_body();
    if (empty($d['name']) || empty($d['message'])) json_err('name and message are required');

    $stmt = db()->prepare('
        INSERT INTO contact_messages (name, email, phone, subject, message)
        VALUES (:name, :email, :phone, :subject, :message)
    ');
    $stmt->execute([
        ':name'    => clean($d['name']),
        ':email'   => clean($d['email'] ?? ''),
        ':phone'   => clean($d['phone'] ?? ''),
        ':subject' => clean($d['subject'] ?? 'General Enquiry'),
        ':message' => clean($d['message']),
    ]);

    notify_email(
        "From: {$d['name']}\nPhone: {$d['phone']}\nEmail: {$d['email']}\n\n{$d['message']}",
        'New Contact Message — Maifa'
    );

    json_ok(['message' => 'Message sent successfully']);
}

require_auth();

if ($method === 'GET') {
    $stmt = db()->query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    json_ok(['messages' => $stmt->fetchAll()]);
}

if ($method === 'PUT') {
    $d = json_body();
    if (empty($d['id'])) json_err('id is required');
    db()->prepare('UPDATE contact_messages SET read_status = 1 WHERE id = ?')->execute([(int) $d['id']]);
    json_ok();
}

if ($method === 'DELETE') {
    $d = json_body();
    if (empty($d['id'])) json_err('id is required');
    db()->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([(int) $d['id']]);
    json_ok();
}

json_err('Method not allowed', 405);
