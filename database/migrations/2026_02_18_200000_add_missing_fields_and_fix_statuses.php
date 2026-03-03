<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Orders table: payment tracking + rejection reason ─────────
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->default('unpaid')->after('price');
            }
            if (! Schema::hasColumn('orders', 'final_price')) {
                $table->decimal('final_price', 10, 2)->nullable()->after('payment_status');
            }
            if (! Schema::hasColumn('orders', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
        });

        // Update any existing orders with old status names
        DB::table('orders')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('orders')->where('status', 'completed')->update(['status' => 'finished']);
        DB::table('orders')->where('status', 'accepted')->update(['status' => 'in_progress']);

        // ── Labs table: branding + subscription ──────────────────────
        Schema::table('labs', function (Blueprint $table) {
            if (! Schema::hasColumn('labs', 'logo_path')) {
                $table->string('logo_path')->nullable()->after('name');
            }
            if (! Schema::hasColumn('labs', 'subscription_plan')) {
                $table->string('subscription_plan')->default('free')->after('logo_path');
            }
            if (! Schema::hasColumn('labs', 'subscription_expires_at')) {
                $table->timestamp('subscription_expires_at')->nullable()->after('subscription_plan');
            }
        });

        // ── Users table: locale ─────────────────────
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'locale')) {
                $table->string('locale', 5)->default('fr')->after('role');
            }
        });

        // ── Messages table: read receipts + attachments ──────────────
        Schema::table('messages', function (Blueprint $table) {
            if (! Schema::hasColumn('messages', 'is_read')) {
                $table->boolean('is_read')->default(false)->after('content');
            }
            if (! Schema::hasColumn('messages', 'attachment_path')) {
                $table->string('attachment_path')->nullable()->after('is_read');
            }
        });

        // ── Order status history: track who changed it ───────────────
        Schema::table('order_status_histories', function (Blueprint $table) {
            if (! Schema::hasColumn('order_status_histories', 'changed_by_user_id')) {
                $table->unsignedBigInteger('changed_by_user_id')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('orders', 'payment_status')) $cols[] = 'payment_status';
            if (Schema::hasColumn('orders', 'final_price')) $cols[] = 'final_price';
            if (Schema::hasColumn('orders', 'rejection_reason')) $cols[] = 'rejection_reason';
            if (count($cols)) $table->dropColumn($cols);
        });

        DB::table('orders')->where('status', 'new')->update(['status' => 'pending']);
        DB::table('orders')->where('status', 'finished')->update(['status' => 'completed']);
        DB::table('orders')->where('status', 'in_progress')->update(['status' => 'accepted']);

        Schema::table('labs', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('labs', 'logo_path')) $cols[] = 'logo_path';
            if (Schema::hasColumn('labs', 'subscription_plan')) $cols[] = 'subscription_plan';
            if (Schema::hasColumn('labs', 'subscription_expires_at')) $cols[] = 'subscription_expires_at';
            if (count($cols)) $table->dropColumn($cols);
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'locale')) $table->dropColumn('locale');
        });

        Schema::table('messages', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('messages', 'is_read')) $cols[] = 'is_read';
            if (Schema::hasColumn('messages', 'attachment_path')) $cols[] = 'attachment_path';
            if (count($cols)) $table->dropColumn($cols);
        });

        Schema::table('order_status_histories', function (Blueprint $table) {
            if (Schema::hasColumn('order_status_histories', 'changed_by_user_id')) {
                $table->dropColumn('changed_by_user_id');
            }
        });
    }
};
