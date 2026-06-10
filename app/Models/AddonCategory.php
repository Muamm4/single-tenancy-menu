<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddonCategory extends Model
{
    protected $fillable = [
        'name',
        'min_select',
        'max_select',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'min_select' => 'integer',
            'max_select' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function addons(): HasMany
    {
        return $this->hasMany(Addon::class)->orderBy('sort_order');
    }

    public function activeAddons(): HasMany
    {
        return $this->hasMany(Addon::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'addon_category_product');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
