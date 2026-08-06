<?php

use Illuminate\Support\Facades\Route;

// المسار الرئيسي فقط يرجع صفحة welcome أو رسالة API Running
Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to Baskota Blood Bank API',
        'status' => 'online'
    ]);
});