<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db = db();

// Handle form submit
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'save') {
        $id = (int) ($_POST['id'] ?? 0);
        $imageUrl = clean($_POST['existing_image'] ?? '');
        $uploaded = handle_upload('image', 'products');
        if ($uploaded) $imageUrl = $uploaded;

        $fields = [
            'name'             => clean($_POST['name'] ?? ''),
            'sku'              => clean($_POST['sku'] ?? ''),
            'category'         => clean($_POST['category'] ?? ''),
            'price_label'      => clean($_POST['price_label'] ?? ''),
            'price_from'       => (int) ($_POST['price_from'] ?? 0),
            'sale_price'       => (int) ($_POST['sale_price'] ?? 0),
            'short_desc'       => clean($_POST['short_desc'] ?? ''),
            'description'      => clean($_POST['description'] ?? ''),
            'ah'               => (int) ($_POST['ah'] ?? 0),
            'cca'              => (int) ($_POST['cca'] ?? 0),
            'badge'            => clean($_POST['badge'] ?? ''),
            'whatsapp_message' => clean($_POST['whatsapp_message'] ?? ''),
            'sort_order'       => (int) ($_POST['sort_order'] ?? 0),
            'active'           => isset($_POST['active']) ? 1 : 0,
            'image'            => $imageUrl,
        ];

        if ($id) {
            $set = implode(', ', array_map(fn($k) => "$k=:$k", array_keys($fields)));
            $stmt = $db->prepare("UPDATE products SET $set WHERE id=:id");
            $stmt->execute([...$fields, ':id' => $id]);
            $msg = 'Product updated.';
        } else {
            $cols = implode(', ', array_keys($fields));
            $vals = implode(', ', array_map(fn($k) => ":$k", array_keys($fields)));
            $stmt = $db->prepare("INSERT INTO products ($cols) VALUES ($vals)");
            $stmt->execute($fields);
            $msg = 'Product added.';
        }
    } elseif ($action === 'delete') {
        $db->prepare('DELETE FROM products WHERE id=?')->execute([(int)($_POST['id']??0)]);
        $msg = 'Product deleted.';
    }
}

$action  = $_GET['action'] ?? 'list';
$edit_id = (int) ($_GET['id'] ?? 0);
$editing = null;
if ($action === 'add' || $action === 'edit') {
    if ($edit_id) $editing = $db->prepare('SELECT * FROM products WHERE id=?') and $editing->execute([$edit_id]) and $editing = $editing->fetch();
}
$products = $db->query('SELECT * FROM products ORDER BY sort_order ASC, id DESC')->fetchAll();
$cats = ['Standard','Large Car','EFB','Heavy Duty','European'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Products — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
  <?php include 'partials/sidebar.php'; ?>
  <main class="main">
    <?php include 'partials/topbar.php'; ?>
    <div class="page-content">

      <?php if ($msg): ?>
      <div style="background:rgba(15,122,61,.15);border:1px solid rgba(15,122,61,.3);color:#33d930;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:13px"><?= htmlspecialchars($msg) ?></div>
      <?php endif; ?>

      <?php if ($action === 'list'): ?>
      <div class="page-header">
        <div><h1>Products</h1><p class="page-sub"><?= count($products) ?> batteries in catalogue</p></div>
        <a href="?action=add" class="btn-sm primary">+ Add Battery</a>
      </div>
      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Ah / CCA</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <?php foreach ($products as $p): ?>
              <tr>
                <td>
                  <?php if ($p['image']): ?><img src="<?= htmlspecialchars($p['image']) ?>" class="img-preview" style="width:48px;height:48px;display:inline-block;vertical-align:middle;margin-right:10px" onerror="this.style.display='none'"><?php endif; ?>
                  <strong><?= htmlspecialchars($p['name']) ?></strong>
                </td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.45)"><?= htmlspecialchars($p['sku']) ?></td>
                <td><?= htmlspecialchars($p['category']) ?></td>
                <td style="font-family:'DM Serif Display',serif;font-size:16px"><?= htmlspecialchars($p['price_label']) ?></td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.55)"><?= $p['ah'] ?>Ah · <?= $p['cca'] ?>A</td>
                <td><span class="badge" style="<?= $p['active'] ? 'background:rgba(15,122,61,.15);color:#33d930' : 'background:rgba(255,255,255,.06);color:rgba(255,255,255,.35)' ?>"><?= $p['active'] ? 'Active' : 'Hidden' ?></span></td>
                <td style="display:flex;gap:8px">
                  <a href="?action=edit&id=<?= $p['id'] ?>" class="btn-sm outline">Edit</a>
                  <form method="POST" onsubmit="return confirm('Delete this product?')">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= $p['id'] ?>">
                    <button type="submit" class="btn-sm danger">Delete</button>
                  </form>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

      <?php else: ?>
      <div class="page-header">
        <div><h1><?= $editing ? 'Edit Battery' : 'Add Battery' ?></h1></div>
        <a href="products.php" class="btn-sm outline">← Back</a>
      </div>
      <div class="card">
        <form method="POST" enctype="multipart/form-data">
          <input type="hidden" name="action" value="save">
          <input type="hidden" name="id" value="<?= $editing['id'] ?? 0 ?>">
          <input type="hidden" name="existing_image" value="<?= htmlspecialchars($editing['image'] ?? '') ?>">

          <div class="form-grid">
            <div class="form-group full">
              <label>Battery Name *</label>
              <input type="text" name="name" value="<?= htmlspecialchars($editing['name'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label>SKU / Model Code</label>
              <input type="text" name="sku" value="<?= htmlspecialchars($editing['sku'] ?? '') ?>">
            </div>
            <div class="form-group">
              <label>Category</label>
              <select name="category">
                <?php foreach ($cats as $c): ?>
                <option value="<?= $c ?>" <?= ($editing['category'] ?? '') === $c ? 'selected' : '' ?>><?= $c ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="form-group">
              <label>Price Label (e.g. KES 17,500)</label>
              <input type="text" name="price_label" value="<?= htmlspecialchars($editing['price_label'] ?? '') ?>">
            </div>
            <div class="form-group">
              <label>Price (numeric, for sorting)</label>
              <input type="number" name="price_from" value="<?= $editing['price_from'] ?? 0 ?>">
            </div>
            <div class="form-group">
              <label>Sale Price (0 = no sale)</label>
              <input type="number" name="sale_price" value="<?= $editing['sale_price'] ?? 0 ?>">
            </div>
            <div class="form-group">
              <label>Ah (Amp-hours)</label>
              <input type="number" name="ah" value="<?= $editing['ah'] ?? 0 ?>">
            </div>
            <div class="form-group">
              <label>CCA (Cold Cranking Amps)</label>
              <input type="number" name="cca" value="<?= $editing['cca'] ?? 0 ?>">
            </div>
            <div class="form-group">
              <label>Badge (e.g. Best seller)</label>
              <input type="text" name="badge" value="<?= htmlspecialchars($editing['badge'] ?? '') ?>" placeholder="Best seller | New arrival | EFB | leave blank">
            </div>
            <div class="form-group">
              <label>Sort Order (lower = first)</label>
              <input type="number" name="sort_order" value="<?= $editing['sort_order'] ?? 0 ?>">
            </div>
            <div class="form-group full">
              <label>Short Description (1 line)</label>
              <input type="text" name="short_desc" value="<?= htmlspecialchars($editing['short_desc'] ?? '') ?>">
            </div>
            <div class="form-group full">
              <label>Full Description</label>
              <textarea name="description" rows="5"><?= htmlspecialchars($editing['description'] ?? '') ?></textarea>
            </div>
            <div class="form-group full">
              <label>WhatsApp Message (pre-filled when customer orders)</label>
              <input type="text" name="whatsapp_message" value="<?= htmlspecialchars($editing['whatsapp_message'] ?? '') ?>">
            </div>
            <div class="form-group">
              <label>Product Image (JPG/PNG/WebP, max 8MB)</label>
              <input type="file" name="image" accept="image/*">
              <?php if (!empty($editing['image'])): ?>
              <img src="<?= htmlspecialchars($editing['image']) ?>" class="img-preview" style="margin-top:8px" onerror="this.style.display='none'">
              <?php endif; ?>
            </div>
            <div class="form-group" style="justify-content:flex-end;align-items:center;padding-top:20px">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" name="active" <?= ($editing['active'] ?? 1) ? 'checked' : '' ?> style="width:16px;height:16px">
                Active (visible on website)
              </label>
            </div>
          </div>
          <div class="form-actions">
            <a href="products.php" class="btn-sm outline">Cancel</a>
            <button type="submit" class="btn-sm primary">Save Battery</button>
          </div>
        </form>
      </div>
      <?php endif; ?>

    </div>
  </main>
</body>
</html>
