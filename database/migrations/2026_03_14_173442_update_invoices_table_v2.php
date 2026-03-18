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
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'amount')) {
                $table->decimal('amount', 12, 2)->after('clinic_id')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'tax')) {
                $table->decimal('tax', 12, 2)->after('amount')->default(0);
            }
            if (Schema::hasColumn('invoices', 'total_amount')) {
                $table->renameColumn('total_amount', 'total');
            }
            if (!Schema::hasColumn('invoices', 'order_id')) {
                $table->foreignId('order_id')->nullable()->after('clinic_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('invoices', 'pdf_path')) {
                $table->string('pdf_path')->nullable()->after('paid_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
