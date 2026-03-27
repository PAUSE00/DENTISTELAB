<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $title }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 13px;
            line-height: 1.5;
        }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; }
        
        /* Header */
        .header {
            border-bottom: 2px solid #0d9488;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: table;
            width: 100%;
        }
        .header-left { display: table-cell; width: 50%; vertical-align: middle; }
        .header-right { display: table-cell; width: 50%; text-align: right; vertical-align: middle; }
        
        .logo-text { font-size: 26px; font-weight: 800; color: #0d9488; letter-spacing: -0.5px; margin-bottom: 4px; }
        .logo-sub { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        
        .ticket-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .ticket-date { font-size: 13px; color: #64748b; font-weight: 500; }
        
        /* Grid */
        .grid { display: table; width: 100%; margin-bottom: 30px; table-layout: fixed; }
        .col { display: table-cell; width: 50%; padding-right: 20px; }
        .col:last-child { padding-right: 0; padding-left: 20px; border-left: 1px solid #e2e8f0; }

        .section-title {
            font-size: 11px; font-weight: 700; color: #0d9488; text-transform: uppercase;
            letter-spacing: 1px; margin-bottom: 12px;
        }

        .info-row { margin-bottom: 10px; }
        .info-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
        .info-value { font-size: 14px; font-weight: 600; color: #0f172a; }

        .priority-badge {
            display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;
        }
        .priority-urgent { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .priority-normal { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

        /* Tables */
        .table-wrap { margin-bottom: 30px; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
        table.data-table { width: 100%; border-collapse: collapse; }
        table.data-table th {
            background-color: #f8fafc; color: #64748b; font-size: 10px; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        table.data-table td {
            padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 13px; font-weight: 500;
        }
        table.data-table tr:last-child td { border-bottom: none; }

        /* Notes Box */
        .notes-box {
            background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b;
            padding: 16px; border-radius: 4px; margin-bottom: 30px; font-size: 13px; color: #92400e;
        }
        .notes-box-title { font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: #b45309; }

        .internal-notes {
            background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #94a3b8;
            padding: 16px; border-radius: 4px; margin-bottom: 30px; font-size: 13px; color: #334155;
        }

        .footer {
            margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;
            text-align: center; font-size: 11px; color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="logo-text">{{ $order->lab->name ?? 'DentalLab Pro' }}</div>
                <div class="logo-sub">Laboratory Work Ticket</div>
            </div>
            <div class="header-right">
                <div class="ticket-title">Job Ticket #{{ $order->id }}</div>
                <div class="ticket-date">Issue Date: {{ $date }}</div>
            </div>
        </div>

        <!-- 2-Col Grid -->
        <div class="grid">
            <div class="col">
                <div class="section-title">Clinic Details</div>
                <div class="info-row">
                    <div class="info-label">Clinic Name</div>
                    <div class="info-value">{{ $order->clinic->name ?? 'N/A' }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Doctor / Owner</div>
                    <div class="info-value">Dr. {{ $order->clinic->owner->name ?? 'N/A' }}</div>
                </div>
                <div class="info-row" style="margin-bottom: 0;">
                    <div class="info-label">Address</div>
                    <div class="info-value">{{ $order->clinic->address ?? 'N/A' }}</div>
                </div>
            </div>
            <div class="col">
                <div class="section-title">Patient & Case Setup</div>
                <div class="info-row">
                    <div class="info-label">Patient Name</div>
                    <div class="info-value" style="color: #0d9488; font-size: 16px; font-weight: 800;">
                        {{ $order->patient->first_name }} {{ $order->patient->last_name }}
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">Due Date</div>
                    <div class="info-value">{{ \Carbon\Carbon::parse($order->due_date)->format('F j, Y') }}</div>
                </div>
                <div class="info-row" style="margin-bottom: 0;">
                    <div class="info-label" style="margin-bottom: 6px;">Priority</div>
                    <div class="priority-badge {{ $order->priority === 'urgent' ? 'priority-urgent' : 'priority-normal' }}">
                        {{ ucfirst($order->priority) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Specifications Table -->
        <div class="section-title">Prosthesis Specifications</div>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 25%">Service Type</th>
                        <th style="width: 45%">Selected Teeth</th>
                        <th style="width: 15%">Material</th>
                        <th style="width: 15%">Shade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="font-weight: 700; color: #0f172a;">{{ $order->service->name ?? 'Standard Procedure' }}</td>
                        <td>
                            @php
                                $teethData = $order->teeth;
                                $displayTeeth = '';
                                if (is_array($teethData)) {
                                    // If associative (e.g., [11 => "Extraction", 12 => "Implant"])
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
                            @endphp
                            <span style="color: #3b82f6; font-weight: 700;">{{ $displayTeeth ?: 'N/A' }}</span>
                        </td>
                        <td>{{ $order->material ?? '—' }}</td>
                        <td>{{ $order->shade ?? '—' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Instructions Section -->
        @if($order->instructions)
        <div class="notes-box">
            <div class="notes-box-title">Clinical Instructions & Remarks</div>
            <div>{{ $order->instructions }}</div>
        </div>
        @endif

        <!-- Internal Notes -->
        @if($order->notes)
        <div class="internal-notes">
            <div class="notes-box-title" style="color: #475569;">Internal / Laboratory Notes</div>
            <div>{{ $order->notes }}</div>
        </div>
        @endif

        <div class="footer">
            Generated by <strong>{{ $order->lab->name ?? 'DentalLab Pro' }}</strong> System &bull; {{ now()->format('F j, Y, g:i a') }}
        </div>
    </div>
</body>
</html>