<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderNoteController extends Controller
{
    /**
     * List notes for an order.
     */
    public function index($orderId)
    {
        $order = Order::where('lab_id', Auth::user()->lab_id)->findOrFail($orderId);

        return response()->json([
            'notes' => $order->notes()->with('user:id,name')->get(),
        ]);
    }

    /**
     * Store a new note.
     */
    public function store(Request $request, $orderId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $order = Order::where('lab_id', Auth::user()->lab_id)->findOrFail($orderId);

        $order->notes()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Note added.');
    }

    /**
     * Delete a note (only own notes).
     */
    public function destroy($orderId, $noteId)
    {
        $order = Order::where('lab_id', Auth::user()->lab_id)->findOrFail($orderId);
        $note = $order->notes()->where('id', $noteId)->firstOrFail();

        // Only the author or lab_owner can delete
        if ($note->user_id !== Auth::id() && Auth::user()->role !== 'lab_owner') {
            abort(403, 'You can only delete your own notes.');
        }

        $note->delete();

        return redirect()->back()->with('success', 'Note deleted.');
    }
}
