<?php
$titles = [
    'index.php'    => 'Dashboard',
    'products.php' => 'Products',
    'warranty.php' => 'Warranty Registrations',
    'messages.php' => 'Messages',
];
$title = $titles[basename($_SERVER['PHP_SELF'])] ?? 'Admin';
?>
<div class="topbar">
  <div class="topbar-title"><?= $title ?></div>
  <div class="topbar-actions">
    <a href="/" target="_blank" class="btn-sm outline">↗ View site</a>
  </div>
</div>
