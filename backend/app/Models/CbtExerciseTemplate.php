<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category_id', 'title', 'slug', 'description', 'clinical_purpose', 'instructions', 'difficulty_level', 'estimated_minutes', 'target_conditions_json', 'template_schema_json', 'scoring_schema_json', 'is_active', 'created_by'])]
class CbtExerciseTemplate extends Model
{
    protected function casts(): array
    {
        return [
            'target_conditions_json' => 'array',
            'template_schema_json' => 'array',
            'scoring_schema_json' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CbtExerciseCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function planExercises(): HasMany
    {
        return $this->hasMany(CbtPlanExercise::class, 'exercise_template_id');
    }
}
