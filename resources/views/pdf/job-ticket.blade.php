<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.4;
            font-size: 12px;
        }

        .header {
            width: 100%;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0d9488;
            /* Mint Green Dark */
            float: left;
        }

        .ticket-info {
            float: right;
            text-align: right;
        }

        .ticket-id {
            font-size: 18px;
            font-weight: bold;
        }

        .section {
            margin-bottom: 20px;
            clear: both;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            margin-bottom: 10px;
            padding-bottom: 5px;
            text-transform: uppercase;
            color: #555;
        }

        .info-grid {
            width: 100%;
            display: table;
        }

        .col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            color: #777;
            font-size: 10px;
            text-transform: uppercase;
        }

        .value {
            margin-bottom: 10px;
            font-size: 13px;
        }

        .teeth-grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .teeth-grid th,
        .teeth-grid td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .teeth-grid th {
            background-color: #f9fafb;
            font-size: 11px;
            text-transform: uppercase;
        }

        .notes {
            background-color: #f9fafb;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 4px;
            font-style: italic;
        }

        .footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            height: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo">
            DentalLab
        </div>
        <div class="ticket-info">
            <div class="ticket-id">{{ $title }}</div>
            <div>Date: {{ $date }}</div>
        </div>
    </div>

    <!-- Info Section -->
    <div class="section">
        <div class="info-grid">
            <div class="col">
                <div class="section-title">Clinic Details</div>
                <div class="label">Clinic Name</div>
                <div class="value">{{ $order->clinic->name ?? 'N/A' }}</div>

                <div class="label">Doctor / Owner</div>
                <div class="value">{{ $order->clinic->owner->name ?? 'N/A' }}</div>

                <div class="label">Address</div>
                <div class="value">{{ $order->clinic->address ?? 'N/A' }}</div>
            </div>
            <div class="col">
                <div class="section-title">Patient / Case</div>
                <div class="label">Patient Name</div>
                <div class="value">{{ $order->patient->first_name }} {{ $order->patient->last_name }}</div>

                <div class="label">Due Date</div>
                <div class="value">{{ \Carbon\Carbon::parse($order->due_date)->format('d/m/Y') }}</div>

                <div class="label">Priority</div>
                <div class="value" style="color: {{ $order->priority === 'urgent' ? 'red' : 'black' }}">
                    {{ ucfirst($order->priority) }}
                </div>
            </div>
        </div>
    </div>

    <!-- Specifications Section -->
    <div class="section">
        <div class="section-title">Prosthesis Specifications</div>
        <table class="teeth-grid">
            <thead>
                <tr>
                    <th>Service Type</th>
                    <th>Teeth Number(s)</th>
                    <th>Shade</th>
                    <th>Material</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $order->service->name ?? 'Standard' }}</td>
                    <td>{{ is_array($order->teeth) ? implode(', ', $order->teeth) : $order->teeth }}</td>
                    <td>{{ $order->shade }}</td>
                    <td>{{ $order->material }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Instructions Section -->
    <div class="section">
        <div class="section-title">Special Instructions</div>
        <div class="notes">
            {{ $order->instructions ?? 'No special instructions provided.' }}
        </div>
    </div>

    <!-- Notes Section (Backend Internal) -->
    @if($order->notes)
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="notes">
            {{ $order->notes }}
        </div>
    </div>
    @endif

    <div class="footer">
        Generated by DentalLab Platform on {{ now()->format('d/m/Y H:i') }}
    </div>
</body>

</html>