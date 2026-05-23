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
  <style>
    /* ── Detail drawer ── */
    .detail-backdrop {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,.6); z-index: 300;
      backdrop-filter: blur(3px);
    }
    .detail-backdrop.open { display: block; }

    .detail-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: min(600px, 100vw);
      background: #111;
      border-left: 1px solid rgba(255,255,255,.1);
      z-index: 301;
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform .32s cubic-bezier(0.25,1,0.5,1);
      overflow: hidden;
    }
    .detail-drawer.open { transform: translateX(0); }

    .drawer-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      flex-shrink: 0;
    }
    .drawer-head h2 {
      font-family: 'DM Serif Display', serif;
      font-weight: 400; font-size: 20px; color: #fff; margin: 0;
    }
    .drawer-close {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,.15);
      background: transparent; color: rgba(255,255,255,.6);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: background .15s;
    }
    .drawer-close:hover { background: rgba(255,255,255,.08); color: #fff; }

    .drawer-body {
      flex: 1; overflow-y: auto; padding: 24px;
      display: flex; flex-direction: column; gap: 24px;
    }
    .drawer-body::-webkit-scrollbar { width: 4px; }
    .drawer-body::-webkit-scrollbar-track { background: transparent; }
    .drawer-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

    /* Code badge at top */
    .code-hero {
      background: rgba(51,217,48,.07);
      border: 1px solid rgba(51,217,48,.2);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
    }
    .code-hero .wcode {
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px; color: #33d930; letter-spacing: 2px;
    }

    /* Section blocks */
    .detail-section {
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 12px;
      overflow: hidden;
    }
    .detail-section-head {
      padding: 12px 18px;
      background: rgba(255,255,255,.04);
      border-bottom: 1px solid rgba(255,255,255,.07);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
      color: rgba(255,255,255,.4);
    }
    .detail-rows { display: flex; flex-direction: column; }
    .detail-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 11px 18px; gap: 16px;
      border-bottom: 1px solid rgba(255,255,255,.05);
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .dk {
      font-size: 12px; color: rgba(255,255,255,.4);
      font-family: 'JetBrains Mono', monospace; letter-spacing: .04em;
      white-space: nowrap; flex-shrink: 0;
    }
    .detail-row .dv {
      font-size: 13px; color: #fff; text-align: right;
      word-break: break-word;
    }
    .detail-row .dv.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
    .detail-row .dv.green { color: #33d930; }
    .detail-row .dv.muted { color: rgba(255,255,255,.4); }

    .drawer-foot {
      padding: 16px 24px;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex; gap: 10px; justify-content: flex-end;
      flex-shrink: 0;
    }
  </style>
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
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a href="warranty.php" class="btn-sm outline <?= !$filter ? 'primary' : '' ?>">All</a>
          <?php foreach ($statuses as $s): ?>
          <a href="?status=<?= $s ?>" class="btn-sm outline <?= $filter === $s ? 'primary' : '' ?>"><?= ucfirst($s) ?></a>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Code</th><th>Owner</th><th>Battery</th><th>Vehicle</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
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
                <td style="font-size:12px;color:rgba(255,255,255,.6);max-width:180px"><?= htmlspecialchars($r['battery_model']) ?></td>
                <td style="font-size:12px;color:rgba(255,255,255,.6)">
                  <?= htmlspecialchars($r['vehicle_make'].' '.$r['vehicle_model'].' '.$r['vehicle_year']) ?><br>
                  <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,.35)"><?= htmlspecialchars($r['number_plate']) ?></span>
                </td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.4);white-space:nowrap"><?= date('d M Y', strtotime($r['created_at'])) ?></td>
                <td><span class="badge badge-<?= $r['status'] ?>"><?= ucfirst($r['status']) ?></span></td>
                <td style="display:flex;gap:6px;flex-wrap:wrap">
                  <button class="btn-sm primary" onclick="openDetail(<?= htmlspecialchars(json_encode($r)) ?>)">View</button>
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

  <!-- ── Detail drawer ── -->
  <div class="detail-backdrop" id="detailBackdrop" onclick="closeDetail()"></div>
  <div class="detail-drawer" id="detailDrawer">
    <div class="drawer-head">
      <h2>Warranty Details</h2>
      <button class="drawer-close" onclick="closeDetail()">×</button>
    </div>
    <div class="drawer-body" id="drawerBody"><!-- filled by JS --></div>
    <div class="drawer-foot">
      <button class="btn-sm outline" onclick="closeDetail()">Close</button>
      <button class="btn-sm primary" id="drawerEditBtn">Edit Status</button>
    </div>
  </div>

  <!-- ── Edit modal ── -->
  <div id="modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:400;align-items:center;justify-content:center">
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
    const STATUS_COLORS = { active:'#33d930', claimed:'#60a5fa', expired:'rgba(255,255,255,.35)', voided:'#f87171' };

    function yesNo(v) { return v == 1 ? '✓ Yes' : '✗ No'; }
    function fmtDate(d) { if (!d) return '—'; const dt = new Date(d); return dt.toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}); }

    function openDetail(r) {
      const color = STATUS_COLORS[r.status] || '#fff';
      document.getElementById('drawerBody').innerHTML = `
        <div class="code-hero">
          <div>
            <div style="font-size:10px;font-family:'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px">Warranty Code</div>
            <div class="wcode">${r.warranty_code}</div>
          </div>
          <span class="badge badge-${r.status}" style="font-size:13px;padding:6px 14px">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
        </div>

        <div class="detail-section">
          <div class="detail-section-head">Owner</div>
          <div class="detail-rows">
            <div class="detail-row"><span class="dk">Full name</span><span class="dv">${r.full_name || '—'}</span></div>
            <div class="detail-row"><span class="dk">National ID</span><span class="dv mono">${r.national_id || '—'}</span></div>
            <div class="detail-row"><span class="dk">Phone</span><span class="dv mono">${r.phone || '—'}</span></div>
            <div class="detail-row"><span class="dk">Email</span><span class="dv">${r.email || '—'}</span></div>
            <div class="detail-row"><span class="dk">Location</span><span class="dv">${[r.area, r.city].filter(Boolean).join(', ') || '—'}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-head">Battery</div>
          <div class="detail-rows">
            <div class="detail-row"><span class="dk">Model</span><span class="dv">${r.battery_model || '—'}</span></div>
            <div class="detail-row"><span class="dk">Serial no.</span><span class="dv mono green">${r.serial_number || '—'}</span></div>
            <div class="detail-row"><span class="dk">Purchase date</span><span class="dv">${fmtDate(r.purchase_date)}</span></div>
            <div class="detail-row"><span class="dk">Purchased at</span><span class="dv">${r.purchased_at || '—'}</span></div>
            <div class="detail-row"><span class="dk">Invoice no.</span><span class="dv mono">${r.invoice_number || '—'}</span></div>
            <div class="detail-row"><span class="dk">Fitted by Maifa</span><span class="dv">${yesNo(r.fitted_by_maifa)}</span></div>
            <div class="detail-row"><span class="dk">Trade-in</span><span class="dv">${yesNo(r.trade_in)}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-head">Vehicle</div>
          <div class="detail-rows">
            <div class="detail-row"><span class="dk">Make / Model</span><span class="dv">${r.vehicle_make} ${r.vehicle_model} ${r.vehicle_year}</span></div>
            <div class="detail-row"><span class="dk">Number plate</span><span class="dv mono">${r.number_plate || '—'}</span></div>
            <div class="detail-row"><span class="dk">Mileage</span><span class="dv">${r.mileage ? Number(r.mileage).toLocaleString() + ' km' : '—'}</span></div>
            <div class="detail-row"><span class="dk">Primary use</span><span class="dv">${r.primary_use ? r.primary_use.charAt(0).toUpperCase()+r.primary_use.slice(1) : '—'}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-head">Registration</div>
          <div class="detail-rows">
            <div class="detail-row"><span class="dk">Registered on</span><span class="dv">${fmtDate(r.created_at)}</span></div>
            <div class="detail-row"><span class="dk">Expires</span><span class="dv">${fmtDate(new Date(new Date(r.purchase_date||r.created_at).setFullYear(new Date(r.purchase_date||r.created_at).getFullYear()+1)).toISOString().split('T')[0])}</span></div>
            <div class="detail-row"><span class="dk">Status</span><span class="dv" style="color:${color}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></div>
            <div class="detail-row"><span class="dk">Notes</span><span class="dv muted">${r.notes || 'None'}</span></div>
          </div>
        </div>

        ${r.receipt_file ? `
        <div class="detail-section">
          <div class="detail-section-head">Receipt / Invoice</div>
          <div style="padding:16px 18px">
            ${/\.(jpg|jpeg|png)$/i.test(r.receipt_file)
              ? `<a href="${r.receipt_file}" target="_blank" rel="noopener">
                   <img src="${r.receipt_file}" alt="Receipt" style="max-width:100%;border-radius:8px;border:1px solid rgba(255,255,255,.1);display:block">
                 </a>
                 <a href="${r.receipt_file}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:#60a5fa;font-family:'JetBrains Mono',monospace">
                   ↗ Open full image
                 </a>`
              : `<a href="${r.receipt_file}" target="_blank" rel="noopener"
                   style="display:inline-flex;align-items:center;gap:8px;padding:12px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:13px;text-decoration:none">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                   View PDF receipt
                 </a>`
            }
          </div>
        </div>` : `
        <div class="detail-section">
          <div class="detail-section-head">Receipt / Invoice</div>
          <div style="padding:16px 18px;font-size:13px;color:rgba(255,255,255,.3);font-family:'JetBrains Mono',monospace">No receipt uploaded.</div>
        </div>`}
      `;
      document.getElementById('drawerEditBtn').onclick = () => { closeDetail(); openEdit(r); };
      document.getElementById('detailBackdrop').classList.add('open');
      document.getElementById('detailDrawer').classList.add('open');
    }

    function closeDetail() {
      document.getElementById('detailBackdrop').classList.remove('open');
      document.getElementById('detailDrawer').classList.remove('open');
    }

    function openEdit(r) {
      document.getElementById('edit_id').value = r.id;
      document.getElementById('edit_status').value = r.status;
      document.getElementById('edit_notes').value = r.notes || '';
      document.getElementById('modal').style.display = 'flex';
    }
    function closeModal() { document.getElementById('modal').style.display = 'none'; }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDetail(); closeModal(); } });
  </script>
</body>
</html>
