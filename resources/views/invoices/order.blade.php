<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Helvetica, Arial, sans-serif; /* DOMPDF compatible */
            color: #334155;
            background-color: #ffffff;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            padding: 20px;
        }

        /* ----- Header ----- */
        .header-table {
            width: 100%;
            border-bottom: 2px solid #0d9488;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header-table td { vertical-align: top; }
        .logo-area { width: 50%; }
        .logo-text { font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 2px; }
        .logo-text span { color: #0d9488; }
        .logo-sub { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;}
        
        .invoice-title-area { width: 50%; text-align: right; }
        .invoice-title-text { font-size: 22px; font-weight: bold; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        
        .invoice-meta-table { width: auto; float: right; }
        .invoice-meta-table td { padding: 2px 0; text-align: right; }
        .invoice-meta-label { font-weight: bold; color: #475569; padding-right: 8px; font-size: 10px; }
        .invoice-meta-val { color: #0f172a; font-size: 11px; }

        /* ----- Info Section ----- */
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-td { width: 48%; vertical-align: top; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
        .info-spacer { width: 4%; }
        
        .info-label { font-size: 9px; font-weight: bold; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .info-name { font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
        .info-details { font-size: 11px; color: #475569; line-height: 1.5; }

        /* ----- Order Summary Box ----- */
        .summary-box {
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #0d9488;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .summary-table { width: 100%; }
        .summary-table td { width: 33.33%; padding: 12px 15px; vertical-align: top; border-right: 1px solid #e2e8f0; }
        .summary-table td:last-child { border-right: none; }
        
        .summary-item-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
        .summary-item-value { font-size: 12px; color: #0f172a; font-weight: bold; }
        
        .text-teal { color: #0d9488; }

        /* ----- Items Table ----- */
        .items-section { border: 1px solid #e2e8f0; margin-bottom: 20px; border-radius: 4px; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th {
            background-color: #f1f5f9; font-size: 10px; text-transform: uppercase; font-weight: bold; color: #475569; padding: 12px 15px; text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .items-table th.right { text-align: right; }
        .items-table td { padding: 15px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .items-table tr:last-child td { border-bottom: none; }
        .items-table td.right { text-align: right; }
        
        .item-name { font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
        .item-desc { font-size: 11px; color: #64748b; line-height: 1.4; }
        .item-price { font-size: 12px; font-weight: bold; color: #0f172a; }

        /* ----- Totals ----- */
        .totals-table { width: 250px; float: right; border-collapse: collapse; }
        .totals-table td { padding: 8px 10px; text-align: right; font-size: 11px; }
        .totals-label { color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 9px; }
        .totals-value { color: #0f172a; font-weight: bold; width: 100px; }
        .totals-table .grand-total td { border-top: 2px solid #0f172a; font-size: 14px; color: #0d9488; padding-top: 12px; font-weight: bold; }
        
        .clearfix::after { content: ""; clear: both; display: table; }

        /* ----- Footer ----- */
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #64748b;
        }

        /* ----- Badges ----- */
        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .badge-paid { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .badge-unpaid { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-status { background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table class="header-table">
            <tr>
                <td class="logo-area">
                    <div class="logo-text">Dental<span>Lab</span></div>
                    <div class="logo-sub">Advanced Dental Prosthetics</div>
                </td>
                <td class="invoice-title-area">
                    <div class="invoice-title-text">Invoice</div>
                    <table class="invoice-meta-table">
                        <tr>
                            <td class="invoice-meta-label">Invoice No:</td>
                            <td class="invoice-meta-val">INV-{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</td>
                        </tr>
                        <tr>
                            <td class="invoice-meta-label">Date:</td>
                            <td class="invoice-meta-val">{{ $date }}</td>
                        </tr>
                        <tr>
                            <td class="invoice-meta-label">Due Date:</td>
                            <td class="invoice-meta-val">{{ $order->due_date ? \Carbon\Carbon::parse($order->due_date)->format('M d, Y') : 'Upon Receipt' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Billed To & From -->
        <table class="info-table">
            <tr>
                <td class="info-td">
                    <div class="info-label">Billed To (Clinic)</div>
                    <div class="info-name">{{ $order->clinic->name ?? 'N/A' }}</div>
                    <div class="info-details">
                        Attn: Dr. {{ $order->clinic->owner->name ?? 'N/A' }}<br>
                        Email: {{ $order->clinic->email ?? 'N/A' }}<br>
                        @if(isset($order->clinic->phone)) Phone: {{ $order->clinic->phone }}<br> @endif
                        @if(isset($order->clinic->address)) {{ $order->clinic->address }} @endif
                    </div>
                </td>
                <td class="info-spacer"></td>
                <td class="info-td">
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
        <div class="summary-box">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-item-label">Patient Ref</div>
                        <div class="summary-item-value text-teal">{{ $order->patient->first_name ?? 'N/A' }} {{ $order->patient->last_name ?? '' }}</div>
                    </td>
                    <td>
                        <div class="summary-item-label">Order Status</div>
                        <div class="summary-item-value">
                            <span class="badge badge-status">{{ str_replace('_', ' ', $order->status->value ?? 'N/A') }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="summary-item-label">Payment Status</div>
                        <div class="summary-item-value">
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
                        <th style="width: 35%">Description</th>
                        <th style="width: 45%">Specifications</th>
                        <th class="right" style="width: 20%">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="item-name">{{ $order->service->name ?? 'Custom Dental Service' }}</div>
                            @if($order->instructions)
                            <div class="item-desc" style="margin-top: 6px;">
                                <strong>Notes:</strong> {{ $order->instructions }}
                            </div>
                            @endif
                        </td>
                        <td>
                            <div class="item-desc">
                                @php
                                    $teethData = $order->teeth;
                                    $displayTeeth = '';
                                    if (is_array($teethData)) {
                                        $isAssoc = array_keys($teethData) !== range(0, count($teethData) - 1);
                                        if ($isAssoc) {
                                            $arr = [];
                                            foreach($teethData as $k => $v) { $arr[] = $k . " ($v)"; }
                                            $displayTeeth = implode(', ', $arr);
                                        } else {
                                            $displayTeeth = implode(', ', $teethData);
                                        }
                                    } else {
                                        $displayTeeth = $teethData;
                                    }
                                    if (empty($displayTeeth)) $displayTeeth = 'N/A';
                                @endphp
                                <strong>Teeth:</strong> {{ $displayTeeth }}<br>
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
        <div class="clearfix">
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
            <p style="font-weight: bold; color: #334155; margin-bottom: 4px;">Thank you for your business.</p>
            <p style="margin-bottom: 8px;">If you have any questions concerning this invoice, please contact the laboratory directly.</p>
            <p>&copy; {{ date('Y') }} DentalLab Portal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>