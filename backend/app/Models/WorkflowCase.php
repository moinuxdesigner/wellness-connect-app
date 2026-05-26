<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'workflow_key',
    'subject_type',
    'subject_id',
    'status',
    'priority',
    'owner_role',
    'due_at',
    'acknowledged_at',
    'resolved_at',
    'breached_at',
    'meta_json',
])]
class WorkflowCase extends Model
{
    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'resolved_at' => 'datetime',
            'breached_at' => 'datetime',
            'meta_json' => 'array',
        ];
    }
}
