<?php

// 1. إعداد مسار التشغيل الرئيسي لبيئة Serverless
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';

// 2. تجهيز مجلدات الـ Storage المؤقتة لبيئة Vercel
$storagePath = '/tmp/storage';
$directories = [
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache',
    $storagePath . '/framework/sessions',
    $storagePath . '/bootstrap/cache',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// 3. إعادة توجيه الـ Cache لمجلد الـ /tmp
$_ENV['APP_SERVICES_CACHE'] = $storagePath . '/bootstrap/cache/services.php';
$_ENV['APP_PACKAGES_CACHE'] = $storagePath . '/bootstrap/cache/packages.php';
$_ENV['APP_CONFIG_CACHE']   = $storagePath . '/bootstrap/cache/config.php';
$_ENV['APP_ROUTES_CACHE']   = $storagePath . '/bootstrap/cache/routes.php';

// 4. استدعاء ملف Laravel الرئيسي
require __DIR__ . '/../public/index.php';

