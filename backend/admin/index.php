<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db = db();
$total_products = $db->query('SELECT COUNT(*) FROM products WHERE active = 1')->fetchColumn();
$total_warranty = $db->query('SELECT COUNT(*) FROM warranty_registrations')->fetchColumn();
$unread_msgs    = $db->query('SELECT COUNT(*) FROM contact_messages WHERE read_status = 0')->fetchColumn();
$active_war     = $db->query("SELECT COUNT(*) FROM warranty_registrations WHERE status = 'active'")->fetchColumn();
$recent_msgs    = $db->query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5')->fetchAll();
$recent_war     = $db->query('SELECT * FROM warranty_registrations ORDER BY created_at DESC LIMIT 5')->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Dashboard — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
  <?php include 'partials/sidebar.php'; ?>
  <main class="main">
    <?php include 'partials/topbar.php'; ?>
    <div class="page-content">

      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="page-sub">Welcome back — here's what's happening today.</p>
        </div>
        <a href="products.php?action=add" class="btn-sm primary">+ Add Battery</a>
      </div>

      <div class="stat-grid">
        <a href="products.php" class="stat-card" style="text-decoration:none">
          <div class="stat-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
          </div>
          <div class="stat-bottom">
            <div class="stat-value"><?= $total_products ?></div>
            <div class="stat-label">Active Batteries</div>
          </div>
        </a>

        <a href="warranty.php" class="stat-card" style="text-decoration:none">
          <div class="stat-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><path d="M12 2L3 7v6c0 5 3.7 9.7 9 11 5.3-1.3 9-6 9-11V7z"/></svg>
          </div>
          <div class="stat-bottom">
            <div class="stat-value"><?= $total_warranty ?></div>
            <div class="stat-label">Warranties Registered</div>
          </div>
        </a>

        <a href="warranty.php" class="stat-card" style="text-decoration:none">
          <div class="stat-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-bottom">
            <div class="stat-value"><?= $active_war ?></div>
            <div class="stat-label">Active Warranties</div>
          </div>
        </a>

        <a href="messages.php" class="stat-card <?= $unread_msgs > 0 ? 'alert-amber' : '' ?>" style="text-decoration:none">
          <div class="stat-icon-box <?= $unread_msgs > 0 ? 'amber' : '' ?>">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="stat-bottom">
            <div class="stat-value"><?= $unread_msgs ?></div>
            <div class="stat-label">Unread Messages</div>
          </div>
        </a>
      </div>

      <div class="card">
        <div class="card-header"><h2>Quick Actions</h2></div>
        <div style="padding:16px 20px">
          <div class="quick-links">
            <a href="products.php?action=add" class="quick-btn primary">+ Add Battery</a>
            <a href="products.php" class="quick-btn">All Products</a>
            <a href="warranty.php" class="quick-btn">Warranty Registrations</a>
            <a href="messages.php" class="quick-btn">Messages</a>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="card">
          <div class="card-header"><h2>Recent Messages</h2><a href="messages.php" class="btn-sm outline">View all</a></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Subject</th><th>Date</th></tr></thead>
              <tbody>
                <?php if (empty($recent_msgs)): ?>
                <tr><td colspan="3" class="empty">No messages yet.</td></tr>
                <?php else: foreach ($recent_msgs as $m): ?>
                <tr>
                  <td><strong style="color:<?= !$m['read_status'] ? '#fff' : 'rgba(255,255,255,.45)' ?>"><?= htmlspecialchars($m['name']) ?></strong></td>
                  <td style="color:rgba(255,255,255,.5)"><?= htmlspecialchars($m['subject']) ?></td>
                  <td style="color:rgba(255,255,255,.3);white-space:nowrap;font-family:'JetBrains Mono',monospace;font-size:11px"><?= date('d M', strtotime($m['created_at'])) ?></td>
                </tr>
                <?php endforeach; endif; ?>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2>Recent Warranties</h2><a href="warranty.php" class="btn-sm outline">View all</a></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Owner</th><th>Battery</th><th>Status</th></tr></thead>
              <tbody>
                <?php if (empty($recent_war)): ?>
                <tr><td colspan="3" class="empty">No registrations yet.</td></tr>
                <?php else: foreach ($recent_war as $w): ?>
                <tr>
                  <td><strong><?= htmlspecialchars($w['full_name']) ?></strong><br><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,.3)"><?= $w['warranty_code'] ?></span></td>
                  <td style="color:rgba(255,255,255,.5);font-size:12px"><?= htmlspecialchars($w['battery_model']) ?></td>
                  <td><span class="badge badge-<?= $w['status'] ?>"><?= ucfirst($w['status']) ?></span></td>
                </tr>
                <?php endforeach; endif; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </main>
</body>
</html>
