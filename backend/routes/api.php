<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\IntakeFlowController;
use App\Http\Controllers\Api\PractitionerController;
use App\Http\Controllers\Api\TrainerApplicationController;
use App\Http\Controllers\Api\TrainerWorkspaceController;
use App\Http\Controllers\Api\SupportRequestController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::middleware('account.active')->group(function (): void {
                Route::get('/me', [AuthController::class, 'me']);
                Route::post('/change-password', [AuthController::class, 'changePassword']);
            });
        });
    });

    Route::middleware(['auth:sanctum', 'account.active'])->group(function (): void {
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

        Route::get('/trainer/access-status', [TrainerWorkspaceController::class, 'accessStatus']);
        Route::middleware('trainer.approved')->prefix('trainer')->group(function (): void {
            Route::get('/dashboard', [TrainerWorkspaceController::class, 'dashboard']);
        });

        Route::prefix('admin')->group(function (): void {
            Route::get('/overview', [AdminController::class, 'overview']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users/{user}/reset-password', [AdminController::class, 'resetUserPassword']);
            Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
            Route::get('/role-changes', [AdminController::class, 'roleChanges']);
            Route::get('/trainer-applications', [TrainerApplicationController::class, 'index']);
            Route::patch('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'updateStatus']);
            Route::get('/programs', [AdminController::class, 'programs']);
            Route::get('/escalations', [AdminController::class, 'escalations']);
            Route::get('/activities', [AdminController::class, 'activities']);
        });
    });

    Route::post('/trainer-applications', [TrainerApplicationController::class, 'submit']);
    Route::get('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'show']);
    Route::post('/support-requests', [SupportRequestController::class, 'store']);
});
