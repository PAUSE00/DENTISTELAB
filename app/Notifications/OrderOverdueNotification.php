<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderOverdueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Action Required: Order Overdue #' . $this->order->id)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('The order #' . $this->order->id . ' is now overdue.')
            ->line('Due Date: ' . $this->order->due_date->format('M d, Y'))
            ->line('Current Status: ' . $this->order->status->value)
            ->action('View Order', url('/login'))
            ->line('Please review this order as soon as possible.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'message' => 'Order #' . $this->order->id . ' is overdue.',
            'type' => 'overdue',
        ];
    }
}
