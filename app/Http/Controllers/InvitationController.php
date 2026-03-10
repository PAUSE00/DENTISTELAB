<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}
    /**
     * Show the invitation acceptance page.
     */
    public function show(string $token)
    {
        $invitation = Invitation::where('token', $token)
            ->with('lab')
            ->firstOrFail();

        if ($invitation->isAccepted()) {
            return Inertia::render('Invitation/AlreadyAccepted', [
                'labName' => $invitation->lab->name,
            ]);
        }

        if ($invitation->isExpired()) {
            return Inertia::render('Invitation/Expired', [
                'labName' => $invitation->lab->name,
            ]);
        }

        return Inertia::render('Invitation/Accept', [
            'invitation' => [
                'id' => $invitation->id,
                'token' => $invitation->token,
                'lab_name' => $invitation->lab->name,
                'expires_at' => $invitation->expires_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Accept an invitation (authenticated clinic user).
     */
    public function accept(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)
            ->with('lab')
            ->firstOrFail();

        if ($invitation->isAccepted() || $invitation->isExpired()) {
            return redirect('/dashboard')->with('error', 'Cette invitation n\'est plus valide.');
        }

        $user = Auth::user();

        if ($user->role !== 'dentist') {
            return redirect('/dashboard')->with('error', 'Seuls les dentistes peuvent accepter les invitations.');
        }

        // Link clinic to lab
        DB::table('clinic_lab')->insertOrIgnore([
            'clinic_id' => $user->clinic_id,
            'lab_id' => $invitation->lab_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $invitation->accept();

        // Notify the lab
        $this->notificationService->invitationAccepted(
            $invitation->lab_id,
            $user->name
        );

        return redirect('/dashboard')->with('success', "Vous êtes maintenant connecté au laboratoire {$invitation->lab->name}.");
    }
}
