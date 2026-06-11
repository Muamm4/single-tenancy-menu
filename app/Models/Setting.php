<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'group'];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setValue(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->pluck('value', 'key')
            ->toArray();
    }

    public static function setGroup(string $group, array $values): void
    {
        foreach ($values as $key => $value) {
            static::updateOrCreate(
                ['key' => $key, 'group' => $group],
                ['value' => $value]
            );
        }
    }

    /**
     * Check if the restaurant is currently open based on business hours.
     */
    public static function isOpen(): bool
    {
        $hoursData = static::getGroup('business_hours');
        $hours = isset($hoursData['business_hours'])
            ? json_decode($hoursData['business_hours'], true)
            : [];

        if (empty($hours)) {
            return true; // no hours configured = assume open
        }

        $now = now();
        $today = $now->dayOfWeek; // 0=Sunday, 6=Saturday
        $currentTime = $now->format('H:i');

        foreach ($hours as $day) {
            if ((int) $day['day'] === $today) {
                if (! empty($day['closed'])) {
                    return false;
                }
                if ($currentTime >= $day['open'] && $currentTime < $day['close']) {
                    return true;
                }
                return false;
            }
        }

        return true;
    }
}
