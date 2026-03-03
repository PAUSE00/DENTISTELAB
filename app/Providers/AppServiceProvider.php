<?php

namespace App\Providers;

use App\Models\Order;
use App\Models\Patient;
use App\Models\Service;
use App\Policies\OrderPolicy;
use App\Policies\PatientPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // ── Register Policies ────────────────────────────────
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Patient::class, PatientPolicy::class);
        Gate::policy(Service::class, ServicePolicy::class);

        // ── Rate Limiting ────────────────────────────────────
        \Illuminate\Support\Facades\RateLimiter::for('chat', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Listeners are auto-discovered by Laravel 11
    }
}
