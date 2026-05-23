<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
if (empty($_SESSION['admin'])) { header('Location: login.php'); exit; }

$db  = db();
$msg = '';

// Handle POST saves/deletes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'save') {
        $id    = (int) ($_POST['id'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $slug  = make_slug($title, trim($_POST['slug'] ?? ''));

        /* Cover image: uploaded file takes priority over URL field */
        $cover_image = htmlspecialchars(trim($_POST['cover_image'] ?? ''), ENT_QUOTES, 'UTF-8');
        if (!empty($_FILES['cover_image_file']) && $_FILES['cover_image_file']['error'] === UPLOAD_ERR_OK) {
            $ext     = strtolower(pathinfo($_FILES['cover_image_file']['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'webp'];
            if (in_array($ext, $allowed) && $_FILES['cover_image_file']['size'] <= 8 * 1024 * 1024) {
                $uploadDir = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/uploads/blog/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                $filename = 'cover_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                if (move_uploaded_file($_FILES['cover_image_file']['tmp_name'], $uploadDir . $filename)) {
                    $cover_image = '/uploads/blog/' . $filename;
                }
            }
        }

        $fields = [
            'title'       => htmlspecialchars($title, ENT_QUOTES, 'UTF-8'),
            'slug'        => $slug,
            'excerpt'     => htmlspecialchars(trim($_POST['excerpt'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'content'     => $_POST['content'] ?? '',
            'category'    => htmlspecialchars(trim($_POST['category'] ?? 'General'), ENT_QUOTES, 'UTF-8'),
            'tags'        => htmlspecialchars(trim($_POST['tags'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'meta_title'  => htmlspecialchars(trim($_POST['meta_title'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'meta_desc'   => htmlspecialchars(trim($_POST['meta_desc'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'cover_image' => $cover_image,
            'author'      => htmlspecialchars(trim($_POST['author'] ?? 'Maifa Team'), ENT_QUOTES, 'UTF-8'),
            'published'   => isset($_POST['published']) ? 1 : 0,
        ];

        if ($id) {
            $set  = implode(', ', array_map(fn($k) => "$k=:$k", array_keys($fields)));
            $stmt = $db->prepare("UPDATE articles SET $set WHERE id=:id");
            $stmt->execute([...$fields, ':id' => $id]);
            $msg = 'Article updated.';
        } else {
            $cols = implode(', ', array_keys($fields));
            $vals = implode(', ', array_map(fn($k) => ":$k", array_keys($fields)));
            $stmt = $db->prepare("INSERT INTO articles ($cols) VALUES ($vals)");
            $stmt->execute($fields);
            $msg = 'Article created.';
        }
    } elseif ($action === 'delete') {
        $db->prepare('DELETE FROM articles WHERE id=?')->execute([(int)($_POST['id'] ?? 0)]);
        $msg = 'Article deleted.';
    }
}

$view    = $_GET['action'] ?? 'list';
$edit_id = (int) ($_GET['id'] ?? 0);
$editing = null;

if ($view === 'edit' && $edit_id) {
    $s = $db->prepare('SELECT * FROM articles WHERE id=?');
    $s->execute([$edit_id]);
    $editing = $s->fetch();
}

$articles = $db->query('SELECT id, title, slug, category, published, created_at FROM articles ORDER BY created_at DESC')->fetchAll();
$cats     = ['General','Buying Guide','Brand Comparison','Car Tips','Service','EV & Modern Cars'];

function make_slug(string $title, string $override = ''): string {
    if ($override) return preg_replace('/[^a-z0-9-]/', '', strtolower(trim($override)));
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    return trim($slug, '-');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Articles — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
  <?php if ($view !== 'list'): ?>
  <style>
    /* ── Simple editor ── */
    .editor-wrap { border:1px solid rgba(255,255,255,.1); border-radius:8px; overflow:hidden; }
    .editor-toolbar {
      display:flex; flex-wrap:wrap; gap:2px; padding:8px 10px;
      background:rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.08);
    }
    .editor-toolbar button {
      background:none; border:none; color:rgba(255,255,255,.6); cursor:pointer;
      width:30px; height:30px; border-radius:5px; font-size:13px; font-weight:600;
      display:flex; align-items:center; justify-content:center; transition:background .15s, color .15s;
    }
    .editor-toolbar button:hover { background:rgba(255,255,255,.1); color:#fff; }
    .editor-toolbar .sep { width:1px; background:rgba(255,255,255,.1); margin:4px 4px; align-self:stretch; }
    .editor-body {
      min-height:420px; padding:20px; outline:none; color:#e0e0e0;
      font-family:Inter,sans-serif; font-size:15px; line-height:1.75;
      background:#1a1a1a;
    }
    .editor-body h2 { font-family:'DM Serif Display',serif; font-size:22px; margin:24px 0 10px; color:#fff; }
    .editor-body h3 { font-family:'DM Serif Display',serif; font-size:17px; margin:18px 0 8px; color:#ddd; }
    .editor-body a  { color:#33d930; }
    .editor-body table { border-collapse:collapse; width:100%; margin:16px 0; }
    .editor-body td, .editor-body th { border:1px solid #444; padding:8px 12px; }
    .editor-body th { background:rgba(255,255,255,.06); font-weight:600; }
    .editor-body ul, .editor-body ol { padding-left:22px; margin:10px 0; }
    .editor-body blockquote { border-left:3px solid #0f7a3d; margin:16px 0; padding:8px 16px; color:rgba(255,255,255,.6); font-style:italic; }
    /* Cover image upload */
    .cover-upload-area {
      border:2px dashed rgba(255,255,255,.15); border-radius:8px;
      padding:20px; text-align:center; cursor:pointer; transition:border-color .2s;
      position:relative; margin-bottom:12px;
    }
    .cover-upload-area:hover { border-color:rgba(15,122,61,.6); }
    .cover-upload-area input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
    .cover-preview { width:100%; border-radius:6px; display:block; margin-bottom:8px; max-height:120px; object-fit:cover; }
  </style>
  <?php endif; ?>
</head>
<body>
  <?php include 'partials/sidebar.php'; ?>
  <main class="main">
    <?php include 'partials/topbar.php'; ?>
    <div class="page-content">

      <?php if ($msg): ?>
      <div style="background:rgba(15,122,61,.15);border:1px solid rgba(15,122,61,.3);color:#33d930;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:13px"><?= htmlspecialchars($msg) ?></div>
      <?php endif; ?>

      <?php if ($view === 'list'): ?>

      <div class="page-header">
        <div><h1>Articles</h1><p class="page-sub"><?= count($articles) ?> articles · SEO blog</p></div>
        <a href="?action=add" class="btn-sm primary">+ New Article</a>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Title</th><th>Category</th><th>Slug</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <?php foreach ($articles as $a): ?>
              <tr>
                <td><strong><?= htmlspecialchars($a['title']) ?></strong></td>
                <td><?= htmlspecialchars($a['category']) ?></td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,.4)">/blog/<?= htmlspecialchars($a['slug']) ?></td>
                <td><span class="badge" style="<?= $a['published'] ? 'background:rgba(15,122,61,.15);color:#33d930' : 'background:rgba(255,255,255,.06);color:rgba(255,255,255,.35)' ?>"><?= $a['published'] ? 'Published' : 'Draft' ?></span></td>
                <td style="font-size:12px;color:rgba(255,255,255,.4)"><?= date('d M Y', strtotime($a['created_at'])) ?></td>
                <td style="display:flex;gap:8px">
                  <a href="?action=edit&id=<?= $a['id'] ?>" class="btn-sm outline">Edit</a>
                  <a href="/blog/<?= htmlspecialchars($a['slug']) ?>" target="_blank" class="btn-sm outline">View</a>
                  <form method="POST" onsubmit="return confirm('Delete this article?')">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= $a['id'] ?>">
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
        <div><h1><?= $editing ? 'Edit Article' : 'New Article' ?></h1></div>
        <a href="articles.php" class="btn-sm outline">← Back</a>
      </div>

      <form method="POST" id="article-form" enctype="multipart/form-data" onsubmit="syncContent()">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $editing['id'] ?? 0 ?>">
        <textarea name="content" id="content-hidden" style="display:none"></textarea>

        <div style="display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start">

          <!-- Main content -->
          <div>
            <div class="card" style="margin-bottom:20px">
              <div class="form-group full" style="margin-bottom:16px">
                <label>Title *</label>
                <input type="text" name="title" value="<?= htmlspecialchars($editing['title'] ?? '') ?>" required
                  placeholder="e.g. Best Car Battery in Kenya 2025"
                  style="font-size:18px;font-family:'DM Serif Display',serif"
                  oninput="autoSlug(this.value)">
              </div>
              <div class="form-group full" style="margin-bottom:0">
                <label>Excerpt <span style="color:rgba(255,255,255,.3);font-weight:400">(shown in listings — 1–2 sentences)</span></label>
                <textarea name="excerpt" rows="2" placeholder="Short summary for blog listings and Google snippets..."><?= htmlspecialchars($editing['excerpt'] ?? '') ?></textarea>
              </div>
            </div>

            <div class="card">
              <label style="font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);display:block;margin-bottom:10px">Content *</label>
              <div class="editor-wrap">
                <div class="editor-toolbar">
                  <button type="button" onclick="fmt('undo')" title="Undo">↩</button>
                  <button type="button" onclick="fmt('redo')" title="Redo">↪</button>
                  <div class="sep"></div>
                  <button type="button" onclick="fmt('bold')" title="Bold"><b>B</b></button>
                  <button type="button" onclick="fmt('italic')" title="Italic"><i>I</i></button>
                  <button type="button" onclick="fmt('underline')" title="Underline"><u>U</u></button>
                  <div class="sep"></div>
                  <button type="button" onclick="fmtBlock('h2')" title="Heading 2" style="font-size:11px;font-family:'DM Serif Display',serif;width:auto;padding:0 8px">H2</button>
                  <button type="button" onclick="fmtBlock('h3')" title="Heading 3" style="font-size:11px;font-family:'DM Serif Display',serif;width:auto;padding:0 8px">H3</button>
                  <button type="button" onclick="fmtBlock('p')" title="Paragraph" style="font-size:11px;width:auto;padding:0 8px">¶</button>
                  <div class="sep"></div>
                  <button type="button" onclick="fmt('insertUnorderedList')" title="Bullet list">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
                  </button>
                  <button type="button" onclick="fmt('insertOrderedList')" title="Numbered list">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="9" font-size="8" fill="currentColor" stroke="none">1</text><text x="2" y="15" font-size="8" fill="currentColor" stroke="none">2</text><text x="2" y="21" font-size="8" fill="currentColor" stroke="none">3</text></svg>
                  </button>
                  <button type="button" onclick="fmt('formatBlock','blockquote')" title="Blockquote" style="font-size:16px;line-height:1">"</button>
                  <div class="sep"></div>
                  <button type="button" onclick="insertLink()" title="Insert link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </button>
                  <button type="button" onclick="insertTable()" title="Insert table">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                  </button>
                  <button type="button" onclick="fmt('insertHorizontalRule')" title="Horizontal rule" style="font-size:16px">—</button>
                </div>
                <div id="editor"
                  class="editor-body"
                  contenteditable="true"
                  spellcheck="true"><?= $editing['content'] ?? '' ?></div>
              </div>
            </div>
          </div>

          <!-- Sidebar options -->
          <div style="display:flex;flex-direction:column;gap:16px">

            <div class="card">
              <h4 style="font-size:13px;margin-bottom:16px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.06em">Publish</h4>
              <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:16px">
                <input type="checkbox" name="published" <?= ($editing['published'] ?? 1) ? 'checked' : '' ?> style="width:16px;height:16px">
                <span>Published (visible on website)</span>
              </label>
              <div class="form-group" style="margin-bottom:12px">
                <label>Author</label>
                <input type="text" name="author" value="<?= htmlspecialchars($editing['author'] ?? 'Maifa Team') ?>">
              </div>
              <div class="form-actions" style="padding:0;border:none">
                <button type="submit" class="btn-sm primary" style="width:100%">Save Article</button>
              </div>
            </div>

            <div class="card">
              <h4 style="font-size:13px;margin-bottom:16px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.06em">Organisation</h4>
              <div class="form-group" style="margin-bottom:12px">
                <label>Category</label>
                <select name="category">
                  <?php foreach ($cats as $c): ?>
                  <option value="<?= $c ?>" <?= ($editing['category'] ?? 'General') === $c ? 'selected' : '' ?>><?= $c ?></option>
                  <?php endforeach; ?>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label>Tags <span style="color:rgba(255,255,255,.3);font-weight:400">(comma-separated)</span></label>
                <input type="text" name="tags" value="<?= htmlspecialchars($editing['tags'] ?? '') ?>" placeholder="amaron, battery, nairobi">
              </div>
            </div>

            <div class="card">
              <h4 style="font-size:13px;margin-bottom:16px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.06em">SEO</h4>
              <div class="form-group" style="margin-bottom:12px">
                <label>URL Slug</label>
                <input type="text" name="slug" id="slug-field" value="<?= htmlspecialchars($editing['slug'] ?? '') ?>" placeholder="auto-generated from title">
                <small style="color:rgba(255,255,255,.3);font-size:11px">maifa.ke/blog/<span id="slug-preview"><?= htmlspecialchars($editing['slug'] ?? '...') ?></span></small>
              </div>
              <div class="form-group" style="margin-bottom:12px">
                <label>Meta Title <span style="color:rgba(255,255,255,.3);font-weight:400">(≤60 chars)</span></label>
                <input type="text" name="meta_title" value="<?= htmlspecialchars($editing['meta_title'] ?? '') ?>" maxlength="70">
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label>Meta Description <span style="color:rgba(255,255,255,.3);font-weight:400">(≤160 chars)</span></label>
                <textarea name="meta_desc" rows="3" maxlength="170"><?= htmlspecialchars($editing['meta_desc'] ?? '') ?></textarea>
              </div>
            </div>

            <div class="card">
              <h4 style="font-size:13px;margin-bottom:12px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.06em">Cover Image</h4>

              <?php if (!empty($editing['cover_image'])): ?>
              <img src="<?= htmlspecialchars($editing['cover_image']) ?>" alt="Current cover" class="cover-preview" id="cover-preview">
              <?php else: ?>
              <img src="" alt="" class="cover-preview" id="cover-preview" style="display:none">
              <?php endif; ?>

              <div class="cover-upload-area" onclick="document.getElementById('cover-file').click()">
                <input type="file" name="cover_image_file" id="cover-file" accept="image/jpeg,image/png,image/webp" onchange="previewCover(this)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5" style="margin:0 auto 8px;display:block"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p style="font-size:12px;color:rgba(255,255,255,.35);margin:0">Click to upload photo<br><span style="font-size:11px;color:rgba(255,255,255,.2)">JPG, PNG or WebP · max 8 MB</span></p>
              </div>

              <div class="form-group" style="margin-bottom:0">
                <label style="color:rgba(255,255,255,.3);font-size:11px">Or paste an image URL</label>
                <input type="text" name="cover_image" id="cover-url" value="<?= htmlspecialchars($editing['cover_image'] ?? '') ?>" placeholder="https://... or /products/img.jpg" oninput="previewUrl(this.value)">
              </div>
            </div>

          </div>
        </div>
      </form>

      <?php endif; ?>

    </div>
  </main>

<script>
/* ── Slug helpers ── */
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');
}
let slugEdited = <?= $editing && !empty($editing['slug']) ? 'true' : 'false' ?>;
const slugField   = document.getElementById('slug-field');
const slugPreview = document.getElementById('slug-preview');
if (slugField) {
  slugField.addEventListener('input', () => { slugEdited = true; slugPreview.textContent = slugField.value || '...'; });
}
function autoSlug(title) {
  if (slugEdited) return;
  const s = slugify(title);
  if (slugField) { slugField.value = s; slugPreview.textContent = s || '...'; }
}

/* ── Editor helpers ── */
function fmt(cmd, val) { document.execCommand(cmd, false, val || null); }
function fmtBlock(tag) { document.execCommand('formatBlock', false, tag); }

function insertLink() {
  const sel = window.getSelection();
  const text = sel && sel.toString() ? sel.toString() : prompt('Link text:');
  if (!text) return;
  const url = prompt('URL:', 'https://');
  if (!url) return;
  document.execCommand('insertHTML', false, `<a href="${url}">${text}</a>`);
}

function insertTable() {
  const rows = parseInt(prompt('Rows:', '3'), 10) || 3;
  const cols = parseInt(prompt('Columns:', '3'), 10) || 3;
  let html = '<table>';
  html += '<tr>' + '<th>Header</th>'.repeat(cols) + '</tr>';
  for (let r = 1; r < rows; r++) {
    html += '<tr>' + '<td>Cell</td>'.repeat(cols) + '</tr>';
  }
  html += '</table><p><br></p>';
  document.execCommand('insertHTML', false, html);
}

/* Sync contenteditable → hidden textarea before submit */
function syncContent() {
  document.getElementById('content-hidden').value = document.getElementById('editor').innerHTML;
}

/* ── Cover image preview ── */
function previewCover(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('cover-preview');
    img.src = e.target.result;
    img.style.display = 'block';
    document.getElementById('cover-url').value = '';
  };
  reader.readAsDataURL(input.files[0]);
}

function previewUrl(url) {
  const img = document.getElementById('cover-preview');
  if (url) { img.src = url; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
  // clear file input so URL takes priority
  document.getElementById('cover-file').value = '';
}
</script>
</body>
</html>
