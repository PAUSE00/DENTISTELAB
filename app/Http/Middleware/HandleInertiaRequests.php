<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            'auth' => [
                'user' => $request->user() ? array_merge(
                    $request->user()->only('id', 'name', 'email', 'role', 'clinic_id', 'lab_id'),
                    [
                        'clinic' => $request->user()->clinic ? clone $request->user()->clinic : null,
                        'lab' => $request->user()->lab ? clone $request->user()->lab : null,
                    ]
                ) : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'translations' => function () {
                $locale = app()->getLocale();
                $path = lang_path($locale . '.json');
                return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
            },
            'locale' => app()->getLocale(),
        ];
    }
}
