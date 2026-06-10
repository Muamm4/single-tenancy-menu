<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'promotional_price',
        'image',
        'is_active',
        'sort_order',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_promotional_price',
        'has_promotion',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'promotional_price' => 'float',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function addonCategories(): BelongsToMany
    {
        return $this->belongsToMany(AddonCategory::class, 'addon_category_product');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'R$ ' . number_format($this->price, 2, ',', '.');
    }

    public function getFormattedPromotionalPriceAttribute(): string
    {
        if ($this->promotional_price) {
            return 'R$ ' . number_format($this->promotional_price, 2, ',', '.');
        }
        return '';
    }

    public function getHasPromotionAttribute(): bool
    {
        return !is_null($this->promotional_price) && $this->promotional_price > 0;
    }
}
