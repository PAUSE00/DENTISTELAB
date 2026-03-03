<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export orders as CSV.
     */
    public function orders(Request $request): StreamedResponse
    {
        $orders = Order::with(['patient', 'service'])
            ->where('lab_id', Auth::user()->lab_id)
            ->latest()
            ->get();

        return new StreamedResponse(function () use ($orders) {
            $handle = fopen('php://output', 'w');

            // Header row
            fputcsv($handle, [
                'ID',
                'Patient',
                'Service',
                'Status',
                'Priority',
                'Due Date',
                'Material',
                'Shade',
                'Teeth',
                'Created At',
            ]);

            // Data rows
            foreach ($orders as $order) {
                fputcsv($handle, [
                    $order->id,
                    $order->patient ? $order->patient->first_name . ' ' . $order->patient->last_name : 'N/A',
                    $order->service ? $order->service->name : 'N/A',
                    $order->status,
                    $order->priority,
                    $order->due_date,
                    $order->material,
                    $order->shade,
                    is_array($order->teeth) ? implode('-', $order->teeth) : ($order->teeth ?? ''),
                    $order->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders_export_' . date('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Export finance data as CSV.
     */
    public function finance(Request $request): StreamedResponse
    {
        $orders = Order::with(['patient', 'service', 'clinic'])
            ->where('lab_id', Auth::user()->lab_id)
            ->whereNotNull('price')
            ->latest()
            ->get();

        return new StreamedResponse(function () use ($orders) {
            $handle = fopen('php://output', 'w');

            // Header row
            fputcsv($handle, [
                'ID',
                'Clinic',
                'Patient',
                'Service',
                'Price (MAD)',
                'Payment Status',
                'Status',
                'Due Date',
                'Created At',
            ]);

            // Data rows
            foreach ($orders as $order) {
                fputcsv($handle, [
                    $order->id,
                    $order->clinic ? $order->clinic->name : 'N/A',
                    $order->patient ? $order->patient->first_name . ' ' . $order->patient->last_name : 'N/A',
                    $order->service ? $order->service->name : 'N/A',
                    number_format($order->price, 2),
                    $order->payment_status ?? 'unpaid',
                    $order->status,
                    $order->due_date,
                    $order->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="finance_export_' . date('Y-m-d') . '.csv"',
        ]);
    }
}
