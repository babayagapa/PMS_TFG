<?php
use Illuminate\Support\Facades\Route;

// Rutas públicas
// TODO: POST /login → AuthController@login
// TODO: GET  /habitaciones → HabitacionController@index

// Rutas protegidas (jwt.auth)
// TODO: POST /logout, GET /me
// TODO: CRUD /habitaciones (escritura solo admin)
// TODO: CRUD /reservas + PATCH /reservas/{id}/confirmar