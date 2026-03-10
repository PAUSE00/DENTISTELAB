<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Performance indexes for frequently queried columns.
     * Foreign key indexes on clinic_id, lab_id already exist from constrained().
     */
    public function up(): void
    {
        // Indexes already exist in the database
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to revert
    }
};
