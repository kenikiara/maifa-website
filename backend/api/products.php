<?php
/**
 * /api/products.php
 * GET    — list active products, filter by category/id (public)
 * POST   — create product (admin)
 * PUT    — update product (admin)
 * DELETE — delete product (admin)
 */

require_once __DIR__ . '/../config/helpers.php';
set_cors();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = db();

    if (!empty($_GET['id'])) {
        $stmt = $db->prepare('SELECT * FROM products WHERE id = ? AND active = 1');
        $stmt->execute([(int) $_GET['id']]);
        $product = $stmt->fetch();
        if (!$product) json_err('Product not found', 404);
        json_ok(['product' => $product]);
    }

    $where  = ['active = 1'];
    $params = [];

    if (!empty($_GET['category'])) {
        $where[]  = 'category = ?';
        $params[] = clean($_GET['category']);
    }
    if (!empty($_GET['search'])) {
        $where[]  = '(name LIKE ? OR short_desc LIKE ? OR sku LIKE ?)';
        $s = '%' . clean($_GET['search']) . '%';
        $params[] = $s; $params[] = $s; $params[] = $s;
    }
    if (!empty($_GET['max_price'])) {
        $where[]  = 'price_from <= ?';
        $params[] = (int) $_GET['max_price'];
    }

    $sort = match ($_GET['sort'] ?? '') {
        'price_asc'  => 'price_from ASC',
        'price_desc' => 'price_from DESC',
        'ah_desc'    => 'ah DESC',
        'cca_desc'   => 'cca DESC',
        default      => 'sort_order ASC, id DESC',
    };

    $sql  = 'SELECT * FROM products WHERE ' . implode(' AND ', $where) . " ORDER BY $sort";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    json_ok(['products' => $stmt->fetchAll()]);
}

require_auth();

if ($method === 'POST') {
    $data = json_body();
    if (empty($data['name'])) json_err('name is required');

    $db   = db();
    $stmt = $db->prepare('
        INSERT INTO products (name, sku, category, price_label, price_from, sale_price, short_desc, description, voltage, ah, cca, image, badge, whatsapp_message, sort_order, active)
        VALUES (:name,:sku,:category,:price_label,:price_from,:sale_price,:short_desc,:description,:voltage,:ah,:cca,:image,:badge,:whatsapp_message,:sort_order,:active)
    ');
    $stmt->execute([
        ':name'             => clean($data['name']),
        ':sku'              => clean($data['sku'] ?? ''),
        ':category'         => clean($data['category'] ?? ''),
        ':price_label'      => clean($data['price_label'] ?? ''),
        ':price_from'       => (int) ($data['price_from'] ?? 0),
        ':sale_price'       => (int) ($data['sale_price'] ?? 0),
        ':short_desc'       => clean($data['short_desc'] ?? ''),
        ':description'      => clean($data['description'] ?? ''),
        ':voltage'          => (int) ($data['voltage'] ?? 12),
        ':ah'               => (int) ($data['ah'] ?? 0),
        ':cca'              => (int) ($data['cca'] ?? 0),
        ':image'            => clean($data['image'] ?? ''),
        ':badge'            => clean($data['badge'] ?? ''),
        ':whatsapp_message' => clean($data['whatsapp_message'] ?? "Hi! I'm interested in {$data['name']}."),
        ':sort_order'       => (int) ($data['sort_order'] ?? 0),
        ':active'           => (int) ($data['active'] ?? 1),
    ]);
    json_ok(['id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $data = json_body();
    if (empty($data['id'])) json_err('id is required');

    $db   = db();
    $stmt = $db->prepare('
        UPDATE products SET
            name=:name, sku=:sku, category=:category, price_label=:price_label,
            price_from=:price_from, sale_price=:sale_price, short_desc=:short_desc,
            description=:description, voltage=:voltage, ah=:ah, cca=:cca,
            image=:image, badge=:badge, whatsapp_message=:whatsapp_message,
            sort_order=:sort_order, active=:active
        WHERE id=:id
    ');
    $stmt->execute([
        ':name'             => clean($data['name'] ?? ''),
        ':sku'              => clean($data['sku'] ?? ''),
        ':category'         => clean($data['category'] ?? ''),
        ':price_label'      => clean($data['price_label'] ?? ''),
        ':price_from'       => (int) ($data['price_from'] ?? 0),
        ':sale_price'       => (int) ($data['sale_price'] ?? 0),
        ':short_desc'       => clean($data['short_desc'] ?? ''),
        ':description'      => clean($data['description'] ?? ''),
        ':voltage'          => (int) ($data['voltage'] ?? 12),
        ':ah'               => (int) ($data['ah'] ?? 0),
        ':cca'              => (int) ($data['cca'] ?? 0),
        ':image'            => clean($data['image'] ?? ''),
        ':badge'            => clean($data['badge'] ?? ''),
        ':whatsapp_message' => clean($data['whatsapp_message'] ?? ''),
        ':sort_order'       => (int) ($data['sort_order'] ?? 0),
        ':active'           => (int) ($data['active'] ?? 1),
        ':id'               => (int) $data['id'],
    ]);
    json_ok();
}

if ($method === 'DELETE') {
    $data = json_body();
    if (empty($data['id'])) json_err('id is required');
    db()->prepare('DELETE FROM products WHERE id = ?')->execute([(int) $data['id']]);
    json_ok();
}

json_err('Method not allowed', 405);
