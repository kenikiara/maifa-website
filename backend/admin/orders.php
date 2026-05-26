<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db  = db();
$msg = '';

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'status') {
        $allowed = ['pending','confirmed','delivered','cancelled'];
        $status  = $_POST['status'] ?? '';
        if (in_array($status, $allowed)) {
            $db->prepare('UPDATE orders SET status=? WHERE id=?')
               ->execute([$status, (int)($_POST['id'] ?? 0)]);
            $msg = 'Order status updated.';
        }
    } elseif ($action === 'delete') {
        $db->prepare('DELETE FROM orders WHERE id=?')->execute([(int)($_POST['id'] ?? 0)]);
        $msg = 'Order deleted.';
    }
}

$allowed_statuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
$filter  = in_array($_GET['status'] ?? '', $allowed_statuses) ? $_GET['status'] : '';
$view_id = (int) ($_GET['view'] ?? 0);
$page    = max(1, (int) ($_GET['page'] ?? 1));
$per_pg  = 50;
$offset  = ($page - 1) * $per_pg;

// Single order view
$order = null;
if ($view_id) {
    $s = $db->prepare('SELECT * FROM orders WHERE id=?');
    $s->execute([$view_id]);
    $order = $s->fetch();
}

// Stats
$total     = (int) $db->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$pending   = (int) $db->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
$confirmed = (int) $db->query("SELECT COUNT(*) FROM orders WHERE status='confirmed'")->fetchColumn();
$delivered = (int) $db->query("SELECT COUNT(*) FROM orders WHERE status='delivered'")->fetchColumn();

// Orders list — prepared statement, paginated
if ($filter) {
    $cnt_s = $db->prepare("SELECT COUNT(*) FROM orders WHERE status = ?");
    $cnt_s->execute([$filter]);
    $page_total = (int) $cnt_s->fetchColumn();
    $stmt = $db->prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT $per_pg OFFSET $offset");
    $stmt->execute([$filter]);
} else {
    $page_total = $total;
    $stmt = $db->prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT $per_pg OFFSET $offset");
    $stmt->execute();
}
$orders      = $stmt->fetchAll();
$total_pages = (int) ceil($page_total / $per_pg);

$statusColors = [
    'pending'   => 'background:rgba(246,180,4,.15);color:#f6b404',
    'confirmed' => 'background:rgba(15,122,61,.15);color:#33d930',
    'delivered' => 'background:rgba(99,102,241,.15);color:#818cf8',
    'cancelled' => 'background:rgba(255,255,255,.06);color:rgba(255,255,255,.35)',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Orders — Maifa Admin</title>
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

      <?php if ($order): ?>
      <!-- ── Single Order View ── -->
      <div class="page-header">
        <div>
          <h1>Order #<?= $order['id'] ?></h1>
          <p class="page-sub"><?= date('d M Y, g:i A', strtotime($order['created_at'])) ?></p>
        </div>
        <a href="orders.php" class="btn-sm outline">← All Orders</a>
      </div>

      <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start">
        <div>
          <div class="card" style="margin-bottom:20px">
            <h3 style="margin-bottom:16px;font-size:14px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Battery Ordered</h3>
            <p style="font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:8px"><?= htmlspecialchars($order['product_name']) ?></p>
            <p style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px">SKU: <?= htmlspecialchars($order['product_sku']) ?></p>
            <p style="font-size:20px;font-family:'DM Serif Display',serif;color:#33d930;margin-bottom:12px"><?= htmlspecialchars($order['product_price']) ?></p>
            <a href="<?= htmlspecialchars($order['product_url']) ?>" target="_blank" style="font-size:12px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace"><?= htmlspecialchars($order['product_url']) ?></a>
          </div>

          <div class="card">
            <h3 style="margin-bottom:16px;font-size:14px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Customer Details</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div>
                <p style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;margin-bottom:4px">NAME</p>
                <p style="font-size:16px"><?= htmlspecialchars($order['customer_name']) ?></p>
              </div>
              <div>
                <p style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;margin-bottom:4px">PHONE</p>
                <p style="font-size:16px">
                  <a href="tel:<?= htmlspecialchars($order['customer_phone']) ?>" style="color:#33d930"><?= htmlspecialchars($order['customer_phone']) ?></a>
                  &nbsp;·&nbsp;
                  <a href="https://wa.me/<?= preg_replace('/\D/','',$order['customer_phone']) ?>" target="_blank" style="color:#25d366;font-size:12px">WhatsApp</a>
                </p>
              </div>
              <div>
                <p style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;margin-bottom:4px">AREA / LOCATION</p>
                <p style="font-size:16px"><?= htmlspecialchars($order['customer_area']) ?></p>
              </div>
              <div>
                <p style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;margin-bottom:4px">SOURCE</p>
                <p style="font-size:16px;text-transform:capitalize"><?= htmlspecialchars($order['source']) ?></p>
              </div>
              <?php if ($order['notes']): ?>
              <div style="grid-column:1/-1">
                <p style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;margin-bottom:4px">NOTES</p>
                <p style="font-size:15px;color:rgba(255,255,255,.7)"><?= htmlspecialchars($order['notes']) ?></p>
              </div>
              <?php endif; ?>
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <h3 style="margin-bottom:16px;font-size:14px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em">Update Status</h3>
            <form method="POST">
              <input type="hidden" name="action" value="status">
              <input type="hidden" name="id" value="<?= $order['id'] ?>">
              <select name="status" style="width:100%;margin-bottom:12px">
                <?php foreach (['pending','confirmed','delivered','cancelled'] as $s): ?>
                <option value="<?= $s ?>" <?= $order['status'] === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
                <?php endforeach; ?>
              </select>
              <button type="submit" class="btn-sm primary" style="width:100%">Update Status</button>
            </form>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:16px 0">
            <a href="https://wa.me/<?= preg_replace('/\D/','',$order['customer_phone']) ?>?text=<?= urlencode("Hi {$order['customer_name']}! Your order for {$order['product_name']} ({$order['product_price']}) has been confirmed. We will contact you shortly for delivery to {$order['customer_area']}.") ?>"
               target="_blank" class="btn-sm primary" style="width:100%;display:block;text-align:center;background:#25d366;border-color:#25d366">
              WhatsApp Customer
            </a>
          </div>

          <div class="card" style="margin-top:16px">
            <form method="POST" onsubmit="return confirm('Delete this order?')">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="id" value="<?= $order['id'] ?>">
              <button type="submit" class="btn-sm danger" style="width:100%">Delete Order</button>
            </form>
          </div>
        </div>
      </div>

      <?php else: ?>
      <!-- ── Orders List ── -->
      <div class="page-header">
        <div><h1>Orders</h1><p class="page-sub"><?= $total ?> total · <?= $pending ?> pending</p></div>
      </div>

      <!-- Stats row -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
        <?php foreach ([
          ['label'=>'Total Orders',  'val'=>$total,     'color'=>'rgba(255,255,255,.9)'],
          ['label'=>'Pending',       'val'=>$pending,   'color'=>'#f6b404'],
          ['label'=>'Confirmed',     'val'=>$confirmed, 'color'=>'#33d930'],
          ['label'=>'Delivered',     'val'=>$delivered, 'color'=>'#818cf8'],
        ] as $s): ?>
        <div class="card" style="padding:16px 20px">
          <div style="font-size:28px;font-family:'DM Serif Display',serif;color:<?= $s['color'] ?>"><?= $s['val'] ?></div>
          <div style="font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;margin-top:4px"><?= $s['label'] ?></div>
        </div>
        <?php endforeach; ?>
      </div>

      <!-- Filter tabs -->
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <?php foreach ([''=> 'All', 'pending'=>'Pending', 'confirmed'=>'Confirmed', 'delivered'=>'Delivered', 'cancelled'=>'Cancelled'] as $val => $label): ?>
        <a href="?status=<?= $val ?>" class="btn-sm <?= $filter === $val ? 'primary' : 'outline' ?>"><?= $label ?></a>
        <?php endforeach; ?>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>#</th><th>Battery</th><th>Customer</th><th>Area</th><th>Price</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <?php if (empty($orders)): ?>
              <tr><td colspan="9" style="text-align:center;color:rgba(255,255,255,.3);padding:40px">No orders yet.</td></tr>
              <?php endif; ?>
              <?php foreach ($orders as $o): ?>
              <tr>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.4)">#<?= $o['id'] ?></td>
                <td>
                  <strong style="font-size:13px"><?= htmlspecialchars($o['product_name']) ?></strong>
                  <div style="font-size:11px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace"><?= htmlspecialchars($o['product_sku']) ?></div>
                </td>
                <td>
                  <div><?= htmlspecialchars($o['customer_name']) ?></div>
                  <a href="tel:<?= htmlspecialchars($o['customer_phone']) ?>" style="font-size:12px;color:#33d930"><?= htmlspecialchars($o['customer_phone']) ?></a>
                </td>
                <td style="font-size:13px;color:rgba(255,255,255,.6)"><?= htmlspecialchars($o['customer_area']) ?></td>
                <td style="font-family:'DM Serif Display',serif;font-size:15px"><?= htmlspecialchars($o['product_price']) ?></td>
                <td><span style="font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:capitalize;color:rgba(255,255,255,.45)"><?= $o['source'] ?></span></td>
                <td><span class="badge" style="<?= $statusColors[$o['status']] ?>"><?= ucfirst($o['status']) ?></span></td>
                <td style="font-size:12px;color:rgba(255,255,255,.35)"><?= date('d M, g:i A', strtotime($o['created_at'])) ?></td>
                <td style="display:flex;gap:6px">
                  <a href="?view=<?= $o['id'] ?>" class="btn-sm outline">View</a>
                  <a href="https://wa.me/<?= preg_replace('/\D/','',$o['customer_phone']) ?>" target="_blank" class="btn-sm" style="background:#25d366;border-color:#25d366;color:#fff">WA</a>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

      <?php if ($total_pages > 1): ?>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px">
        <span style="font-size:12px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace">
          Page <?= $page ?> of <?= $total_pages ?> · <?= $page_total ?> orders
        </span>
        <div style="display:flex;gap:8px">
          <?php if ($page > 1): ?>
          <a href="?status=<?= htmlspecialchars($filter) ?>&page=<?= $page - 1 ?>" class="btn-sm outline">← Prev</a>
          <?php endif; ?>
          <?php if ($page < $total_pages): ?>
          <a href="?status=<?= htmlspecialchars($filter) ?>&page=<?= $page + 1 ?>" class="btn-sm outline">Next →</a>
          <?php endif; ?>
        </div>
      </div>
      <?php endif; ?>

      <?php endif; ?>

    </div>
  </main>
</body>
</html>
