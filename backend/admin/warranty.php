<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db = db();
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id     = (int) ($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? 'active';
    $notes  = clean($_POST['notes'] ?? '');
    $db->prepare('UPDATE warranty_registrations SET status=?, notes=? WHERE id=?')->execute([$status, $notes, $id]);
    $msg = 'Warranty updated.';
}

$filter = $_GET['status'] ?? '';
$where  = $filter ? 'WHERE status=?' : '';
$stmt   = $db->prepare("SELECT * FROM warranty_registrations $where ORDER BY created_at DESC");
$stmt->execute($filter ? [$filter] : []);
$registrations = $stmt->fetchAll();
$statuses = ['active','claimed','expired','voided'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Warranty — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
  <?php include 'partials/sidebar.php'; ?>
  <main class="main">
    <?php include 'partials/topbar.php'; ?>
    <div class="page-content">

      <?php if ($msg): ?>
      <div style="background:rgba(15,122,61,.15);border:1px solid rgba(15,122,61,.3);color:#33d930;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:13px"><?= $msg ?></div>
      <?php endif; ?>

      <div class="page-header">
        <div><h1>Warranty Registrations</h1><p class="page-sub"><?= count($registrations) ?> registrations</p></div>
        <div style="display:flex;gap:8px">
          <a href="warranty.php" class="btn-sm outline <?= !$filter ? 'primary' : '' ?>">All</a>
          <?php foreach ($statuses as $s): ?>
          <a href="?status=<?= $s ?>" class="btn-sm outline <?= $filter === $s ? 'primary' : '' ?>"><?= ucfirst($s) ?></a>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Code</th><th>Owner</th><th>Battery</th><th>Vehicle</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <?php if (empty($registrations)): ?>
              <tr><td colspan="7" class="empty">No registrations found.</td></tr>
              <?php else: foreach ($registrations as $r): ?>
              <tr>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#33d930"><?= htmlspecialchars($r['warranty_code']) ?></td>
                <td>
                  <strong><?= htmlspecialchars($r['full_name']) ?></strong><br>
                  <span style="font-size:12px;color:rgba(255,255,255,.4)"><?= htmlspecialchars($r['phone']) ?></span>
                </td>
                <td style="font-size:12px;color:rgba(255,255,255,.6);max-width:200px"><?= htmlspecialchars($r['battery_model']) ?></td>
                <td style="font-size:12px;color:rgba(255,255,255,.6)"><?= htmlspecialchars($r['vehicle_make'].' '.$r['vehicle_model'].' '.$r['vehicle_year']) ?><br><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,.35)"><?= htmlspecialchars($r['number_plate']) ?></span></td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.4);white-space:nowrap"><?= date('d M Y', strtotime($r['created_at'])) ?></td>
                <td><span class="badge badge-<?= $r['status'] ?>"><?= ucfirst($r['status']) ?></span></td>
                <td>
                  <button class="btn-sm outline" onclick="openEdit(<?= htmlspecialchars(json_encode($r)) ?>)">Edit</button>
                </td>
              </tr>
              <?php endforeach; endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <!-- Edit modal -->
  <div id="modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;align-items:center;justify-content:center">
    <div style="background:#111;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:480px;max-width:96vw;padding:28px">
      <h2 style="font-family:'DM Serif Display',serif;font-weight:400;margin-bottom:20px;font-size:22px;color:#fff">Update Warranty</h2>
      <form method="POST">
        <input type="hidden" name="id" id="edit_id">
        <div class="form-group" style="margin-bottom:16px">
          <label>Status</label>
          <select name="status" id="edit_status">
            <?php foreach ($statuses as $s): ?><option value="<?= $s ?>"><?= ucfirst($s) ?></option><?php endforeach; ?>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:20px">
          <label>Internal Notes</label>
          <textarea name="notes" id="edit_notes" rows="3"></textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button type="button" class="btn-sm outline" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn-sm primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
  <script>
    function openEdit(r) {
      document.getElementById('edit_id').value = r.id;
      document.getElementById('edit_status').value = r.status;
      document.getElementById('edit_notes').value = r.notes || '';
      document.getElementById('modal').style.display = 'flex';
    }
    function closeModal() { document.getElementById('modal').style.display = 'none'; }
  </script>
</body>
</html>
