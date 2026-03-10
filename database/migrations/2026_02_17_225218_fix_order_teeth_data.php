<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Since the App\Models\Order model casts 'teeth' to array,
        // we can iterate through the orders. If the data was stored as a JSON string
        // inside a string (double encoded), Eloquent might have trouble or treat it weirdly.
        // However, we want to ensure the raw DB value is a valid JSON array, not a JSON string representing a string.

        // Use raw DB query instead of Eloquent model to avoid SoftDeletes
        // scope referencing 'deleted_at' column that doesn't exist yet.
        $orders = \Illuminate\Support\Facades\DB::table('orders')->get();

        foreach ($orders as $order) {
            $rawTeeth = $order->teeth ?? null;

            if (is_string($rawTeeth)) {
                $decoded = json_decode($rawTeeth, true);

                // Check for double-encoded JSON
                if (is_string($decoded)) {
                    $realArray = json_decode($decoded, true);

                    if (is_array($realArray)) {
                        \Illuminate\Support\Facades\DB::table('orders')
                            ->where('id', $order->id)
                            ->update(['teeth' => json_encode($realArray)]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
