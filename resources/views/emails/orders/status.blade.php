@component('mail::message')
# Order Status Updated

Hello,

The status of your order **#{{ $order->id }}** has been updated to **{{ $order->status->label() }}**.

**Service:** {{ $order->service->name }} <br>
**Patient:** {{ $order->patient->first_name }} {{ $order->patient->last_name }}

@component('mail::button', ['url' => route('clinic.orders.show', $order->id)])
View Order
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent