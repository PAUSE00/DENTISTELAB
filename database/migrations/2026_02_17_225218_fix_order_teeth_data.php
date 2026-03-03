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

        $orders = \App\Models\Order::all();

        foreach ($orders as $order) {
            // Get the raw attribute to see what's actually in there
            $rawTeeth = $order->getAttributes()['teeth'] ?? null;

            if (is_string($rawTeeth)) {
                $decoded = json_decode($rawTeeth, true);

                // If it decodes to an array of strings (which is what we want), 
                // but it was stored as a string... 
                // Wait, if it's double encoded: '"[\"1\",\"2\"]"' 
                // json_decode once -> '["1","2"]' (string)
                // json_decode twice -> ['1', '2'] (array)

                // If the current value in model attribute (casted) is a string, it means double encoding.
                // Let's rely on the model casting.
                // If $order->teeth is a string, it's double encoded.

                if (is_string($order->teeth)) {
                    // It is double encoded.
                    // $order->teeth is '["16","23"]' (string)
                    $realArray = json_decode($order->teeth, true);

                    if (is_array($realArray)) {
                        $order->teeth = $realArray; // Set it to the array
                        $order->save(); // Eloquent will json_encode it once.
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
