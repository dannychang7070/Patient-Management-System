<?php
    ob_start();    
    $link=@mysqli_connect(
        'localhost', // Link
        'root', // Account
        '', // Password (MAMP default: root; AMPPS default: admin)
        'hspt2'); // Database (Collation: utf8_unicode_ci)
    if(!$link){
        echo "ERROR: Unable to connect the database.<br/>";
    }
?>