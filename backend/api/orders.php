<?php
/**
 * /api/orders.php
 * POST   — place order (public)
 * GET    — list orders (admin)
 * PUT    — update order status (admin)
 * DELETE — delete order (admin)
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

$method = $_SERVER['REQUEST_METHOD'];

// ── Public: place an order ────────────────────────────
if ($method === 'POST') {
    $data = json_body();

    if (empty($data['customer_name']))  json_err('Name is required');
    if (empty($data['customer_phone'])) json_err('Phone is required');
    if (empty($data['customer_area']))  json_err('Location/area is required');
    if (empty($data['product_id']))     json_err('Product is required');

    try {
        $db = db();
    } catch (Exception $e) {
        json_err('Database connection failed. Please try again later.', 503);
    }

    // Verify product exists
    $stmt = $db->prepare('SELECT id, name, sku, price_label, price_from FROM products WHERE id = ? AND active = 1');
    $stmt->execute([(int) $data['product_id']]);
    $product = $stmt->fetch();
    if (!$product) json_err('Product not found', 404);

    $price = $product['price_label'] ?: ('KES ' . number_format($product['price_from']));
    $url   = 'https://maifa.ke/shop/' . $product['id'];

    try {
        $insert = $db->prepare('
            INSERT INTO orders
                (product_id, product_name, product_sku, product_price, product_url,
                 customer_name, customer_phone, customer_area, notes, source)
            VALUES
                (:product_id, :product_name, :product_sku, :product_price, :product_url,
                 :customer_name, :customer_phone, :customer_area, :notes, :source)
        ');
        $insert->execute([
            ':product_id'    => $product['id'],
            ':product_name'  => $product['name'],
            ':product_sku'   => $product['sku'],
            ':product_price' => $price,
            ':product_url'   => $url,
            ':customer_name' => clean($data['customer_name']),
            ':customer_phone'=> clean($data['customer_phone']),
            ':customer_area' => clean($data['customer_area']),
            ':notes'         => clean($data['notes'] ?? ''),
            ':source'        => 'online',
        ]);
    } catch (Exception $e) {
        json_err('Order could not be saved. Please use WhatsApp to order instead.', 500);
    }

    $orderId = $db->lastInsertId();

    // Notify via email (best-effort)
    $msg = "New order #{$orderId}\n\nProduct: {$product['name']}\nPrice: {$price}\n\nCustomer: " . clean($data['customer_name']) . "\nPhone: " . clean($data['customer_phone']) . "\nArea: " . clean($data['customer_area']) . "\nNotes: " . clean($data['notes'] ?? 'None');
    notify_email($msg, "New Order #$orderId — {$product['name']}");

    json_ok(['order_id' => $orderId], 201);
}

// ── Admin-only below ──────────────────────────────────
require_auth();

if ($method === 'GET') {
    $db = db();

    if (!empty($_GET['id'])) {
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([(int) $_GET['id']]);
        $order = $stmt->fetch();
        if (!$order) json_err('Order not found', 404);
        json_ok(['order' => $order]);
    }

    $status = $_GET['status'] ?? '';
    $where  = $status ? ['status = ?'] : [];
    $params = $status ? [$status] : [];

    $sql  = 'SELECT * FROM orders' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC LIMIT 200';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $total = (int) $db->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    $new   = (int) $db->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();

    json_ok(['orders' => $stmt->fetchAll(), 'total' => $total, 'new' => $new]);
}

if ($method === 'PUT') {
    $data = json_body();
    if (empty($data['id']))     json_err('id is required');
    if (empty($data['status'])) json_err('status is required');

    $allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!in_array($data['status'], $allowed)) json_err('Invalid status');

    db()->prepare('UPDATE orders SET status = ? WHERE id = ?')
        ->execute([$data['status'], (int) $data['id']]);
    json_ok();
}

if ($method === 'DELETE') {
    $data = json_body();
    if (empty($data['id'])) json_err('id is required');
    db()->prepare('DELETE FROM orders WHERE id = ?')->execute([(int) $data['id']]);
    json_ok();
}

json_err('Method not allowed', 405);
