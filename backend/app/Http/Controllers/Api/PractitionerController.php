<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PractitionerController extends Controller
{
    public function recommended(Request $request, int $intakeFlowId): JsonResponse
    {
        $practitioners = Practitioner::query()
            ->where('is_active', true)
            ->with(['user', 'specialties'])
            ->take(10)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->user?->name,
                'type' => $item->practitioner_type,
                'rating' => $item->rating,
                'specialties' => $item->specialties->pluck('specialty_code')->all(),
            ]);

        return response()->json(['practitioners' => $practitioners]);
    }

    public function slots(Request $request, Practitioner $practitioner): JsonResponse
    {
        $now = now();
        $from = $request->query('from')
            ? Carbon::parse((string) $request->query('from'))->startOfDay()
            : $now;
        $from = $from->lt($now) ? $now : $from;
        $to = $request->query('to')
            ? Carbon::parse((string) $request->query('to'))->endOfDay()
            : $now->copy()->addDays(30)->endOfDay();

        if ($to->lt($from)) {
            return response()->json(['slots' => []]);
        }

        $slots = $practitioner->slots()
            ->where('slot_status', 'open')
            ->where('starts_at', '>', $now)
            ->where('starts_at', '>=', $from)
            ->where('starts_at', '<=', $to)
            ->orderBy('starts_at')
            ->get(['id', 'starts_at', 'ends_at', 'slot_status']);

        return response()->json(['slots' => $slots]);
    }
}
