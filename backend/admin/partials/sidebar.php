<?php
$current = basename($_SERVER['PHP_SELF']);
$unread  = $db->query('SELECT COUNT(*) FROM contact_messages WHERE read_status = 0')->fetchColumn();
$newWar  = $db->query("SELECT COUNT(*) FROM warranty_registrations WHERE status = 'active' AND DATE(created_at) = CURDATE()")->fetchColumn();

function isActive(string $page, string $current): string {
    return $page === $current ? ' active' : '';
}
?>
<aside class="sidebar">
  <div class="sidebar-logo">
    <div class="sidebar-logo-text">
      <strong>Maifa</strong>
      <span>Admin Panel</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    <p class="sidebar-section-label">Overview</p>

    <a href="index.php" class="sidebar-link<?= isActive('index.php', $current) ?>">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
      Dashboard
    </a>

    <p class="sidebar-section-label">Catalogue</p>

    <a href="products.php" class="sidebar-link<?= isActive('products.php', $current) ?>">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
      Products
    </a>

    <a href="articles.php" class="sidebar-link<?= isActive('articles.php', $current) ?>">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      Articles
    </a>

    <p class="sidebar-section-label">Customer</p>

    <a href="warranty.php" class="sidebar-link<?= isActive('warranty.php', $current) ?>">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><path d="M12 2L3 7v6c0 5 3.7 9.7 9 11 5.3-1.3 9-6 9-11V7z"/></svg>
      Warranty
      <?php if ($newWar > 0): ?>
      <span class="sidebar-badge"><?= $newWar ?></span>
      <?php endif; ?>
    </a>

    <a href="messages.php" class="sidebar-link<?= isActive('messages.php', $current) ?>">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      Messages
      <?php if ($unread > 0): ?>
      <span class="sidebar-badge"><?= $unread ?></span>
      <?php endif; ?>
    </a>
  </nav>

  <div class="sidebar-footer">
    <a href="/" target="_blank" class="sidebar-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      View Website
    </a>
    <a href="logout.php" class="sidebar-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Logout
    </a>
  </div>
</aside>
