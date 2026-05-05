<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $from = $request->query('from');
        $to = $request->query('to');

        $query = $practitioner->slots()->where('slot_status', 'open');

        if ($from) {
            $query->whereDate('starts_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('starts_at', '<=', $to);
        }

        $slots = $query->orderBy('starts_at')->get(['id', 'starts_at', 'ends_at', 'slot_status']);

        return response()->json(['slots' => $slots]);
    }
}
