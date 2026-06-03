<?php

namespace Database\Seeders;

use App\Models\AvailabilitySlot;
use App\Models\Practitioner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AvailabilitySlotSeeder extends Seeder
{
    public function run(): void
    {
        AvailabilitySlot::query()
            ->where('slot_status', 'open')
            ->where('starts_at', '<=', now())
            ->update(['slot_status' => 'blocked']);

        Practitioner::query()
            ->where('is_active', true)
            ->whereIn('practitioner_type', ['counsellor', 'trainer'])
            ->get()
            ->each(function (Practitioner $practitioner): void {
                foreach ($this->upcomingDates() as $date) {
                    foreach ($this->dailySchedule($practitioner->practitioner_type) as $slot) {
                        $startsAt = $date->copy()->setTimeFromTimeString($slot['time']);
                        $endsAt = $startsAt->copy()->addMinutes($slot['duration']);

                        if ($startsAt->lte(now()) || $this->hasConflict($practitioner->id, $startsAt, $endsAt)) {
                            continue;
                        }

                        AvailabilitySlot::query()->create([
                            'practitioner_id' => $practitioner->id,
                            'starts_at' => $startsAt,
                            'ends_at' => $endsAt,
                            'slot_status' => 'open',
                        ]);
                    }
                }
            });
    }

    private function upcomingDates(): array
    {
        return collect(range(0, 13))
            ->map(fn (int $offset) => today()->addDays($offset))
            ->reject(fn (Carbon $date) => $date->isSunday())
            ->values()
            ->all();
    }

    private function dailySchedule(string $practitionerType): array
    {
        if ($practitionerType === 'trainer') {
            return [
                ['time' => '08:00:00', 'duration' => 60],
                ['time' => '17:30:00', 'duration' => 60],
            ];
        }

        return [
            ['time' => '18:30:00', 'duration' => 50],
            ['time' => '19:30:00', 'duration' => 50],
        ];
    }

    private function hasConflict(int $practitionerId, Carbon $startsAt, Carbon $endsAt): bool
    {
        return AvailabilitySlot::query()
            ->where('practitioner_id', $practitionerId)
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->exists();
    }
}
