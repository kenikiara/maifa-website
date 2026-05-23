<?php
/**
 * /api/warranty.php
 * POST — submit warranty registration (public)
 *   Accepts either:
 *     a) multipart/form-data  (when a receipt file is attached)
 *     b) application/json     (when no file)
 * GET  ?code=MFA-XXXX — lookup a warranty (public)
 * GET  (admin)        — list all registrations
 * PUT  (admin)        — update status / notes
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

$method = $_SERVER['REQUEST_METHOD'];

/* ── Public: lookup by code ── */
if ($method === 'GET' && !empty($_GET['code'])) {
    $stmt = db()->prepare('SELECT warranty_code, status, battery_model, purchase_date, created_at FROM warranty_registrations WHERE warranty_code = ?');
    $stmt->execute([strtoupper(clean($_GET['code']))]);
    $row = $stmt->fetch();
    if (!$row) json_err('Warranty code not found', 404);
    json_ok(['warranty' => $row]);
}

/* ── Public: submit registration ── */
if ($method === 'POST') {

    /* Detect body format */
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (str_contains($ct, 'multipart/form-data')) {
        $d = $_POST;          // PHP auto-parses multipart into $_POST
    } else {
        $d = json_body();     // JSON body
    }

    /* Validate required fields */
    $required = [
        'full_name', 'phone', 'email',
        'battery_model', 'serial_number', 'purchase_date',
        'purchased_at', 'invoice_number',
        'vehicle_make', 'vehicle_model', 'vehicle_year', 'number_plate',
    ];
    foreach ($required as $f) {
        if (empty($d[$f])) json_err("$f is required");
    }

    /* Handle optional file upload */
    $receipt_file = null;
    if (!empty($_FILES['receipt_file']) && $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK) {
        $ext     = strtolower(pathinfo($_FILES['receipt_file']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'pdf'];
        if (!in_array($ext, $allowed))              json_err('Invalid file type. Allowed: JPG, PNG, PDF.');
        if ($_FILES['receipt_file']['size'] > 8 * 1024 * 1024) json_err('File too large. Maximum 8 MB.');

        $uploadDir = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/uploads/receipts/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $filename     = 'receipt_' . time() . '_' . bin2hex(random_bytes(5)) . '.' . $ext;
        $destination  = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['receipt_file']['tmp_name'], $destination)) {
            $receipt_file = '/uploads/receipts/' . $filename;
        }
    }

    $code = generate_warranty_code();

    $stmt = db()->prepare('
        INSERT INTO warranty_registrations
            (full_name, national_id, phone, email, city, area,
             battery_model, serial_number, purchase_date, purchased_at, invoice_number,
             fitted_by_maifa, trade_in,
             vehicle_make, vehicle_model, vehicle_year, number_plate, mileage, primary_use,
             receipt_file, warranty_code, status)
        VALUES
            (:full_name,:national_id,:phone,:email,:city,:area,
             :battery_model,:serial_number,:purchase_date,:purchased_at,:invoice_number,
             :fitted_by_maifa,:trade_in,
             :vehicle_make,:vehicle_model,:vehicle_year,:number_plate,:mileage,:primary_use,
             :receipt_file,:warranty_code,\'active\')
    ');

    $stmt->execute([
        ':full_name'       => clean($d['full_name']),
        ':national_id'     => clean($d['national_id'] ?? ''),
        ':phone'           => clean($d['phone']),
        ':email'           => clean($d['email']),
        ':city'            => clean($d['city'] ?? ''),
        ':area'            => clean($d['area'] ?? ''),
        ':battery_model'   => clean($d['battery_model']),
        ':serial_number'   => 'MFA-' . clean($d['serial_number']),
        ':purchase_date'   => clean($d['purchase_date']),
        ':purchased_at'    => clean($d['purchased_at']),
        ':invoice_number'  => clean($d['invoice_number']),
        ':fitted_by_maifa' => (int) ($d['fitted_by_maifa'] ?? 1),
        ':trade_in'        => (int) ($d['trade_in'] ?? 0),
        ':vehicle_make'    => clean($d['vehicle_make']),
        ':vehicle_model'   => clean($d['vehicle_model']),
        ':vehicle_year'    => (int) ($d['vehicle_year'] ?? 0),
        ':number_plate'    => strtoupper(clean($d['number_plate'])),
        ':mileage'         => !empty($d['mileage']) ? (int) $d['mileage'] : null,
        ':primary_use'     => in_array($d['primary_use'] ?? '', ['personal','commercial','heavy-duty']) ? $d['primary_use'] : 'personal',
        ':receipt_file'    => $receipt_file,
        ':warranty_code'   => $code,
    ]);

    notify_email(
        "New warranty registration:\nName: {$d['full_name']}\nPhone: {$d['phone']}\nBattery: {$d['battery_model']}\nVehicle: {$d['vehicle_make']} {$d['vehicle_model']} ({$d['vehicle_year']})\nPlate: {$d['number_plate']}\nCode: $code",
        'New Warranty Registration — Maifa'
    );

    json_ok(['warranty_code' => $code], 201);
}

/* ── Admin ── */
require_auth();

if ($method === 'GET') {
    $stmt = db()->query('SELECT * FROM warranty_registrations ORDER BY created_at DESC');
    json_ok(['registrations' => $stmt->fetchAll()]);
}

if ($method === 'PUT') {
    $d = json_body();
    if (empty($d['id'])) json_err('id is required');
    $allowed = ['active','claimed','expired','voided'];
    $status  = in_array($d['status'] ?? '', $allowed) ? $d['status'] : 'active';
    $stmt = db()->prepare('UPDATE warranty_registrations SET status=?, notes=? WHERE id=?');
    $stmt->execute([$status, clean($d['notes'] ?? ''), (int) $d['id']]);
    json_ok();
}

json_err('Method not allowed', 405);
