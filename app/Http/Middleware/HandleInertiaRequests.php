<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Announcement;

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
                    $request->user()->only('id', 'name', 'email', 'role', 'clinic_id', 'lab_id', 'avatar_path'),
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
            'announcements' => function () use ($request) {
                $user = $request->user();

                // Determine which targets apply to this user
                $targets = ['all'];
                if ($user) {
                    if (in_array($user->role, ['lab_owner', 'lab_tech'])) {
                        $targets[] = 'lab';
                    } elseif (in_array($user->role, ['dentist', 'clinic_staff'])) {
                        $targets[] = 'clinic';
                    } else {
                        // super_admin sees everything
                        $targets = ['all', 'lab', 'clinic'];
                    }
                }

                return Announcement::where('is_active', true)
                    ->whereIn('target', $targets)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                    })
                    ->latest()
                    ->get(['id', 'title', 'message', 'type', 'target', 'expires_at', 'created_at']);
            },
        ];
    }
}
