<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        $clinicId = Auth::user()->clinic_id;

        // Get orders that have messages, ordered by the latest message
        $conversations = Order::where('clinic_id', $clinicId)
            ->whereHas('messages')
            ->with(['lab:id,name', 'patient:id,first_name,last_name'])
            ->withCount(['messages as unread_count' => function ($query) {
                $query->whereNull('read_at')
                      ->where('user_id', '!=', Auth::id());
            }])
            ->addSelect([
                'latest_message_at' => \App\Models\Message::select('created_at')
                    ->whereColumn('order_id', 'orders.id')
                    ->latest()
                    ->take(1)
            ])
            ->addSelect([
                'latest_message_content' => \App\Models\Message::select('content')
                    ->whereColumn('order_id', 'orders.id')
                    ->latest()
                    ->take(1)
            ])
            ->orderByDesc('latest_message_at')
            ->paginate(50);

        return Inertia::render('Clinic/Inbox/Index', [
            'conversations' => $conversations,
        ]);
    }
}
