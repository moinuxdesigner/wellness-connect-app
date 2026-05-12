<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\IntakeFlowController;
use App\Http\Controllers\Api\PractitionerController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);
        });
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::put('/client/profile', [ClientProfileController::class, 'update']);

        Route::post('/intake-flows', [IntakeFlowController::class, 'store']);
        Route::get('/intake-flows/{intakeFlow}', [IntakeFlowController::class, 'show']);
        Route::put('/intake-flows/{intakeFlow}/service', [IntakeFlowController::class, 'updateService']);
        Route::put('/intake-flows/{intakeFlow}/intake', [IntakeFlowController::class, 'saveIntake']);
        Route::post('/intake-flows/{intakeFlow}/submit', [IntakeFlowController::class, 'submit']);
        Route::get('/intake-flows/{intakeFlow}/confirmation', [IntakeFlowController::class, 'confirmation']);

        Route::get('/intake-flows/{intakeFlowId}/recommended-practitioners', [PractitionerController::class, 'recommended']);
        Route::get('/practitioners/{practitioner}/slots', [PractitionerController::class, 'slots']);

        Route::get('/client/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::put('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
        Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    });
});
