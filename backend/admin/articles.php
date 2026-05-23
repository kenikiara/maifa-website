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
        $id      = (int) ($_POST['id'] ?? 0);
        $title   = trim($_POST['title'] ?? '');
        $slug    = make_slug($title, trim($_POST['slug'] ?? ''));
        $fields  = [
            'title'       => htmlspecialchars($title, ENT_QUOTES, 'UTF-8'),
            'slug'        => $slug,
            'excerpt'     => htmlspecialchars(trim($_POST['excerpt'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'content'     => $_POST['content'] ?? '',   // rich HTML from TinyMCE
            'category'    => htmlspecialchars(trim($_POST['category'] ?? 'General'), ENT_QUOTES, 'UTF-8'),
            'tags'        => htmlspecialchars(trim($_POST['tags'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'meta_title'  => htmlspecialchars(trim($_POST['meta_title'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'meta_desc'   => htmlspecialchars(trim($_POST['meta_desc'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'cover_image' => htmlspecialchars(trim($_POST['cover_image'] ?? ''), ENT_QUOTES, 'UTF-8'),
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

$articles  = $db->query('SELECT id, title, slug, category, published, created_at FROM articles ORDER BY created_at DESC')->fetchAll();
$cats      = ['General','Buying Guide','Brand Comparison','Car Tips','Service','EV & Modern Cars'];

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
  <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
  <script>
    tinymce.init({
      selector: '#content',
      plugins: 'lists link image table code fullscreen',
      toolbar: 'undo redo | formatselect | bold italic underline | bullist numlist | link image | table | code fullscreen',
      height: 500,
      skin: 'oxide-dark',
      content_css: 'dark',
      menubar: false,
      branding: false,
      promotion: false,
      content_style: 'body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.7; color: #e0e0e0; background: #1a1a1a; padding: 16px; } h2 { font-family: "DM Serif Display", serif; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #555; padding: 8px; }',
    });
  </script>
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

      <form method="POST" id="article-form">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $editing['id'] ?? 0 ?>">

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
              <textarea id="content" name="content"><?= htmlspecialchars($editing['content'] ?? '') ?></textarea>
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
              <div class="form-group" style="margin-bottom:0">
                <label>Image URL</label>
                <input type="text" name="cover_image" value="<?= htmlspecialchars($editing['cover_image'] ?? '') ?>" placeholder="https://... or /products/img.jpg">
              </div>
            </div>

          </div>
        </div>
      </form>

      <?php endif; ?>

    </div>
  </main>

<script>
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
</script>
</body>
</html>
