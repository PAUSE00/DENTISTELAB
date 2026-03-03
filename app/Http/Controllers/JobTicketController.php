<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JobTicketController extends Controller
{
    /**
     * Generate and download the Job Ticket PDF for an order.
     */
    public function download(Order $order)
    {
        // 1. Authorization: Ensure user can view this order
        // This logic mirrors the OrderPolicy or controller checks
        $user = auth()->user();

        $authorized = false;

        if ($user->role === 'super_admin') {
            $authorized = true;
        } elseif (in_array($user->role, ['lab_owner', 'lab_tech']) && $user->lab_id === $order->lab_id) {
            $authorized = true;
        } elseif (in_array($user->role, ['dentist', 'clinic_staff']) && $user->clinic_id === $order->clinic_id) {
            $authorized = true;
        }

        if (!$authorized) {
            abort(403, 'Unauthorized action.');
        }

        // 2. Load relationships needed for the PDF
        $order->load(['clinic.owner', 'lab', 'patient', 'service']);

        // 3. Prepare data for the view
        $data = [
            'order' => $order,
            'title' => 'Job Ticket #' . $order->id,
            'date' => now()->format('d/m/Y'),
        ];

        // 4. Generate PDF
        $pdf = Pdf::loadView('pdf.job-ticket', $data);

        // Optional: Set paper size to A5 or A4
        $pdf->setPaper('a4', 'portrait');

        // 5. Download the file
        return $pdf->download('JobTicket_' . $order->id . '.pdf');
    }
}
