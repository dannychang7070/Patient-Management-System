<?php
    ob_start();    
    $link=@mysqli_connect(
        'localhost', // Link
        'root', // Account
        'mysql', // Password (MAMP default: root; AMPPS default: admin)
        'hspt'); // Database (Collation: utf8_unicode_ci)
    if(!$link){
        die(printJson(0, "資料庫無法連線", ""));
    }
?>