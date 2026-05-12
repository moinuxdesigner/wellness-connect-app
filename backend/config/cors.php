<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_values(
        array_filter(
            array_map('trim', explode(',', env(
                'CORS_ALLOWED_ORIGINS',
                implode(',', [
                    env('FRONTEND_URL', 'http://localhost:5173'),
                    'http://localhost',
                    'https://localhost',
                    'capacitor://localhost',
                ]),
            ))),
        ),
    ),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true,
];
