<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Invitation;
use App\Models\Lab;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * Display connected clinics and pending invitations.
     */
    public function index()
    {
        $lab = Lab::findOrFail(Auth::user()->lab_id);

        // Clinics connected to this lab (via pivot table clinic_lab)
        $clients = $lab->clinics()->withPivot('created_at')->get();

        // Pending invitations
        $invitations = Invitation::where('lab_id', $lab->id)
            ->pending()
            ->latest()
            ->get();

        return Inertia::render('Lab/Clients/Index', [
            'clients' => $clients,
            'invitations' => $invitations,
        ]);
    }

    /**
     * Send an invitation email to a clinic.
     */
    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $labId = Auth::user()->lab_id;
        $email = $request->email;

        // Check if already connected
        $existingClinic = Clinic::where('email', $email)->first();
        if ($existingClinic) {
            $alreadyConnected = DB::table('clinic_lab')
                ->where('lab_id', $labId)
                ->where('clinic_id', $existingClinic->id)
                ->exists();

            if ($alreadyConnected) {
                return redirect()->back()->withErrors(['email' => 'Ce cabinet est déjà connecté à votre laboratoire.']);
            }
        }

        // Check for pending invitation
        $existingInvitation = Invitation::where('lab_id', $labId)
            ->where('email', $email)
            ->pending()
            ->first();

        if ($existingInvitation) {
            return redirect()->back()->withErrors(['email' => 'Une invitation est déjà en attente pour cette adresse.']);
        }

        // Create invitation
        $invitation = Invitation::create([
            'lab_id' => $labId,
            'email' => $email,
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
        ]);

        // Send email
        $lab = Lab::find($labId);
        Mail::to($email)->send(new \App\Mail\ClinicInvitationMail($invitation, $lab));

        if ($existingClinic) {
            $this->notificationService->invitationReceived($existingClinic->id, $lab->name);
        }

        return redirect()->back()->with('success', 'Invitation envoyée avec succès.');
    }

    /**
     * Revoke a clinic's access.
     */
    public function revoke(Request $request, $clinicId)
    {
        $labId = Auth::user()->lab_id;

        DB::table('clinic_lab')
            ->where('lab_id', $labId)
            ->where('clinic_id', $clinicId)
            ->delete();

        return redirect()->back()->with('success', 'Accès révoqué.');
    }

    /**
     * Cancel a pending invitation.
     */
    public function cancelInvitation($invitationId)
    {
        $invitation = Invitation::where('lab_id', Auth::user()->lab_id)
            ->findOrFail($invitationId);

        $invitation->delete();

        return redirect()->back()->with('success', 'Invitation annulée.');
    }
}
