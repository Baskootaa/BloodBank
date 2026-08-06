<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\QueryException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
        // 1. التعامل مع أخطاء الروابط غير الموجودة (404) لطلبات الـ API
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'عفواً، الرابط الذي تحاول الوصول إليه غير موجود في نظامنا.'
                ], 404);
            }
        });

        // 2. التعامل مع أخطاء قاعدة البيانات
        $exceptions->render(function (QueryException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'فشل الاتصال بقاعدة البيانات. ' . $e->getMessage(),
                ], 500);
            }
        });

        // 3. التعامل مع أي خطأ عام آخر
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'حدث خطأ مفاجئ في السيرفر، يرجى المحاولة لاحقاً.',
                    'debug'   => $e->getMessage()
                ], 500);
            }
        });

    })->create();