<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Practitioner;
use App\Models\TrainerApplication;
use App\Models\User;
use App\Models\WorkflowCase;
use App\Services\WorkflowConfigService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TrainerWorkspaceAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unapproved_trainer_cannot_access_workspace_dashboard(): void
    {
        $trainer = User::factory()->create([
            'email' => 'pending.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $this->createTrainerApplication($trainer, 'submitted');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertOk()
            ->assertJsonPath('status', 'pending_review')
            ->assertJsonPath('application.applicantEmail', 'pending.trainer@example.com');

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertForbidden();
    }

    public function test_trainer_can_save_and_resume_draft_before_submission(): void
    {
        $trainer = User::factory()->create(['email' => 'draft@example.com', 'role' => 'trainer', 'status' => 'active']);
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-DRAFT',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'values_json' => [],
            'status' => 'draft',
            'current_screen' => 'personalInfo',
        ]);
        Sanctum::actingAs($trainer);

        $this->putJson('/api/v1/trainer/application/draft', [
            'values' => ['profile' => ['fullName' => 'Draft Trainer', 'email' => 'draft@example.com']],
            'currentScreen' => 'clientPitch',
        ])->assertOk()
            ->assertJsonPath('application.status', 'draft')
            ->assertJsonPath('application.currentScreen', 'clientPitch');

        $this->getJson('/api/v1/trainer/application')
            ->assertOk()
            ->assertJsonPath('application.applicationId', $application->application_id)
            ->assertJsonPath('application.currentScreen', 'clientPitch')
            ->assertJsonPath('application.values.profile.fullName', 'Draft Trainer');
    }

    public function test_trainer_can_submit_complete_application_without_optional_media(): void
    {
        $trainer = User::factory()->create(['email' => 'submit@example.com', 'role' => 'trainer', 'status' => 'active']);
        TrainerApplication::query()->create([
            'application_id' => 'TRN-SUBMIT',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'values_json' => [],
            'status' => 'draft',
        ]);
        Sanctum::actingAs($trainer);

        $this->postJson('/api/v1/trainer/application/submit', [
            'values' => $this->completeApplicationValues(),
        ])->assertOk()
            ->assertJsonPath('application.status', 'submitted')
            ->assertJsonPath('application.values.clientPitch', $this->completeApplicationValues()['clientPitch'])
            ->assertJsonPath('application.values.showcase.transformationPhotos', [])
            ->assertJsonPath('application.values.training.introductionVideo', null);

        $this->getJson('/api/v1/trainer/access-status')->assertOk()->assertJsonPath('status', 'pending_review');
    }

    public function test_pending_review_trainer_can_edit_and_resubmit_application(): void
    {
        $trainer = User::factory()->create(['email' => 'review-edit@example.com', 'role' => 'trainer', 'status' => 'active']);
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-EDIT',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'applicant_mobile' => '+91 9000000000',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => $this->completeApplicationValues(),
            'status' => 'submitted',
            'current_screen' => 'review',
            'submitted_at' => now()->subDay(),
        ]);
        Sanctum::actingAs($trainer);

        $editedValues = $this->completeApplicationValues();
        $editedValues['profile']['city'] = 'Bengaluru';
        $editedValues['training']['philosophy'] = 'I coach with a calm, sustainable structure that keeps progress practical and measurable.';

        $this->putJson('/api/v1/trainer/application/draft', [
            'values' => $editedValues,
            'currentScreen' => 'training',
        ])->assertOk()
            ->assertJsonPath('application.status', 'submitted')
            ->assertJsonPath('application.currentScreen', 'training')
            ->assertJsonPath('application.values.profile.city', 'Bengaluru');

        $this->postJson('/api/v1/trainer/application/submit', [
            'values' => $editedValues,
        ])->assertOk()
            ->assertJsonPath('application.status', 'submitted')
            ->assertJsonPath('application.currentScreen', 'review')
            ->assertJsonPath('application.values.training.philosophy', $editedValues['training']['philosophy']);

        $this->assertDatabaseHas('trainer_applications', [
            'id' => $application->id,
            'status' => 'submitted',
            'city' => 'Bengaluru',
            'current_screen' => 'review',
        ]);
    }

    public function test_approved_trainer_can_access_workspace_dashboard(): void
    {
        $trainer = User::factory()->create([
            'email' => 'approved.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $this->createTrainerApplication($trainer, 'approved');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertOk()
            ->assertJsonPath('status', 'approved');

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertOk();

        $this->assertDatabaseHas('practitioners', [
            'user_id' => $trainer->id,
            'practitioner_type' => 'trainer',
            'is_active' => true,
        ]);
    }

    public function test_suspended_trainer_is_blocked_even_with_an_approved_application(): void
    {
        $trainer = User::factory()->create([
            'email' => 'suspended.trainer@example.com',
            'role' => 'trainer',
            'status' => 'suspended',
        ]);
        $this->createTrainerApplication($trainer, 'approved');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertForbidden();

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertForbidden();
    }

    public function test_admin_approval_unlocks_trainer_workspace_access(): void
    {
        $trainer = User::factory()->create([
            'email' => 'review.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $application = $this->createTrainerApplication($trainer, 'under_review');
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertForbidden();

        Sanctum::actingAs($admin);
        $this->patchJson("/api/v1/admin/trainer-applications/{$application->application_id}", [
            'status' => 'approved',
            'adminRemarks' => 'Qualifications verified.',
        ])->assertOk()
            ->assertJsonPath('application.status', 'approved')
            ->assertJsonPath('account.created', false)
            ->assertJsonPath('account.temporaryPassword', null);

        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertOk();
        $this->assertDatabaseHas('practitioners', ['user_id' => $trainer->id, 'practitioner_type' => 'trainer']);
    }

    public function test_admin_approval_provisions_account_for_application_without_user(): void
    {
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-NEW-APPLICANT',
            'applicant_name' => 'New Trainer',
            'applicant_email' => 'new.trainer@example.com',
            'applicant_mobile' => '+91 9000000022',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($admin);
        $response = $this->patchJson("/api/v1/admin/trainer-applications/{$application->application_id}", [
            'status' => 'approved',
            'adminRemarks' => 'Approved for activation.',
        ])->assertOk()
            ->assertJsonPath('application.status', 'approved')
            ->assertJsonPath('account.email', 'new.trainer@example.com')
            ->assertJsonPath('account.created', true);

        $temporaryPassword = (string) $response->json('account.temporaryPassword');
        $this->assertNotSame('', $temporaryPassword);

        $trainer = User::query()->where('email', 'new.trainer@example.com')->firstOrFail();
        $this->assertSame('trainer', $trainer->role);
        $this->assertSame('active', $trainer->status);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'new.trainer@example.com',
            'password' => $temporaryPassword,
        ])->assertOk()->assertJsonPath('user.role', 'trainer');

        Sanctum::actingAs($admin);
        $this->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonFragment(['email' => 'new.trainer@example.com']);

        $this->assertDatabaseHas('practitioners', ['user_id' => $trainer->id, 'practitioner_type' => 'trainer']);
    }

    public function test_trainer_plan_requires_booked_client_and_dashboard_combines_session_and_task(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $bookedClient = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $otherClient = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Appointment::query()->create([
            'client_user_id' => $bookedClient->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->addHour(),
            'ends_at' => now()->addHours(2),
            'status' => 'scheduled',
        ]);
        Sanctum::actingAs($trainer);

        $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $otherClient->id,
            'goalTitle' => 'Not allowed',
            'startsOn' => today()->format('Y-m-d'),
        ])->assertUnprocessable();

        $planId = $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $bookedClient->id,
            'goalTitle' => 'Build reliable strength',
            'goalDescription' => 'Three consistent sessions each week.',
            'startsOn' => today()->format('Y-m-d'),
        ])->assertCreated()->json('plan.id');

        $this->postJson('/api/v1/trainer/tasks', [
            'clientUserId' => $bookedClient->id,
            'planId' => $planId,
            'type' => 'follow_up',
            'title' => 'Review first session',
            'startsAt' => now()->addHours(3)->toIso8601String(),
            'endsAt' => now()->addHours(4)->toIso8601String(),
        ])->assertCreated();

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertOk()
            ->assertJsonPath('snapshot.upcomingSessions', 1)
            ->assertJsonPath('snapshot.activeClients', 1)
            ->assertJsonCount(2, 'dailySchedule');
    }

    public function test_check_in_generates_pain_and_low_adherence_alerts_with_notifications(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subDay()->addHour(),
            'status' => 'completed',
        ]);
        Sanctum::actingAs($trainer);
        $planId = $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $client->id,
            'goalTitle' => 'Restore mobility',
            'startsOn' => today()->subWeek()->format('Y-m-d'),
        ])->assertCreated()->json('plan.id');
        $activityId = $this->postJson("/api/v1/trainer/plans/{$planId}/activities", [
            'title' => 'Mobility session',
            'scheduledFor' => today()->subDay()->format('Y-m-d'),
        ])->assertCreated()->json('activity.id');

        $this->postJson('/api/v1/trainer/check-ins', [
            'planId' => $planId,
            'checkedInOn' => today()->format('Y-m-d'),
            'weightKg' => 76.5,
            'goalProgressPercent' => 35,
            'notes' => 'Restricted movement today.',
            'painReported' => true,
            'painSeverity' => 'severe',
            'painNotes' => 'Sharp knee pain.',
            'activityUpdates' => [['id' => $activityId, 'status' => 'missed']],
        ])->assertCreated();

        $this->postJson('/api/v1/trainer/check-ins', [
            'planId' => $planId,
            'checkedInOn' => today()->format('Y-m-d'),
            'goalProgressPercent' => 42,
            'notes' => 'Pain remains elevated after the missed session.',
            'painReported' => true,
            'painSeverity' => 'severe',
            'painNotes' => 'Follow-up pain alert for the same client.',
        ])->assertCreated();

        $dashboard = $this->getJson('/api/v1/trainer/dashboard')->assertOk();
        $dashboard->assertJsonPath('snapshot.highPriorityAlerts', 2)
            ->assertJsonPath('snapshot.highRiskClients', 1)
            ->assertJsonPath('snapshot.lowAdherenceClients', 1)
            ->assertJsonPath('nextActions.0.kind', 'review_high_risk')
            ->assertJsonPath('nextActions.1.kind', 'resolve_low_adherence')
            ->assertJsonFragment(['type' => 'pain_injury', 'priority' => 'high'])
            ->assertJsonFragment(['type' => 'low_adherence', 'priority' => 'medium'])
            ->assertJsonFragment(['type' => 'trainer_missed_workout']);
        $this->assertGreaterThanOrEqual(4, (int) $dashboard->json('notifications.unreadCount'));

        $notificationId = $dashboard->json('notifications.items.0.id');
        $this->patchJson("/api/v1/trainer/notifications/{$notificationId}", ['read' => true])
            ->assertOk()
            ->assertJsonPath('notification.read', true);
    }

    public function test_trainer_can_escalate_pain_alert_without_intake_content(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now(),
            'ends_at' => now()->addHour(),
            'status' => 'scheduled',
        ]);
        Sanctum::actingAs($trainer);
        $planId = $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $client->id,
            'goalTitle' => 'Movement quality',
            'startsOn' => today()->format('Y-m-d'),
        ])->json('plan.id');
        $this->postJson('/api/v1/trainer/check-ins', [
            'planId' => $planId,
            'checkedInOn' => today()->format('Y-m-d'),
            'goalProgressPercent' => 20,
            'painReported' => true,
            'painSeverity' => 'severe',
            'painNotes' => 'Stop training until reviewed.',
        ])->assertCreated();
        $alertId = $this->getJson('/api/v1/trainer/dashboard')->json('priorityQueue.0.id');

        $this->patchJson("/api/v1/trainer/alerts/{$alertId}", [
            'action' => 'escalate',
            'note' => 'Severe knee pain reported during mobility work.',
        ])->assertOk()->assertJsonPath('alert.status', 'escalated');

        $case = WorkflowCase::query()->where('workflow_key', WorkflowConfigService::TRAINER_SAFETY_ESCALATION)->firstOrFail();
        $this->assertSame('admin', $case->owner_role);
        $this->assertSame('Severe knee pain reported during mobility work.', $case->meta_json['trainerNote']);
        $this->assertArrayNotHasKey('intakeAnswers', $case->meta_json);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);
        $this->getJson('/api/v1/admin/workflow-cases?workflowKey=' . WorkflowConfigService::TRAINER_SAFETY_ESCALATION)
            ->assertOk()
            ->assertJsonPath('cases.0.subject.type', 'trainer_alert')
            ->assertJsonPath('cases.0.subject.secondaryLabel', $client->name);
    }

    public function test_dashboard_next_actions_are_prioritized_and_capped_to_top_three(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $clientWithPlan = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $clientWithoutPlan = User::factory()->create(['role' => 'client', 'status' => 'active']);

        Appointment::query()->create([
            'client_user_id' => $clientWithPlan->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subDay()->addHour(),
            'status' => 'completed',
        ]);
        Appointment::query()->create([
            'client_user_id' => $clientWithoutPlan->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDay()->addHour(),
            'status' => 'scheduled',
        ]);

        Sanctum::actingAs($trainer);
        $planId = $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $clientWithPlan->id,
            'goalTitle' => 'Reduce pain and restore consistency',
            'startsOn' => today()->subWeek()->format('Y-m-d'),
        ])->assertCreated()->json('plan.id');
        $activityId = $this->postJson("/api/v1/trainer/plans/{$planId}/activities", [
            'title' => 'Strength session',
            'scheduledFor' => today()->subDay()->format('Y-m-d'),
        ])->assertCreated()->json('activity.id');

        $this->postJson('/api/v1/trainer/check-ins', [
            'planId' => $planId,
            'checkedInOn' => today()->format('Y-m-d'),
            'goalProgressPercent' => 25,
            'painReported' => true,
            'painSeverity' => 'severe',
            'painNotes' => 'Acute pain flare-up.',
            'activityUpdates' => [['id' => $activityId, 'status' => 'missed']],
        ])->assertCreated();

        $this->postJson('/api/v1/trainer/tasks', [
            'clientUserId' => $clientWithPlan->id,
            'planId' => $planId,
            'type' => 'follow_up',
            'title' => 'Overdue recovery follow-up',
            'startsAt' => now()->subHours(3)->toIso8601String(),
            'endsAt' => now()->subHours(2)->toIso8601String(),
        ])->assertCreated();

        $dashboard = $this->getJson('/api/v1/trainer/dashboard')->assertOk();
        $dashboard->assertJsonCount(3, 'nextActions')
            ->assertJsonPath('nextActions.0.kind', 'review_high_risk')
            ->assertJsonPath('nextActions.1.kind', 'complete_follow_up')
            ->assertJsonPath('nextActions.2.kind', 'resolve_low_adherence');
    }

    public function test_dashboard_next_actions_include_log_check_in_when_today_update_is_missing(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);

        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subDay()->addHour(),
            'status' => 'completed',
        ]);

        Sanctum::actingAs($trainer);
        $this->postJson('/api/v1/trainer/plans', [
            'clientUserId' => $client->id,
            'goalTitle' => 'Daily consistency',
            'startsOn' => today()->subWeek()->format('Y-m-d'),
        ])->assertCreated();

        $dashboard = $this->getJson('/api/v1/trainer/dashboard')->assertOk();
        $this->assertContains('log_check_in', collect($dashboard->json('nextActions'))->pluck('kind')->all());
    }

    public function test_dashboard_next_actions_include_create_plan_for_booked_clients_without_active_plan(): void
    {
        [$trainer, $practitioner] = $this->approvedTrainerWorkspace();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);

        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->addHour(),
            'ends_at' => now()->addHours(2),
            'status' => 'scheduled',
        ]);

        Sanctum::actingAs($trainer);
        $dashboard = $this->getJson('/api/v1/trainer/dashboard')->assertOk();
        $this->assertContains('create_plan', collect($dashboard->json('nextActions'))->pluck('kind')->all());
    }

    private function createTrainerApplication(User $trainer, string $status): TrainerApplication
    {
        return TrainerApplication::query()->create([
            'application_id' => 'TRN-' . $trainer->id,
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'applicant_mobile' => '+91 9000000000',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => $status,
            'submitted_at' => now(),
        ]);
    }

    private function approvedTrainerWorkspace(): array
    {
        $trainer = User::factory()->create(['role' => 'trainer', 'status' => 'active']);
        $this->createTrainerApplication($trainer, 'approved');
        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertOk();

        return [$trainer, Practitioner::query()->where('user_id', $trainer->id)->firstOrFail()];
    }

    private function completeApplicationValues(): array
    {
        return [
            'profile' => [
                'fullName' => 'Complete Trainer',
                'gender' => 'Man',
                'dateOfBirth' => '1990-01-01',
                'email' => 'submit@example.com',
                'mobile' => '+91 9000000000',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            'photo' => ['file' => ['name' => 'photo.jpg']],
            'certification' => ['institute' => 'Fitness Academy', 'type' => 'CPT', 'certificate' => ['name' => 'certificate.pdf']],
            'expertise' => ['Strength Training'],
            'experience' => ['yearsExperience' => '4', 'clientsTrained' => '80'],
            'clientPitch' => 'I help clients build lasting strength through safe, practical coaching that fits real life.',
            'showcase' => ['transformationPhotos' => [], 'videos' => []],
            'training' => ['philosophy' => 'I focus on sustainable movement quality, consistency, and confident progress.', 'introductionVideo' => null],
            'availability' => [
                'modes' => ['Online Coaching'],
                'days' => ['Monday'],
                'perSessionRateInr' => '1500',
                'monthlyRateInr' => '8000',
                'pricingPlans' => '',
            ],
            'identity' => ['pan' => ['name' => 'pan.pdf'], 'aadhaar' => ['name' => 'aadhaar.pdf'], 'passport' => null, 'drivingLicense' => null],
            'payout' => ['bankName' => 'HDFC', 'accountNumber' => '012345678901', 'ifsc' => 'HDFC0001234'],
        ];
    }
}
