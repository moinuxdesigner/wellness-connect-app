<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\CbtRiskEvent;
use App\Models\ClientProfile;
use App\Models\IntakeFlow;
use App\Models\Practitioner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CounsellorClientControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_counsellor_clients_include_avatar_datetime_and_prioritized_actions(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-06-05 09:00:00'));

        $counsellor = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        $practitioner = Practitioner::query()->create([
            'user_id' => $counsellor->id,
            'practitioner_type' => 'counsellor',
            'is_active' => true,
        ]);

        $followUp = $this->clientWithAppointment($practitioner, 'Follow Up Client', Carbon::parse('2026-06-04 14:30:00'), 'completed', [
            'profile_photo_url' => 'https://example.test/client-avatar.jpg',
        ]);
        $scheduled = $this->clientWithAppointment($practitioner, 'Scheduled Client', Carbon::parse('2026-06-06 10:15:00'));
        $intakeReview = $this->clientWithAppointment($practitioner, 'Intake Review Client', Carbon::parse('2026-06-06 11:15:00'));
        $watch = $this->clientWithAppointment($practitioner, 'Watch Client', Carbon::parse('2026-06-06 12:15:00'));
        $high = $this->clientWithAppointment($practitioner, 'High Risk Client', Carbon::parse('2026-06-06 13:15:00'));

        IntakeFlow::query()->create([
            'client_user_id' => $intakeReview->id,
            'service_type' => 'psychology',
            'current_step' => 'intake',
            'status' => 'under_review',
            'risk_level' => 'low',
            'submitted_at' => Carbon::parse('2026-06-04 09:00:00'),
        ]);
        IntakeFlow::query()->create([
            'client_user_id' => $watch->id,
            'service_type' => 'psychology',
            'current_step' => 'intake',
            'status' => 'submitted',
            'risk_level' => 'medium',
            'submitted_at' => Carbon::parse('2026-06-04 10:00:00'),
        ]);
        CbtRiskEvent::query()->create([
            'client_id' => $high->id,
            'risk_type' => 'clinical_escalation',
            'risk_level' => 'high',
            'trigger_text' => 'Client disclosed urgent risk.',
            'alerted_practitioner_id' => $counsellor->id,
            'status' => 'open',
        ]);

        Sanctum::actingAs($counsellor);

        $clients = collect($this->getJson('/api/v1/counsellor/clients')
            ->assertOk()
            ->json('clients'))
            ->keyBy('name');

        $this->assertSame('https://example.test/client-avatar.jpg', $clients['Follow Up Client']['profilePhotoUrl']);
        $this->assertNull($clients['Scheduled Client']['profilePhotoUrl']);
        $this->assertSame(Carbon::parse('2026-06-04 14:30:00')->toIso8601String(), $clients['Follow Up Client']['lastSession']);
        $this->assertNull($clients['Scheduled Client']['lastSession']);

        $this->assertSame('normal', $clients['Follow Up Client']['risk']);
        $this->assertSame('Schedule follow-up session', $clients['Follow Up Client']['nextAction']);

        $this->assertSame('normal', $clients['Scheduled Client']['risk']);
        $this->assertSame('Continue care plan', $clients['Scheduled Client']['nextAction']);

        $this->assertSame('normal', $clients['Intake Review Client']['risk']);
        $this->assertSame('under_review', $clients['Intake Review Client']['intakeStatus']);
        $this->assertSame('Complete intake review', $clients['Intake Review Client']['nextAction']);

        $this->assertSame('watch', $clients['Watch Client']['risk']);
        $this->assertSame('Review care plan', $clients['Watch Client']['nextAction']);

        $this->assertSame('high', $clients['High Risk Client']['risk']);
        $this->assertSame('Review high-risk flag', $clients['High Risk Client']['nextAction']);
    }

    private function clientWithAppointment(Practitioner $practitioner, string $name, Carbon $startsAt, string $status = 'scheduled', array $profile = []): User
    {
        $client = User::factory()->create(['name' => $name, 'role' => 'client', 'status' => 'active']);
        ClientProfile::query()->create([
            'user_id' => $client->id,
            'primary_goal' => 'mental_health',
            ...$profile,
        ]);
        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'psychology',
            'mode' => 'online',
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addHour(),
            'status' => $status,
        ]);

        return $client;
    }
}
