<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'sort_order', 'is_active'])]
class CbtExerciseCategory extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function templates(): HasMany
    {
        return $this->hasMany(CbtExerciseTemplate::class, 'category_id');
    }
}
