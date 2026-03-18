<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    */
    'default' => env('DB_CONNECTION', 'mongodb'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    */
    'connections' => [

        'mongodb' => [
            'driver'   => 'mongodb',
            'host'     => env('DB_HOST', '127.0.0.1'),
            'port'     => env('DB_PORT', 27017),
            'database' => env('DB_DATABASE', 'pms_db'),
            'username' => env('DB_USERNAME', ''),
            'password' => env('DB_PASSWORD', ''),
            'options'  => [
                'authSource' => env('DB_AUTHENTICATION_DATABASE', 'admin'),
                'appname'    => 'pms_hotel',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    */
    'migrations' => [
        'table'  => 'migrations',
        'update_date_on_publish' => true,
    ],

];
