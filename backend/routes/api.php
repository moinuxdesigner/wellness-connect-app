<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AccountProfileController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\IntakeFlowController;
use App\Http\Controllers\Api\PractitionerController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\MembershipPlanController;
use App\Http\Controllers\Api\ClientMembershipController;
use App\Http\Controllers\Api\FinanceBillingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentWebhookController;
use App\Http\Controllers\Api\PerformanceDashboardController;
use App\Http\Controllers\Api\ProgramManagementController;
use App\Http\Controllers\Api\TrainerApplicationController;
use App\Http\Controllers\Api\TrainerWorkspaceController;
use App\Http\Controllers\Api\SupportRequestController;
use App\Http\Controllers\Api\WorkflowCaseController;
use App\Http\Controllers\Api\WorkflowConfigController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/trainer-register/otp/request', [AuthController::class, 'requestTrainerRegistrationOtp']);
        Route::post('/trainer-register/otp/verify', [AuthController::class, 'verifyTrainerRegistrationOtp']);
        Route::post('/trainer-register/otp/resend', [AuthController::class, 'resendTrainerRegistrationOtp']);
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
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])
            ->middleware('permission:admin.activity_logs.view,client.activity_logs.view,counsellor.activity_logs.view,trainer.activity_logs.view,coach.activity_logs.view,helpdesk.activity_logs.view,finance.activity_logs.view,legal.activity_logs.view,content.activity_logs.view');
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{notification}', [NotificationController::class, 'update']);
        Route::get('/account/profile', [AccountProfileController::class, 'show']);
        Route::put('/account/profile', [AccountProfileController::class, 'update']);

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
        Route::get('/trainer/application', [TrainerApplicationController::class, 'current']);
        Route::put('/trainer/application/draft', [TrainerApplicationController::class, 'saveDraft']);
        Route::post('/trainer/application/submit', [TrainerApplicationController::class, 'submitCurrent']);
        Route::middleware('trainer.approved')->prefix('trainer')->group(function (): void {
            Route::get('/dashboard', [TrainerWorkspaceController::class, 'dashboard'])->middleware('permission:trainer.dashboard.view');
            Route::get('/progress-review', [TrainerWorkspaceController::class, 'progressReviewLanding'])->middleware('permission:trainer.checkins.view');
            Route::get('/clients/{client}/progress-review', [TrainerWorkspaceController::class, 'progressReview'])->middleware('permission:trainer.checkins.view');
            Route::middleware('permission:trainer.plans.manage')->group(function (): void {
                Route::get('/clients', [TrainerWorkspaceController::class, 'clients']);
                Route::get('/plans', [TrainerWorkspaceController::class, 'plans']);
                Route::post('/plans', [TrainerWorkspaceController::class, 'storePlan']);
                Route::put('/plans/{plan}', [TrainerWorkspaceController::class, 'updatePlan']);
                Route::post('/plans/{plan}/activities', [TrainerWorkspaceController::class, 'storeActivity']);
                Route::patch('/activities/{activity}', [TrainerWorkspaceController::class, 'updateActivity']);
            });
            Route::middleware('permission:trainer.checkins.view')->group(function (): void {
                Route::get('/check-ins', [TrainerWorkspaceController::class, 'checkIns']);
                Route::post('/check-ins', [TrainerWorkspaceController::class, 'storeCheckIn']);
            });
            Route::middleware('permission:trainer.messages.manage')->group(function (): void {
                Route::get('/clients/{client}/messages', [TrainerWorkspaceController::class, 'messages']);
                Route::post('/clients/{client}/messages', [TrainerWorkspaceController::class, 'storeMessage']);
            });
            Route::middleware('permission:trainer.tasks.manage')->group(function (): void {
                Route::get('/tasks', [TrainerWorkspaceController::class, 'tasks']);
                Route::post('/tasks', [TrainerWorkspaceController::class, 'storeTask']);
                Route::patch('/tasks/{task}', [TrainerWorkspaceController::class, 'updateTask']);
            });
            Route::patch('/alerts/{alert}', [TrainerWorkspaceController::class, 'updateAlert'])->middleware('permission:trainer.alerts.manage');
            Route::patch('/notifications/{notification}', [TrainerWorkspaceController::class, 'updateNotification'])->middleware('permission:trainer.notifications.view');
        });

        Route::prefix('admin')->group(function (): void {
            Route::get('/overview', [AdminController::class, 'overview'])->middleware('permission:admin.dashboard.view,admin.usage.view');
            Route::get('/performance', [PerformanceDashboardController::class, 'show'])->middleware('permission:admin.performance.view');
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users/{user}/reset-password', [AdminController::class, 'resetUserPassword']);
            Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);
            Route::get('/role-changes', [AdminController::class, 'roleChanges']);
            Route::get('/permissions', [PermissionController::class, 'index']);
            Route::put('/permissions/{role}', [PermissionController::class, 'update']);
            Route::get('/trainer-applications', [TrainerApplicationController::class, 'index']);
            Route::patch('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'updateStatus']);
            Route::middleware('permission:admin.programs.view')->group(function (): void {
                Route::get('/programs', [ProgramManagementController::class, 'index']);
                Route::post('/programs', [ProgramManagementController::class, 'store']);
                Route::put('/programs/{package}/draft', [ProgramManagementController::class, 'updateDraft']);
                Route::post('/programs/{package}/publish', [ProgramManagementController::class, 'publish']);
                Route::post('/programs/{package}/archive', [ProgramManagementController::class, 'archive']);
                Route::get('/programs/{package}/versions', [ProgramManagementController::class, 'versions']);
            });
            Route::get('/escalations', [AdminController::class, 'escalations'])->middleware('permission:admin.escalations.view');
            Route::get('/activities', [ActivityLogController::class, 'index'])->middleware('permission:admin.activity_logs.view');
            Route::middleware('permission:admin.workflows.manage')->group(function (): void {
                Route::get('/workflows', [WorkflowConfigController::class, 'index']);
                Route::put('/workflows/{workflowKey}', [WorkflowConfigController::class, 'update']);
                Route::get('/workflow-cases', [WorkflowCaseController::class, 'adminIndex']);
            });
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

        Route::prefix('helpdesk')->middleware('permission:helpdesk.tickets.manage')->group(function (): void {
            Route::get('/workflow-cases', [WorkflowCaseController::class, 'helpdeskIndex']);
        });

        Route::patch('/workflow-cases/{workflowCase}', [WorkflowCaseController::class, 'update'])
            ->middleware('permission:admin.workflows.manage,helpdesk.tickets.manage');
    });

    Route::get('/membership-plans', [MembershipPlanController::class, 'publicIndex']);
    Route::post('/payments/razorpay/webhooks', [PaymentWebhookController::class, 'razorpay']);
    Route::post('/trainer-applications', [TrainerApplicationController::class, 'submit']);
    Route::get('/trainer-applications/{applicationId}', [TrainerApplicationController::class, 'show']);
    Route::post('/support-requests', [SupportRequestController::class, 'store']);
});
