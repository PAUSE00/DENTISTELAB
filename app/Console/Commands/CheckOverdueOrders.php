<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Notifications\OrderOverdueNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckOverdueOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for overdue orders and notifies clinics and labs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for overdue orders...');

        // Find orders that are active (not delivered, not archived, not rejected) and past due date
        // Note: the scopeActive() excludes archived and rejected, we also exclude delivered.
        $overdueOrders = Order::active()
            ->where('status', '!=', 'delivered')
            ->whereDate('due_date', '<', Carbon::today())
            ->get();

        $notifiedCount = 0;

        foreach ($overdueOrders as $order) {
            // Note: In a production app, we would track if we have already sent the overdue notification today 
            // by checking the delayed jobs or a flag on the order table. 
            // For now, we will notify them when the command runs.

            // Notify the clinic owner (dentist)
            if ($order->clinic && $order->clinic->owner) {
                $order->clinic->owner->notify(new OrderOverdueNotification($order));
            }

            // Notify the lab owner
            if ($order->lab && $order->lab->owner) {
                $order->lab->owner->notify(new OrderOverdueNotification($order));
            }

            $notifiedCount++;
        }

        $this->info("Found and notified for {$notifiedCount} overdue orders.");
    }
}
