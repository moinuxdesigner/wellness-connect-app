<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntakeAnswer;
use App\Models\IntakeFlow;
use App\Services\IntakeTriageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntakeFlowController extends Controller
{
    public function __construct(private readonly IntakeTriageService $triageService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_type' => ['required', 'in:psychology,training,combined,package'],
        ]);

        $flow = IntakeFlow::create([
            'client_user_id' => $request->user()->id,
            'service_type' => $validated['service_type'],
            'current_step' => 'service',
            'status' => 'draft',
        ]);

        return response()->json([
            'intake_flow_id' => $flow->id,
            'service_type' => $flow->service_type,
            'current_step' => $flow->current_step,
            'status' => $flow->status,
        ], 201);
    }

    public function show(IntakeFlow $intakeFlow, Request $request): JsonResponse
    {
        abort_unless($intakeFlow->client_user_id === $request->user()->id, 403);

        return response()->json($intakeFlow->load('answers'));
    }

    public function updateService(IntakeFlow $intakeFlow, Request $request): JsonResponse
    {
        abort_unless($intakeFlow->client_user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'service_type' => ['required', 'in:psychology,training,combined,package'],
            'wellness_package_id' => ['nullable', 'integer', 'exists:wellness_packages,id'],
        ]);

        $intakeFlow->update([
            'service_type' => $validated['service_type'],
            'wellness_package_id' => $validated['wellness_package_id'] ?? null,
            'current_step' => 'intake',
        ]);

        return response()->json($intakeFlow->fresh());
    }

    public function saveIntake(IntakeFlow $intakeFlow, Request $request): JsonResponse
    {
        abort_unless($intakeFlow->client_user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.section_key' => ['required', 'string', 'max:80'],
            'answers.*.question_key' => ['required', 'string', 'max:120'],
            'answers.*.answer_type' => ['required', 'in:single,multi,text,number,scale,date,boolean,json'],
            'answers.*.answer_json' => ['required'],
        ]);

        foreach ($validated['answers'] as $item) {
            IntakeAnswer::updateOrCreate(
                [
                    'intake_flow_id' => $intakeFlow->id,
                    'question_key' => $item['question_key'],
                ],
                [
                    'section_key' => $item['section_key'],
                    'answer_type' => $item['answer_type'],
                    'answer_json' => $item['answer_json'],
                ]
            );
        }

        $intakeFlow->update(['current_step' => 'intake']);

        return response()->json(['message' => 'Answers saved.', 'current_step' => 'intake', 'status' => $intakeFlow->status]);
    }

    public function submit(IntakeFlow $intakeFlow, Request $request): JsonResponse
    {
        abort_unless($intakeFlow->client_user_id === $request->user()->id, 403);

        $intakeFlow->load('answers');
        $decision = $this->triageService->evaluate($intakeFlow);

        $intakeFlow->update([
            'status' => $decision['status'],
            'risk_level' => $decision['risk_level'],
            'current_step' => $decision['current_step'],
            'submitted_at' => now(),
        ]);

        return response()->json([
            'id' => $intakeFlow->id,
            'status' => $intakeFlow->status,
            'current_step' => $intakeFlow->current_step,
            'review_eta_hours' => $intakeFlow->status === 'under_review' ? 24 : null,
        ]);
    }

    public function confirmation(IntakeFlow $intakeFlow, Request $request): JsonResponse
    {
        abort_unless($intakeFlow->client_user_id === $request->user()->id, 403);

        if ($intakeFlow->status === 'under_review') {
            return response()->json([
                'state' => 'under_review',
                'message' => 'Application under review',
                'next_steps' => [
                    'Review process within 24 hours',
                    'Personal contact by coordinator',
                    'Customized support matching',
                ],
            ]);
        }

        $appointment = $intakeFlow->appointments()->latest()->first();

        if (!$appointment) {
            return response()->json(['state' => 'pending', 'message' => 'No booked appointment found yet.']);
        }

        return response()->json([
            'state' => 'session_confirmed',
            'session' => [
                'date_time' => optional($appointment->starts_at)->format('l, M d \a\t h:i A'),
                'mode' => $appointment->mode,
                'practitioner_name' => optional($appointment->practitioner?->user)->name,
            ],
        ]);
    }
}
