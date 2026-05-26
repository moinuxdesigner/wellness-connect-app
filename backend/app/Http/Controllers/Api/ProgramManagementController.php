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

class ProgramManagementController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function index(): JsonResponse
    {
        $programs = WellnessPackage::query()
            ->with([
                'versions' => fn ($query) => $query->orderByDesc('version_number'),
                'currentPublishedVersion',
            ])
            ->withCount('intakeFlows')
            ->latest()
            ->get()
            ->map(fn (WellnessPackage $package) => $this->programPayload($package));

        return response()->json(['programs' => $programs]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateDraft($request);

        $program = DB::transaction(function () use ($data): WellnessPackage {
            $program = WellnessPackage::query()->create([
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

            $this->saveDraftVersion($program, $data, 1);

            return $program;
        });

        $this->activityLogs->record('program', 'program_created', sprintf('%s created program %s.', $request->user()->name, $program->name), [
            'actor' => $request->user(),
            'subject' => $program,
            'details' => [
                'status' => $program->status,
                'durationWeeks' => $program->duration_weeks,
                'credits' => [
                    'counselling' => $program->sessions_counselling,
                    'training' => $program->sessions_training,
                ],
            ],
        ]);

        return response()->json([
            'message' => 'Program draft created.',
            'program' => $this->programPayload($program->fresh()->load(['versions' => fn ($query) => $query->orderByDesc('version_number'), 'currentPublishedVersion'])->loadCount('intakeFlows')),
        ], 201);
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
            }

            $package->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'duration_weeks' => $data['duration_weeks'],
                'sessions_counselling' => $data['credits']['counselling'],
                'sessions_training' => $data['credits']['training'],
            ]);
        });

        $updated = $package->fresh()->load([
            'versions' => fn ($query) => $query->orderByDesc('version_number'),
            'currentPublishedVersion',
        ])->loadCount('intakeFlows');

        $this->activityLogs->record('program', 'program_updated', sprintf('%s updated program %s.', $request->user()->name, $updated->name), [
            'actor' => $request->user(),
            'subject' => $updated,
            'details' => [
                'status' => $updated->status,
                'durationWeeks' => $updated->duration_weeks,
                'credits' => [
                    'counselling' => $updated->sessions_counselling,
                    'training' => $updated->sessions_training,
                ],
            ],
        ]);

        return response()->json([
            'message' => 'Program draft updated.',
            'program' => $this->programPayload($updated),
        ]);
    }

    public function publish(Request $request, WellnessPackage $package): JsonResponse
    {
        $draft = $package->versions()->where('status', 'draft')->latest('version_number')->firstOrFail();
        $credits = $draft->included_credits_json ?? [];
        abort_if(((int) ($credits['counselling'] ?? 0) + (int) ($credits['training'] ?? 0)) < 1, 422, 'Published programs must include at least one total credit.');

        DB::transaction(function () use ($package, $draft, $request): void {
            $draft->update([
                'status' => 'published',
                'published_at' => now(),
                'published_by_user_id' => $request->user()->id,
            ]);

            $package->update([
                'status' => 'published',
                'current_published_version_id' => $draft->id,
                'is_active' => true,
                'name' => $draft->name,
                'description' => $draft->description,
                'duration_weeks' => $draft->duration_weeks,
                'sessions_counselling' => (int) ($credits['counselling'] ?? 0),
                'sessions_training' => (int) ($credits['training'] ?? 0),
            ]);
        });

        $published = $package->fresh()->load([
            'versions' => fn ($query) => $query->orderByDesc('version_number'),
            'currentPublishedVersion',
        ])->loadCount('intakeFlows');

        $this->activityLogs->record('program', 'program_published', sprintf('%s published program %s.', $request->user()->name, $published->name), [
            'actor' => $request->user(),
            'subject' => $published,
            'details' => [
                'status' => $published->status,
                'publishedVersionId' => $published->current_published_version_id,
            ],
        ]);

        return response()->json([
            'message' => 'Program published.',
            'program' => $this->programPayload($published),
        ]);
    }

    public function archive(Request $request, WellnessPackage $package): JsonResponse
    {
        $package->update([
            'status' => 'archived',
            'is_active' => false,
        ]);

        $archived = $package->fresh()->load([
            'versions' => fn ($query) => $query->orderByDesc('version_number'),
            'currentPublishedVersion',
        ])->loadCount('intakeFlows');

        $this->activityLogs->record('program', 'program_archived', sprintf('%s archived program %s.', $request->user()->name, $archived->name), [
            'actor' => $request->user(),
            'subject' => $archived,
            'details' => ['status' => $archived->status],
        ]);

        return response()->json([
            'message' => 'Program archived.',
            'program' => $this->programPayload($archived),
        ]);
    }

    public function versions(WellnessPackage $package): JsonResponse
    {
        return response()->json([
            'versions' => $package->versions()
                ->orderByDesc('version_number')
                ->get()
                ->map(fn (WellnessPackageVersion $version) => $this->versionPayload($version))
                ->values(),
        ]);
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
        ]);
    }

    private function saveDraftVersion(WellnessPackage $package, array $data, int $versionNumber): WellnessPackageVersion
    {
        return $package->versions()->create($this->versionAttributes($data) + [
            'version_number' => $versionNumber,
            'status' => 'draft',
        ]);
    }

    private function versionAttributes(array $data): array
    {
        return [
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'duration_weeks' => $data['duration_weeks'],
            'included_credits_json' => $data['credits'],
            'internal_cost_counselling_minor' => null,
            'internal_cost_training_minor' => null,
        ];
    }

    private function versionPayload(WellnessPackageVersion $version): array
    {
        return [
            'id' => $version->id,
            'versionNumber' => $version->version_number,
            'name' => $version->name,
            'description' => $version->description,
            'durationWeeks' => $version->duration_weeks,
            'credits' => $version->included_credits_json ?? ['counselling' => 0, 'training' => 0],
            'status' => $version->status,
            'publishedAt' => optional($version->published_at)?->toIso8601String(),
            'createdAt' => optional($version->created_at)?->toIso8601String(),
        ];
    }

    private function programPayload(WellnessPackage $package): array
    {
        $latestVersion = $package->versions->sortByDesc('version_number')->first();
        $published = $package->currentPublishedVersion;
        $credits = $latestVersion?->included_credits_json ?? [
            'counselling' => (int) $package->sessions_counselling,
            'training' => (int) $package->sessions_training,
        ];

        return [
            'id' => $package->id,
            'name' => $package->name,
            'slug' => $package->slug,
            'description' => $package->description,
            'status' => $package->status,
            'durationWeeks' => $latestVersion?->duration_weeks ?? $package->duration_weeks,
            'credits' => [
                'counselling' => (int) ($credits['counselling'] ?? 0),
                'training' => (int) ($credits['training'] ?? 0),
            ],
            'versionCount' => $package->versions->count(),
            'publishedVersionId' => $published?->id,
            'latestVersion' => $latestVersion ? $this->versionPayload($latestVersion) : null,
            'intakeFlowCount' => (int) ($package->intake_flows_count ?? 0),
            'isActive' => (bool) $package->is_active,
        ];
    }
}
