<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 13px;
            line-height: 1.5;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }

        /* ----- Header ----- */
        .header {
            width: 100%;
            margin-bottom: 40px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
        }

        .logo-area {
            width: 50%;
        }

        .logo-text {
            font-size: 28px;
            font-weight: 800;
            color: #0ea5e9;
            letter-spacing: -0.5px;
            margin-bottom: 5px;
        }

        .invoice-title {
            width: 50%;
            text-align: right;
        }

        .invoice-title span.title {
            display: block;
            font-size: 36px;
            font-weight: 800;
            color: #f1f5f9;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-shadow: 1px 1px 0px #cbd5e1;
        }

        .invoice-meta {
            font-size: 12px;
            color: #64748b;
        }

        .invoice-meta strong {
            color: #334155;
            display: inline-block;
            width: 80px;
        }

        /* ----- Info Section ----- */
        .info-section {
            width: 100%;
            margin-bottom: 40px;
            border-collapse: separate;
            border-spacing: 20px 0;
            margin-left: -20px;
            margin-right: -20px;
        }

        .info-section td {
            width: 50%;
            vertical-align: top;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .info-label {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .info-name {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .info-details {
            font-size: 12px;
            color: #475569;
            line-height: 1.6;
        }

        /* ----- Order Details Section ----- */
        .order-details-box {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #22c55e;
            padding: 15px 20px;
            border-radius: 6px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
        }

        .order-details-table {
            width: 100%;
            border-collapse: collapse;
        }

        .order-details-table td {
            width: 33%;
            vertical-align: top;
        }

        .detail-item-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #166534;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .detail-item-value {
            font-size: 14px;
            color: #14532d;
            font-weight: 600;
        }

        /* ----- Items Table ----- */
        .items-section {
            margin-bottom: 40px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
        }

        .items-table th {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            padding: 12px 15px;
            border-bottom: 2px solid #cbd5e1;
            text-align: left;
        }

        .items-table th.right {
            text-align: right;
        }

        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .items-table td.right {
            text-align: right;
        }

        .item-name {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .item-desc {
            font-size: 12px;
            color: #64748b;
        }

        .item-price {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
        }

        /* ----- Totals ----- */
        .totals-section {
            width: 100%;
        }

        .totals-table {
            width: 300px;
            float: right;
            border-collapse: collapse;
        }

        .totals-table td {
            padding: 10px 15px;
            text-align: right;
            font-size: 13px;
        }

        .totals-table .totals-label {
            color: #64748b;
            font-weight: 600;
        }

        .totals-table .totals-value {
            color: #1e293b;
            font-weight: 600;
            width: 120px;
        }

        .totals-table .grand-total td {
            border-top: 2px solid #e2e8f0;
            font-size: 18px;
            font-weight: 800;
            color: #0ea5e9;
            padding-top: 15px;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        /* ----- Footer ----- */
        .footer {
            margin-top: 80px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
        }

        /* ----- Badges ----- */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-paid {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .badge-unpaid {
            background-color: #fef08a;
            color: #854d0e;
            border: 1px solid #fde047;
        }

        .badge-status {
            background-color: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <table class="header-table">
                <tr>
                    <td class="logo-area">
                        <div class="logo-text">DentalLab Pro</div>
                        <div style="font-size: 12px; color: #64748b;">Advanced Dental Solutions</div>
                    </td>
                    <td class="invoice-title">
                        <span class="title">Invoice</span>
                        <div class="invoice-meta">
                            <div><strong>Invoice No:</strong> INV-{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
                            <div><strong>Date:</strong> {{ $date }}</div>
                            <div><strong>Due Date:</strong> {{ $order->due_date ? \Carbon\Carbon::parse($order->due_date)->format('d/m/Y') : 'Upon Receipt' }}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Billed To & From -->
        <table class="info-section">
            <tr>
                <td>
                    <div class="info-label">Billed To (Clinic)</div>
                    <div class="info-name">{{ $order->clinic->name ?? 'N/A' }}</div>
                    <div class="info-details">
                        Dr. {{ $order->clinic->owner->name ?? 'N/A' }}<br>
                        Email: {{ $order->clinic->email ?? 'N/A' }}<br>
                        @if(isset($order->clinic->phone)) Phone: {{ $order->clinic->phone }}<br> @endif
                        @if(isset($order->clinic->address)) {{ $order->clinic->address }} @endif
                    </div>
                </td>
                <td>
                    <div class="info-label">Issued By (Laboratory)</div>
                    <div class="info-name">{{ $order->lab->name ?? 'N/A' }}</div>
                    <div class="info-details">
                        {{ $order->lab->owner->name ?? 'N/A' }}<br>
                        Email: {{ $order->lab->email ?? 'N/A' }}<br>
                        @if(isset($order->lab->phone)) Phone: {{ $order->lab->phone }}<br> @endif
                        @if(isset($order->lab->address)) {{ $order->lab->address }} @endif
                    </div>
                </td>
            </tr>
        </table>

        <!-- Order Snapshot -->
        <div class="order-details-box">
            <table class="order-details-table">
                <tr>
                    <td>
                        <div class="detail-item-label">Patient Ref.</div>
                        <div class="detail-item-value">{{ $order->patient->first_name ?? 'N/A' }} {{ $order->patient->last_name ?? '' }}</div>
                    </td>
                    <td>
                        <div class="detail-item-label">Order Status</div>
                        <div class="detail-item-value">
                            <span class="badge badge-status">{{ str_replace('_', ' ', $order->status->value ?? 'N/A') }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="detail-item-label">Payment Status</div>
                        <div class="detail-item-value">
                            @php
                            $statusStr = $order->payment_status?->value ?? 'unpaid';
                            @endphp
                            <span class="badge {{ strtolower($statusStr) === 'paid' ? 'badge-paid' : 'badge-unpaid' }}">
                                {{ ucfirst($statusStr) }}
                            </span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Line Items -->
        <div class="items-section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Specifications</th>
                        <th class="right text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="item-name">{{ $order->service->name ?? 'Custom Dental Service' }}</div>
                            @if($order->instructions)
                            <div class="item-desc" style="margin-top: 6px;">
                                <strong>Instructions:</strong> {{ $order->instructions }}
                            </div>
                            @endif
                        </td>
                        <td>
                            <div class="item-desc">
                                <strong>Teeth:</strong> {{ is_array($order->teeth) && count($order->teeth) > 0 ? implode(', ', $order->teeth) : 'N/A' }}<br>
                                @if($order->material) <strong>Material:</strong> {{ $order->material }}<br> @endif
                                @if($order->shade) <strong>Shade:</strong> {{ $order->shade }} @endif
                            </div>
                        </td>
                        <td class="right item-price">{{ $formatted_price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section clearfix">
            <table class="totals-table">
                <tr>
                    <td class="totals-label">Subtotal</td>
                    <td class="totals-value">{{ $formatted_price }}</td>
                </tr>
                <tr>
                    <td class="totals-label">Tax (0%)</td>
                    <td class="totals-value">0.00 DH</td>
                </tr>
                <tr class="grand-total">
                    <td class="totals-label">Total Amount</td>
                    <td class="totals-value">{{ $formatted_price }}</td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p style="margin-top: 5px;">If you have any questions concerning this invoice, please contact the laboratory directly or refer to the order chat in the portal.</p>
            <p style="margin-top: 15px; font-weight: bold; color: #cbd5e1;">&copy; {{ date('Y') }} DentalLab Portal. All rights reserved.</p>
        </div>
    </div>
</body>

</html>