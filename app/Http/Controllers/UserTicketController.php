<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTicketController extends Controller
{
    private function getViewPrefix()
    {
        return request()->routeIs('clinic.*') ? 'Clinic' : 'Lab';
    }

    private function getRoutePrefix()
    {
        return request()->routeIs('clinic.*') ? 'clinic.' : 'lab.';
    }

    public function index(Request $request)
    {
        $tickets = $request->user()->tickets()->latest()->paginate(20);

        return Inertia::render($this->getViewPrefix() . '/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function create()
    {
        return Inertia::render($this->getViewPrefix() . '/Tickets/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:bug,billing,feature_request,general',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'message' => 'required|string'
        ]);

        $ticket = $request->user()->tickets()->create([
            'subject' => $request->subject,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'open'
        ]);

        $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'is_admin_reply' => false
        ]);

        return redirect()->route($this->getRoutePrefix() . 'tickets.show', $ticket->id)
                         ->with('success', 'Support ticket created successfully.');
    }

    public function show(Ticket $ticket)
    {
        if ($ticket->user_id !== request()->user()->id) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        $ticket->load(['user', 'messages.user']);

        return Inertia::render($this->getViewPrefix() . '/Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== request()->user()->id) {
            abort(403);
        }

        $request->validate(['message' => 'required|string']);

        $ticket->messages()->create([
            'user_id' => request()->user()->id,
            'message' => $request->message,
            'is_admin_reply' => false
        ]);

        // If the ticket was resolved/closed, user replying re-opens it.
        if (in_array($ticket->status, ['resolved', 'closed'])) {
            $ticket->update(['status' => 'open']);
        }

        event(new \App\Events\TicketMessageSent($ticket->id));

        return back()->with('success', 'Reply sent successfully.');
    }
}
