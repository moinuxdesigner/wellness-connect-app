<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReceiptNumberService
{
    public function next(): string
    {
        $year = (int) now()->format('Y');
        $row = DB::table('receipt_sequences')->where('year', $year)->lockForUpdate()->first();
        $number = $row ? ((int) $row->last_number + 1) : 1;

        DB::table('receipt_sequences')->updateOrInsert(
            ['year' => $year],
            ['last_number' => $number, 'created_at' => $row?->created_at ?? now(), 'updated_at' => now()]
        );

        return sprintf('%s-%d-%06d', (string) config('services.razorpay.receipt_prefix', 'AWC-R'), $year, $number);
    }
}
