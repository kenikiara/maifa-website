<?php
require_once __DIR__ . '/../config/helpers.php';

session_name(SESSION_NAME);
session_start();

if (!empty($_SESSION['admin'])) { header('Location: index.php'); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim($_POST['username'] ?? '');
    $pass = trim($_POST['password'] ?? '');
    if ($user === ADMIN_USER && password_verify($pass, ADMIN_PASS)) {
        $_SESSION['admin'] = true;
        header('Location: index.php'); exit;
    }
    $error = 'Invalid username or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Login — Maifa Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/admin.css">
  <style>
    body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#0a0a0a; }
    .login-box { width:100%; max-width:380px; padding:40px 36px; background:#111; border:1px solid rgba(255,255,255,.08); border-radius:16px; }
    .login-logo { font-family:'DM Serif Display',serif; font-size:28px; color:#fff; margin-bottom:8px; }
    .login-sub { font-size:13px; color:rgba(255,255,255,.45); margin-bottom:32px; font-family:'JetBrains Mono',monospace; letter-spacing:.06em; text-transform:uppercase; }
    .login-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
    .login-field label { font-size:11px; color:rgba(255,255,255,.45); font-family:'JetBrains Mono',monospace; letter-spacing:.12em; text-transform:uppercase; }
    .login-field input { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); color:#fff; padding:14px 16px; border-radius:8px; font-family:'Inter',sans-serif; font-size:14px; }
    .login-field input:focus { outline:none; border-color:rgba(255,255,255,.3); }
    .login-btn { width:100%; padding:14px; background:#0f7a3d; color:#fff; border:none; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; cursor:pointer; margin-top:8px; transition:background .15s; }
    .login-btn:hover { background:#0a5a2c; }
    .login-error { background:rgba(246,4,4,.1); border:1px solid rgba(246,4,4,.3); color:#f60404; padding:12px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; }
  </style>
</head>
<body>
  <div class="login-box">
    <div class="login-logo">Maifa</div>
    <div class="login-sub">Admin Panel</div>
    <?php if ($error): ?>
    <div class="login-error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    <form method="POST">
      <div class="login-field">
        <label>Username</label>
        <input type="text" name="username" autocomplete="username" required>
      </div>
      <div class="login-field">
        <label>Password</label>
        <input type="password" name="password" autocomplete="current-password" required>
      </div>
      <button type="submit" class="login-btn">Sign in →</button>
    </form>
  </div>
</body>
</html>
