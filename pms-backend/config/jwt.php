<?php

return [

    'secret'      => env('JWT_SECRET'),
    'ttl'         => env('JWT_TTL', 60),
    'refresh_ttl' => 20160,
    'algo'        => 'HS256',

    'required_claims'   => ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'],
    'persistent_claims' => [],
    'lock_subject'      => true,
    'leeway'            => 0,

    'blacklist_enabled'      => true,
    'blacklist_grace_period' => 0,

    'providers' => [
        'jwt'     => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,
        'auth'    => Tymon\JWTAuth\Providers\Auth\Illuminate::class,
        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,
    ],

];
