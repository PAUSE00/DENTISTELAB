<?php

namespace App\Services;

use App\Models\SystemLog;

class AuditLogger
{
    public static function log(string $action, string $description, ?array $properties = null)
    {
        try {
            SystemLog::create([
                'user_id' => auth()->id(),
                'action' => $action,
                'description' => $description,
                'ip_address' => request()->ip(),
                'properties' => $properties,
            ]);
        } catch (\Exception $e) {
            // Silently catch so audit logging doesn't break app flow,
            // or use standard Log::error() if needed
            \Illuminate\Support\Facades\Log::error('AuditLogger error: ' . $e->getMessage());
        }
    }
}
