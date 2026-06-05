<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['session_flow_id', 'step_key', 'phase', 'title', 'sort_order', 'status', 'prompt', 'response_json', 'clinical_note', 'started_at', 'completed_at'])]
class CounsellorSessionFlowStep extends Model
{
    protected function casts(): array
    {
        return [
            'response_json' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function flow(): BelongsTo
    {
        return $this->belongsTo(CounsellorSessionFlow::class, 'session_flow_id');
    }
}
