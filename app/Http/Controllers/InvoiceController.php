<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    public function download(Order $order)
    {
        $this->authorizeOrderAccess($order);

        $order->load(['clinic', 'lab', 'patient', 'service']);

        $price = $order->final_price ?? $order->service->price ?? 0;

        $data = [
            'order' => $order,
            'title' => 'Facture #' . $order->id,
            'date' => $order->created_at->format('d/m/Y'),
            'price' => $price,
            'formatted_price' => number_format($price, 2) . ' DH',
        ];

        $pdf = Pdf::loadView('invoices.order', $data);

        return $pdf->download('facture-' . $order->id . '.pdf');
    }

    private function authorizeOrderAccess(Order $order)
    {
        $this->authorize('view', $order);
    }
}
