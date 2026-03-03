@component('mail::message')
# New Order Received

Hello,

You have received a new order **#{{ $order->id }}** from **{{ $order->clinic->name }}**.

**Patient Name:** {{ $order->patient->first_name }} {{ $order->patient->last_name }} <br>
**Service:** {{ $order->service->name }} <br>
**Due Date:** {{ \Carbon\Carbon::parse($order->due_date)->format('M d, Y') }}

@component('mail::button', ['url' => route('lab.orders.show', $order->id)])
View Order
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent