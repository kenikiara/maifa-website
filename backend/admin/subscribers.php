<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db  = db();
$msg = '';

// Handle delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    $db->prepare('DELETE FROM subscribers WHERE id=?')->execute([(int)($_POST['id'] ?? 0)]);
    $msg = 'Subscriber removed.';
}

// CSV export
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="maifa-subscribers-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['ID', 'Email', 'Source', 'Subscribed At']);
    $rows = $db->query('SELECT id, email, source, created_at FROM subscribers ORDER BY created_at DESC')->fetchAll();
    foreach ($rows as $r) {
        fputcsv($out, [$r['id'], $r['email'], $r['source'] ?? 'newsletter', $r['created_at']]);
    }
    fclose($out);
    exit;
}

try {
    $total      = (int) $db->query('SELECT COUNT(*) FROM subscribers')->fetchColumn();
    $this_month = (int) $db->query("SELECT COUNT(*) FROM subscribers WHERE created_at >= DATE_FORMAT(NOW(),'%Y-%m-01')")->fetchColumn();
} catch (\Exception $e) {
    // Table not yet migrated — show empty state
    $total = 0; $this_month = 0;
}

$page    = max(1, (int) ($_GET['page'] ?? 1));
$per_pg  = 50;
$offset  = ($page - 1) * $per_pg;
try {
    $stmt = $db->prepare("SELECT * FROM subscribers ORDER BY created_at DESC LIMIT $per_pg OFFSET $offset");
    $stmt->execute();
    $subscribers = $stmt->fetchAll();
} catch (\Exception $e) {
    $subscribers = [];
}
$total_pages = $total > 0 ? (int) ceil($total / $per_pg) : 1;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Subscribers — Maifa Admin</title>
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

      <div class="page-header">
        <div>
          <h1>Subscribers</h1>
          <p class="page-sub"><?= $total ?> total · <?= $this_month ?> this month</p>
        </div>
        <a href="?export=csv" class="btn-sm outline" style="display:flex;align-items:center;gap:6px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </a>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;max-width:400px">
        <div class="card" style="padding:16px 20px">
          <div style="font-size:32px;font-family:'DM Serif Display',serif;color:rgba(255,255,255,.9)"><?= $total ?></div>
          <div style="font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;margin-top:4px">Total Subscribers</div>
        </div>
        <div class="card" style="padding:16px 20px">
          <div style="font-size:32px;font-family:'DM Serif Display',serif;color:#33d930"><?= $this_month ?></div>
          <div style="font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;margin-top:4px">This Month</div>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Source</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php if (empty($subscribers)): ?>
              <tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,.3);padding:40px">No subscribers yet.</td></tr>
              <?php endif; ?>
              <?php foreach ($subscribers as $s): ?>
              <tr>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.3)"><?= $s['id'] ?></td>
                <td>
                  <a href="mailto:<?= htmlspecialchars($s['email']) ?>" style="color:#33d930;font-size:14px">
                    <?= htmlspecialchars($s['email']) ?>
                  </a>
                </td>
                <td>
                  <span style="font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:capitalize;color:rgba(255,255,255,.45)">
                    <?= htmlspecialchars($s['source'] ?? 'newsletter') ?>
                  </span>
                </td>
                <td style="font-size:12px;color:rgba(255,255,255,.35)"><?= date('d M Y, g:i A', strtotime($s['created_at'])) ?></td>
                <td>
                  <form method="POST" onsubmit="return confirm('Remove this subscriber?')">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= $s['id'] ?>">
                    <button type="submit" class="btn-sm danger">Remove</button>
                  </form>
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
          Page <?= $page ?> of <?= $total_pages ?> · <?= $total ?> subscribers
        </span>
        <div style="display:flex;gap:8px">
          <?php if ($page > 1): ?>
          <a href="?page=<?= $page - 1 ?>" class="btn-sm outline">← Prev</a>
          <?php endif; ?>
          <?php if ($page < $total_pages): ?>
          <a href="?page=<?= $page + 1 ?>" class="btn-sm outline">Next →</a>
          <?php endif; ?>
        </div>
      </div>
      <?php endif; ?>

    </div>
  </main>
</body>
</html>
