<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\IntakeFlowController;
use App\Http\Controllers\Api\PractitionerController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\MembershipPlanController;
use App\Http\Controllers\Api\ClientMembershipController;
use App\Http\Controllers\Api\FinanceBillingController;
use App\Http\Controllers\Api\PaymentWebhookController;
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
        Route::put('/client/profile', [ClientProfileController::class, 'update'])->middleware('permission:client.profile.update');

        Route::middleware('permission:client.intake.manage')->group(function (): void {
            Route::post('/intake-flows', [IntakeFlowController::class, 'store']);
            Route::get('/intake-flows/{intakeFlow}', [IntakeFlowController::class, 'show']);
            Route::put('/intake-flows/{intakeFlow}/service', [IntakeFlowController::class, 'updateService']);
            Route::put('/intake-flows/{intakeFlow}/intake', [IntakeFlowController::class, 'saveIntake']);
            Route::post('/intake-flows/{intakeFlow}/submit', [IntakeFlowController::class, 'submit']);
            Route::get('/intake-flows/{intakeFlow}/confirmation', [IntakeFlowController::class, 'confirmation']);
            Route::get('/intake-flows/{intakeFlowId}/recommended-practitioners', [PractitionerController::class, 'recommended']);
            Route::get('/practitioners/{practitioner}/slots', [PractitionerController::class, 'slots']);
        });

        Route::get('/client/appointments', [AppointmentController::class, 'index'])->middleware('permission:client.appointments.view');
        Route::middleware('permission:client.appointments.manage')->group(function (): void {
            Route::post('/appointments', [AppointmentController::class, 'store']);
            Route::put('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
            Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        });
        Route::middleware('permission:client.memberships.manage')->prefix('client')->group(function (): void {
            Route::post('/memberships/checkout/orders', [ClientMembershipController::class, 'checkoutOrder']);
            Route::post('/memberships/checkout/verify', [ClientMembershipController::class, 'verify']);
            Route::get('/memberships', [ClientMembershipController::class, 'index']);
            Route::get('/receipts/{receipt}', [ClientMembershipController::class, 'receipt']);
        });

        Route::get('/trainer/access-status', [TrainerWorkspaceController::class, 'accessStatus'])->middleware('permission:trainer.dashboard.view');
        Route::middleware('trainer.approved')->prefix('trainer')->group(function (): void {
            Route::get('/dashboard', [TrainerWorkspaceController::class, 'dashboard'])->middleware('permission:trainer.dashboard.view');
        });

        Route::prefix('admin')->group(function (): void {
            Route::get('/overview', [AdminController::class, 'overview'])->middleware('permission:admin.dashboard.view,admin.usage.view');
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users/{user}/reset-password', [AdminController::class, 'resetUserPassword']);
            Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
            Route::get('/role-changes', [AdminController::class, 'roleChanges']);
            Route::get('/permissions', [PermissionController::class, 'index']);
            Route::put('/permissions/{role}', [PermissionController::class, 'update']);
            Route::get('/trainer-applications', [TrainerApplicationController::class, 'index']);
            Route::patch('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'updateStatus']);
            Route::get('/programs', [AdminController::class, 'programs'])->middleware('permission:admin.programs.view');
            Route::get('/escalations', [AdminController::class, 'escalations'])->middleware('permission:admin.escalations.view');
            Route::get('/activities', [AdminController::class, 'activities']);
            Route::middleware('permission:admin.memberships.manage')->group(function (): void {
                Route::get('/membership-plans', [MembershipPlanController::class, 'adminIndex']);
                Route::post('/membership-plans', [MembershipPlanController::class, 'store']);
                Route::put('/membership-plans/{package}/draft', [MembershipPlanController::class, 'updateDraft']);
                Route::post('/membership-plans/{package}/publish', [MembershipPlanController::class, 'publish']);
                Route::post('/membership-plans/{package}/archive', [MembershipPlanController::class, 'archive']);
                Route::get('/membership-plans/{package}/versions', [MembershipPlanController::class, 'versions']);
                Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'complete']);
            });
        });

        Route::middleware('permission:finance.invoices.view')->prefix('finance/billing')->group(function (): void {
            Route::get('/summary', [FinanceBillingController::class, 'summary']);
            Route::get('/payments', [FinanceBillingController::class, 'payments']);
            Route::get('/receipts', [FinanceBillingController::class, 'receipts']);
            Route::get('/refunds', [FinanceBillingController::class, 'refunds']);
        });
        Route::post('/finance/billing/payments/{payment}/refunds', [FinanceBillingController::class, 'refund'])
            ->middleware('permission:finance.refunds.manage');
    });

    Route::get('/membership-plans', [MembershipPlanController::class, 'publicIndex']);
    Route::post('/payments/razorpay/webhooks', [PaymentWebhookController::class, 'razorpay']);
    Route::post('/trainer-applications', [TrainerApplicationController::class, 'submit']);
    Route::get('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'show']);
    Route::post('/support-requests', [SupportRequestController::class, 'store']);
});
