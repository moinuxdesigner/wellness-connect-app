<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['exercise_response_id', 'reviewed_by', 'review_status', 'clinical_notes', 'feedback_to_client', 'risk_flag', 'next_action', 'reviewed_at'])]
class CbtPractitionerReview extends Model
{
    protected function casts(): array
    {
        return [
            'risk_flag' => 'boolean',
            'reviewed_at' => 'datetime',
        ];
    }

    public function response(): BelongsTo
    {
        return $this->belongsTo(CbtExerciseResponse::class, 'exercise_response_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
