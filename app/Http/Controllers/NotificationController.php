<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get recent notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $query = Notification::forUser(Auth::id())->latest();

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by read status
        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->unread();
            } elseif ($request->status === 'read') {
                $query->whereNotNull('read_at');
            }
        }

        $notifications = $query->paginate(20)->withQueryString();

        // Get the user role to pick the right layout
        $user = Auth::user();
        $layout = in_array($user->role, ['lab_owner', 'lab_tech']) ? 'lab' : (in_array($user->role, ['dentist', 'clinic_staff']) ? 'clinic' : 'admin');

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'filters' => [
                'type' => $request->type,
                'status' => $request->status,
            ],
            'userLayout' => $layout,
        ]);
    }

    /**
     * Get unread count (for the navbar bell).
     */
    public function unreadCount()
    {
        $count = Notification::forUser(Auth::id())
            ->unread()
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get recent notifications (for dropdown).
     */
    public function recent()
    {
        $notifications = Notification::forUser(Auth::id())
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => Notification::forUser(Auth::id())->unread()->count(),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead($id)
    {
        $notification = Notification::forUser(Auth::id())->findOrFail($id);
        $notification->markAsRead();

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Notification::forUser(Auth::id())
            ->unread()
            ->update(['read_at' => now()]);

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
