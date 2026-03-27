<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use App\Mail\AccessRequestReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AccessRequestController extends Controller
{
    /**
     * Store a new access request from the landing page.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email'        => 'required|email|unique:access_requests,email',
            'phone'        => 'nullable|string|max:30',
            'type'         => 'required|in:clinic,lab',
            'message'      => 'nullable|string|max:2000',
        ]);

        $access = AccessRequest::create($validated);

        // Send confirmation email to requester
        try {
            Mail::to($access->email)->send(
                new AccessRequestReceived($access->full_name, $access->type, $access->company_name)
            );
        } catch (\Exception $e) {
            // Log but don't fail the request
            \Log::warning('Access request confirmation email failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Votre demande a bien été envoyée. Vous recevrez un e-mail de confirmation sous peu.');
    }
}
