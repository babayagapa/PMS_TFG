<?php

return [

    'name'    => env('APP_NAME', 'PMS_TFG'),
    'env'     => env('APP_ENV', 'local'),
    'debug'   => (bool) env('APP_DEBUG', false),
    'url'     => env('APP_URL', 'http://localhost:8000'),
    'key'     => env('APP_KEY'),
    'cipher'  => 'AES-256-CBC',
    'timezone'=> 'Europe/Madrid',
    'locale'  => 'es',
    'fallback_locale' => 'en',

    'providers' => [
        Illuminate\Auth\AuthServiceProvider::class,
        Illuminate\Bus\BusServiceProvider::class,
        Illuminate\Cache\CacheServiceProvider::class,
        Illuminate\Foundation\Providers\ConsoleSupportServiceProvider::class,
        Illuminate\Cookie\CookieServiceProvider::class,
        Illuminate\Database\DatabaseServiceProvider::class,
        Illuminate\Encryption\EncryptionServiceProvider::class,
        Illuminate\Filesystem\FilesystemServiceProvider::class,
        Illuminate\Foundation\Providers\FoundationServiceProvider::class,
        Illuminate\Hashing\HashServiceProvider::class,
        Illuminate\Pipeline\PipelineServiceProvider::class,
        Illuminate\Queue\QueueServiceProvider::class,
        Illuminate\Auth\Passwords\PasswordResetServiceProvider::class,
        Illuminate\Translation\TranslationServiceProvider::class,
        Illuminate\Validation\ValidationServiceProvider::class,
        Illuminate\View\ViewServiceProvider::class,
        Illuminate\Routing\RoutingServiceProvider::class,
        MongoDB\Laravel\MongoDBServiceProvider::class,
        Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
        App\Providers\AppServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ],

    'aliases' => [
        'App'      => Illuminate\Support\Facades\App::class,
        'Auth'     => Illuminate\Support\Facades\Auth::class,
        'Cache'    => Illuminate\Support\Facades\Cache::class,
        'Config'   => Illuminate\Support\Facades\Config::class,
        'DB'       => Illuminate\Support\Facades\DB::class,
        'Hash'     => Illuminate\Support\Facades\Hash::class,
        'Log'      => Illuminate\Support\Facades\Log::class,
        'Route'    => Illuminate\Support\Facades\Route::class,
        'Schema'   => Illuminate\Support\Facades\Schema::class,
        'Validator'=> Illuminate\Support\Facades\Validator::class,
        'JWTAuth'  => Tymon\JWTAuth\Facades\JWTAuth::class,
    ],

];