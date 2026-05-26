<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WellnessPackage;
use App\Models\WellnessPackageVersion;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MembershipPlanController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function publicIndex(): JsonResponse
    {
        $plans = WellnessPackage::query()
            ->where('status', 'published')
            ->where('is_active', true)
            ->with(['currentPublishedVersion.tiers' => fn ($query) => $query->where('is_active', true)->where('billing_type', 'one_time')])
            ->get()
            ->map(fn (WellnessPackage $package) => $this->planPayload($package))
            ->filter(fn (array $plan) => count($plan['tiers']) > 0)
            ->values();

        return response()->json(['plans' => $plans]);
    }

    public function adminIndex(): JsonResponse
    {
        $plans = WellnessPackage::query()
            ->with(['versions.tiers', 'currentPublishedVersion.tiers'])
            ->latest()
            ->get()
            ->map(fn (WellnessPackage $package) => $this->adminPayload($package));

        return response()->json(['plans' => $plans]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateDraft($request);
        $package = DB::transaction(function () use ($data): WellnessPackage {
            $package = WellnessPackage::query()->create([
                'code' => Str::slug($data['name']) . '-' . Str::lower(Str::random(6)),
                'slug' => Str::slug($data['name']) . '-' . Str::lower(Str::random(6)),
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'duration_weeks' => $data['duration_weeks'],
                'sessions_counselling' => $data['credits']['counselling'],
                'sessions_training' => $data['credits']['training'],
                'status' => 'draft',
                'is_active' => true,
            ]);
            $this->saveDraftVersion($package, $data, 1);
            return $package;
        });

        $this->activityLogs->record('membership_plan', 'plan_created', sprintf('%s created membership plan %s.', $request->user()->name, $package->name), [
            'actor' => $request->user(),
            'subject' => $package,
            'details' => [
                'status' => $package->status,
                'durationWeeks' => $package->duration_weeks,
            ],
            'audienceRoles' => ['finance'],
        ]);

        return response()->json(['message' => 'Membership plan draft created.', 'plan' => $this->adminPayload($package->load('versions.tiers'))], 201);
    }

    public function updateDraft(Request $request, WellnessPackage $package): JsonResponse
    {
        $data = $this->validateDraft($request);
        DB::transaction(function () use ($package, $data): void {
            $draft = $package->versions()->where('status', 'draft')->latest('version_number')->first();
            if (!$draft) {
                $draft = $this->saveDraftVersion($package, $data, ((int) $package->versions()->max('version_number')) + 1);
            } else {
                $draft->update($this->versionAttributes($data));
                $draft->tiers()->delete();
                $this->saveTiers($draft, $data['tiers']);
            }
            $package->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'duration_weeks' => $data['duration_weeks'],
                'sessions_counselling' => $data['credits']['counselling'],
                'sessions_training' => $data['credits']['training'],
            ]);
        });

        $this->activityLogs->record('membership_plan', 'plan_updated', sprintf('%s updated membership plan %s.', $request->user()->name, $package->name), [
            'actor' => $request->user(),
            'subject' => $package,
            'details' => [
                'status' => $package->fresh()->status,
                'durationWeeks' => $data['duration_weeks'],
            ],
            'audienceRoles' => ['finance'],
        ]);

        return response()->json(['message' => 'Draft updated.', 'plan' => $this->adminPayload($package->fresh()->load('versions.tiers', 'currentPublishedVersion.tiers'))]);
    }

    public function publish(Request $request, WellnessPackage $package): JsonResponse
    {
        $draft = $package->versions()->with('tiers')->where('status', 'draft')->latest('version_number')->firstOrFail();
        abort_if($draft->tiers->isEmpty(), 422, 'Add at least one pricing tier before publishing.');
        $credits = $draft->included_credits_json ?? [];
        abort_if(((int) ($credits['counselling'] ?? 0) + (int) ($credits['training'] ?? 0)) < 1, 422, 'Published plans must include at least one session credit.');

        DB::transaction(function () use ($package, $draft, $request): void {
            $draft->update(['status' => 'published', 'published_at' => now(), 'published_by_user_id' => $request->user()->id]);
            $package->update(['status' => 'published', 'current_published_version_id' => $draft->id, 'is_active' => true]);
        });

        $this->activityLogs->record('membership_plan', 'plan_published', sprintf('%s published membership plan %s.', $request->user()->name, $package->name), [
            'actor' => $request->user(),
            'subject' => $package,
            'details' => ['status' => 'published', 'versionId' => $draft->id],
            'audienceRoles' => ['finance'],
        ]);

        return response()->json(['message' => 'Membership plan published.', 'plan' => $this->adminPayload($package->fresh()->load('versions.tiers', 'currentPublishedVersion.tiers'))]);
    }

    public function archive(Request $request, WellnessPackage $package): JsonResponse
    {
        $package->update(['status' => 'archived', 'is_active' => false]);

        $this->activityLogs->record('membership_plan', 'plan_archived', sprintf('%s archived membership plan %s.', $request->user()->name, $package->name), [
            'actor' => $request->user(),
            'subject' => $package,
            'details' => ['status' => 'archived'],
            'audienceRoles' => ['finance'],
        ]);

        return response()->json(['message' => 'Membership plan archived. Existing purchases are unaffected.']);
    }

    public function versions(WellnessPackage $package): JsonResponse
    {
        return response()->json(['versions' => $package->versions()->with('tiers')->orderByDesc('version_number')->get()]);
    }

    private function validateDraft(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'duration_weeks' => ['required', 'integer', 'min:1', 'max:104'],
            'credits' => ['required', 'array'],
            'credits.counselling' => ['required', 'integer', 'min:0', 'max:100'],
            'credits.training' => ['required', 'integer', 'min:0', 'max:100'],
            'internal_cost_counselling_minor' => ['nullable', 'integer', 'min:0'],
            'internal_cost_training_minor' => ['nullable', 'integer', 'min:0'],
            'tiers' => ['required', 'array', 'min:1'],
            'tiers.*.label' => ['required', 'string', 'max:100'],
            'tiers.*.amount_minor' => ['required', 'integer', 'min:1'],
        ]);
    }

    private function saveDraftVersion(WellnessPackage $package, array $data, int $versionNumber): WellnessPackageVersion
    {
        $version = $package->versions()->create($this->versionAttributes($data) + ['version_number' => $versionNumber, 'status' => 'draft']);
        $this->saveTiers($version, $data['tiers']);
        return $version;
    }

    private function saveTiers(WellnessPackageVersion $version, array $tiers): void
    {
        foreach ($tiers as $tier) {
            $version->tiers()->create(['label' => $tier['label'], 'billing_type' => 'one_time', 'amount_minor' => $tier['amount_minor'], 'currency' => 'INR', 'is_active' => true]);
        }
    }

    private function versionAttributes(array $data): array
    {
        return [
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'duration_weeks' => $data['duration_weeks'],
            'included_credits_json' => $data['credits'],
            'internal_cost_counselling_minor' => $data['internal_cost_counselling_minor'] ?? null,
            'internal_cost_training_minor' => $data['internal_cost_training_minor'] ?? null,
        ];
    }

    private function planPayload(WellnessPackage $package): array
    {
        $version = $package->currentPublishedVersion;
        return [
            'id' => $package->id, 'slug' => $package->slug, 'name' => $version?->name, 'description' => $version?->description,
            'durationWeeks' => $version?->duration_weeks, 'credits' => $version?->included_credits_json ?? [],
            'versionId' => $version?->id,
            'tiers' => $version?->tiers->map(fn ($tier) => ['id' => $tier->id, 'label' => $tier->label, 'amountMinor' => $tier->amount_minor, 'currency' => $tier->currency, 'billingType' => $tier->billing_type])->values()->all() ?? [],
        ];
    }

    private function adminPayload(WellnessPackage $package): array
    {
        $published = $package->currentPublishedVersion;
        $latest = $package->versions->sortByDesc('version_number')->first();
        $credits = $latest?->included_credits_json ?? [];
        $costConfigured = $latest && $latest->internal_cost_counselling_minor !== null && $latest->internal_cost_training_minor !== null;
        $estimatedCost = $costConfigured ? ((int) ($credits['counselling'] ?? 0) * $latest->internal_cost_counselling_minor) + ((int) ($credits['training'] ?? 0) * $latest->internal_cost_training_minor) : null;
        return [
            'id' => $package->id, 'name' => $package->name, 'description' => $package->description, 'status' => $package->status, 'slug' => $package->slug,
            'latestVersion' => $latest, 'publishedVersionId' => $published?->id, 'estimatedCostMinor' => $estimatedCost,
            'versionCount' => $package->versions->count(),
        ];
    }
}
