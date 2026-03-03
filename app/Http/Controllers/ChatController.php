<?php

namespace App\Http\Controllers;

use App\Events\OrderMessageSent;
use App\Services\NotificationService;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function index(Order $order)
    {
        // Ensure user is authorized to view this order
        $this->authorizeOrderAccess($order);

        // Mark unread messages from other users as read
        $order->messages()
            ->whereNull('read_at')
            ->where('user_id', '!=', Auth::id())
            ->update(['read_at' => now()]);

        // After this point, if we want to notify the other user that messages were read, 
        // we'd broadcast a MessageRead event. For now, we just mark them read in DB.

        return $order->messages()
            ->with(['user' => function ($query) {
                // Ensure we get the user data properly including profile paths if any in future
                $query->select('id', 'name'); 
            }])
            ->orderBy('created_at', 'asc') // Oldest first for chat history
            ->get();
    }

    public function store(Request $request, Order $order)
    {
        $this->authorizeOrderAccess($order);

        $validated = $request->validate([
            'content' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if (empty($validated['content']) && !$request->hasFile('attachment')) {
            return response()->json(['message' => 'Message or attachment is required.'], 422);
        }

        $messageData = [
            'user_id' => Auth::id(),
            'content' => $validated['content'] ?? null,
        ];

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('messages/' . $order->id, 'public');
            $messageData['attachment_path'] = $path;
            
            // If no text content, set a default indication
            if (empty($messageData['content'])) {
                $messageData['content'] = '📎 Attachment: ' . $file->getClientOriginalName();
            }
        }

        $message = $order->messages()->create($messageData);

        // Load user for the event payload
        $message->load('user');

        // Trigger in-app notification to the relevant parties
        NotificationService::newMessage($order, Auth::user());

        broadcast(new OrderMessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    // This method could be called via a polling or specialized endpoint
    public function markAsRead(Order $order)
    {
        $this->authorizeOrderAccess($order);
        
        $order->messages()
            ->whereNull('read_at')
            ->where('user_id', '!=', Auth::id())
            ->update(['read_at' => now()]);
            
        return response()->json(['status' => 'success']);
    }

    private function authorizeOrderAccess(Order $order)
    {
        $user = Auth::user();

        if (in_array($user->role, ['dentist', 'clinic_staff']) && $order->clinic_id !== $user->clinic_id) {
            abort(403, 'Unauthorized access to order chat.');
        }

        if (in_array($user->role, ['lab_owner', 'lab_tech']) && $order->lab_id !== $user->lab_id) {
            abort(403, 'Unauthorized access to order chat.');
        }

        // super_admin can access all
    }
}
