<?php
/**
 * /api/newsletter.php
 * POST — subscribe an email address
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_err('Method not allowed', 405);
}

$d     = json_body();
$email = trim(strtolower($d['email'] ?? ''));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_err('Please enter a valid email address.');
}

try {
    $stmt = db()->prepare(
        'INSERT INTO subscribers (email) VALUES (:email)'
    );
    $stmt->execute([':email' => $email]);

    // Notify admin
    notify_email(
        "New newsletter subscriber: {$email}",
        'New Subscriber — Maifa'
    );

    json_ok(['message' => 'Subscribed successfully']);

} catch (\PDOException $e) {
    // Unique constraint violation — already subscribed
    if ($e->getCode() === '23000') {
        json_ok(['message' => 'Already subscribed']);
    }
    json_err('Could not save subscription. Please try again.');
}
