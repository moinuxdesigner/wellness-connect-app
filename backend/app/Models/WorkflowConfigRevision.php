<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['workflow_config_id', 'actor_user_id', 'reason', 'config_json'])]
class WorkflowConfigRevision extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'config_json' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function workflowConfig(): BelongsTo
    {
        return $this->belongsTo(WorkflowConfig::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
