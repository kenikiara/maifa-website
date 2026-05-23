<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db = db();
$msg_notice = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $id     = (int) ($_POST['id'] ?? 0);
    if ($action === 'read')   { $db->prepare('UPDATE contact_messages SET read_status=1 WHERE id=?')->execute([$id]); }
    if ($action === 'delete') { $db->prepare('DELETE FROM contact_messages WHERE id=?')->execute([$id]); $msg_notice = 'Message deleted.'; }
}

$messages = $db->query('SELECT * FROM contact_messages ORDER BY created_at DESC')->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Messages — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
  <?php include 'partials/sidebar.php'; ?>
  <main class="main">
    <?php include 'partials/topbar.php'; ?>
    <div class="page-content">

      <?php if ($msg_notice): ?>
      <div style="background:rgba(15,122,61,.15);border:1px solid rgba(15,122,61,.3);color:#33d930;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:13px"><?= $msg_notice ?></div>
      <?php endif; ?>

      <div class="page-header">
        <div><h1>Messages</h1><p class="page-sub"><?= count($messages) ?> total messages</p></div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Contact</th><th>Subject</th><th>Message</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <?php if (empty($messages)): ?>
              <tr><td colspan="6" class="empty">No messages yet.</td></tr>
              <?php else: foreach ($messages as $m): ?>
              <tr style="<?= !$m['read_status'] ? 'background:rgba(255,255,255,.02)' : '' ?>">
                <td>
                  <strong style="color:<?= !$m['read_status'] ? '#fff' : 'rgba(255,255,255,.45)' ?>"><?= htmlspecialchars($m['name']) ?></strong>
                  <?php if (!$m['read_status']): ?><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#0f7a3d;margin-left:6px;vertical-align:middle"></span><?php endif; ?>
                </td>
                <td style="font-size:12px;color:rgba(255,255,255,.5)">
                  <?= htmlspecialchars($m['email']) ?><br>
                  <span style="font-family:'JetBrains Mono',monospace;font-size:11px"><?= htmlspecialchars($m['phone'] ?? '') ?></span>
                </td>
                <td style="color:rgba(255,255,255,.6)"><?= htmlspecialchars($m['subject']) ?></td>
                <td style="color:rgba(255,255,255,.5);font-size:12px;max-width:280px"><?= htmlspecialchars(mb_substr($m['message'], 0, 100)) ?>...</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.35);white-space:nowrap"><?= date('d M Y', strtotime($m['created_at'])) ?></td>
                <td style="display:flex;gap:6px">
                  <?php if (!$m['read_status']): ?>
                  <form method="POST"><input type="hidden" name="action" value="read"><input type="hidden" name="id" value="<?= $m['id'] ?>"><button class="btn-sm outline">✓ Read</button></form>
                  <?php endif; ?>
                  <?php if ($m['email']): ?>
                  <a href="mailto:<?= htmlspecialchars($m['email']) ?>?subject=Re: <?= urlencode($m['subject']) ?>" class="btn-sm outline">Reply</a>
                  <?php endif; ?>
                  <form method="POST" onsubmit="return confirm('Delete this message?')">
                    <input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= $m['id'] ?>">
                    <button class="btn-sm danger">Delete</button>
                  </form>
                </td>
              </tr>
              <?php endforeach; endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
