<?php
require_once __DIR__ . '/../config/helpers.php';
session_name(SESSION_NAME);
session_start();
session_destroy();
header('Location: login.php');
exit;
