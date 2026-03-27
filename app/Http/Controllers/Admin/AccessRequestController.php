<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use Inertia\Inertia;

class AccessRequestController extends Controller
{
    public function index()
    {
        $requests = AccessRequest::latest()->get();

        return Inertia::render('Admin/AccessRequests/Index', [
            'requests' => $requests,
            'counts'   => [
                'pending'  => $requests->where('status', 'pending')->count(),
                'approved' => $requests->where('status', 'approved')->count(),
                'rejected' => $requests->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function reject(AccessRequest $accessRequest)
    {
        $accessRequest->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Demande rejetée.');
    }
}
