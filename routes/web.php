<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Lab\OrderController;
use App\Http\Controllers\Lab\OrderNoteController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ── Invitation (public-ish — needs auth but any role can view) ───
Route::get('/invitation/{token}', [\App\Http\Controllers\InvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/{token}/accept', [\App\Http\Controllers\InvitationController::class, 'accept'])->middleware('auth')->name('invitation.accept');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if ($user->role === 'lab_owner' || $user->role === 'lab_tech') {
            return redirect()->route('lab.dashboard');
        } elseif ($user->role === 'dentist' || $user->role === 'clinic_staff') {
            return redirect()->route('clinic.dashboard');
        } elseif ($user->role === 'super_admin') {
            return redirect()->route('admin.dashboard');
        }

        abort(403, 'Unauthorized. Please check your account role.');
    })->name('dashboard');

    // ════════════════════════════════════════════════════════════
    // CLINIC ROUTES
    // ════════════════════════════════════════════════════════════
    Route::middleware('role:dentist|clinic_staff')->prefix('clinic')->name('clinic.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Clinic\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('patients', \App\Http\Controllers\Clinic\PatientController::class);
        Route::resource('orders', \App\Http\Controllers\Clinic\OrderController::class);
        Route::post('orders/{order}/upload', [\App\Http\Controllers\Clinic\OrderController::class, 'uploadFile'])->name('orders.upload');
        Route::delete('orders/{order}/files/{file}', [\App\Http\Controllers\Clinic\OrderController::class, 'deleteFile'])->name('orders.delete-file');
        Route::post('orders/{order}/duplicate', [\App\Http\Controllers\Clinic\OrderController::class, 'duplicate'])->name('orders.duplicate');
        Route::patch('orders/{order}/cancel', [\App\Http\Controllers\Clinic\OrderController::class, 'cancel'])->name('orders.cancel');

        // Bulk Operations
        Route::post('orders/bulk-cancel', [\App\Http\Controllers\Clinic\OrderController::class, 'bulkCancel'])->name('orders.bulk-cancel');
        Route::get('orders/bulk-export', [\App\Http\Controllers\Clinic\OrderController::class, 'bulkExport'])->name('orders.bulk-export');
        // Dentist Only Routes (Settings & Team)
        Route::middleware('role:dentist')->group(function () {
            Route::resource('team', \App\Http\Controllers\TeamController::class)->only(['index', 'store', 'destroy']);
            Route::get('settings', [\App\Http\Controllers\Clinic\SettingsController::class, 'index'])->name('settings.index');
            Route::patch('settings', [\App\Http\Controllers\Clinic\SettingsController::class, 'update'])->name('settings.update');
        });
    });

    // ════════════════════════════════════════════════════════════
    // LAB ROUTES
    // ════════════════════════════════════════════════════════════
    Route::middleware('role:lab_owner|lab_tech')->prefix('lab')->name('lab.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Lab\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/analytics', [\App\Http\Controllers\Lab\AnalyticsController::class, 'index'])->name('analytics.index')->middleware('role:lab_owner');

        // Orders
        Route::resource('orders', \App\Http\Controllers\Lab\OrderController::class)->only(['index', 'show']);
        Route::patch('orders/{order}/status', [\App\Http\Controllers\Lab\OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::patch('orders/{order}/payment', [\App\Http\Controllers\Lab\OrderController::class, 'updatePaymentStatus'])->name('orders.update-payment')->middleware('role:lab_owner');
        Route::post('orders/{order}/upload', [\App\Http\Controllers\Lab\OrderController::class, 'uploadFile'])->name('orders.upload');
        Route::delete('orders/{order}/files/{file}', [\App\Http\Controllers\Lab\OrderController::class, 'deleteFile'])->name('orders.delete-file');

        // Bulk Operations
        Route::post('orders/bulk-status', [\App\Http\Controllers\Lab\OrderController::class, 'bulkUpdateStatus'])->name('orders.bulk-status');

        // Order Notes (lab-only internal notes)
        Route::get('orders/{order}/notes', [\App\Http\Controllers\Lab\OrderNoteController::class, 'index'])->name('orders.notes.index');
        Route::post('orders/{order}/notes', [\App\Http\Controllers\Lab\OrderNoteController::class, 'store'])->name('orders.notes.store');
        Route::delete('orders/{order}/notes/{note}', [\App\Http\Controllers\Lab\OrderNoteController::class, 'destroy'])->name('orders.notes.destroy');

        // Services
        Route::resource('services', \App\Http\Controllers\Lab\ServiceController::class)->middleware('role:lab_owner');

        // Clients (Invitations)
        Route::get('clients', [\App\Http\Controllers\Lab\ClientController::class, 'index'])->name('clients.index')->middleware('role:lab_owner');
        Route::post('clients/invite', [\App\Http\Controllers\Lab\ClientController::class, 'invite'])->name('clients.invite')->middleware('role:lab_owner');
        Route::delete('clients/{clinic}', [\App\Http\Controllers\Lab\ClientController::class, 'revoke'])->name('clients.revoke')->middleware('role:lab_owner');
        Route::delete('invitations/{invitation}', [\App\Http\Controllers\Lab\ClientController::class, 'cancelInvitation'])->name('invitations.cancel')->middleware('role:lab_owner');

        // Finance
        Route::get('finance', [\App\Http\Controllers\Lab\FinanceController::class, 'index'])->name('finance.index')->middleware('role:lab_owner');
        Route::patch('finance/clinic/{clinic}/pay', [\App\Http\Controllers\Lab\FinanceController::class, 'markClinicPaid'])->name('finance.clinic.pay')->middleware('role:lab_owner');

        // Team
        Route::resource('team', \App\Http\Controllers\TeamController::class)->only(['index', 'store', 'destroy'])->middleware('role:lab_owner');

        // Settings
        Route::get('settings', [\App\Http\Controllers\Lab\SettingsController::class, 'index'])->name('settings.index')->middleware('role:lab_owner');
        Route::patch('settings', [\App\Http\Controllers\Lab\SettingsController::class, 'update'])->name('settings.update')->middleware('role:lab_owner');

        // CSV Export
        Route::get('export/orders', [\App\Http\Controllers\Lab\ExportController::class, 'orders'])->name('export.orders');
        Route::get('export/finance', [\App\Http\Controllers\Lab\ExportController::class, 'finance'])->name('export.finance')->middleware('role:lab_owner');
    });

    // ════════════════════════════════════════════════════════════
    // ADMIN ROUTES
    // ════════════════════════════════════════════════════════════
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::patch('clinics/{clinic}/toggle-active', [\App\Http\Controllers\Admin\ClinicController::class, 'toggleActive'])->name('clinics.toggle-active');
        Route::resource('clinics', \App\Http\Controllers\Admin\ClinicController::class);

        Route::patch('labs/{lab}/toggle-active', [\App\Http\Controllers\Admin\LabController::class, 'toggleActive'])->name('labs.toggle-active');
        Route::resource('labs', \App\Http\Controllers\Admin\LabController::class);

        Route::patch('users/{user}/toggle-active', [\App\Http\Controllers\Admin\UserController::class, 'toggleActive'])->name('users.toggle-active');
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    });
});

// ── Authenticated Routes (any role) ──────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Locale switching
    Route::post('/locale', [\App\Http\Controllers\LocaleController::class, 'update'])->name('locale.update');

    // Chat
    Route::get('orders/{order}/messages', [\App\Http\Controllers\ChatController::class, 'index'])->middleware('throttle:chat')->name('chat.index');
    Route::post('orders/{order}/messages', [\App\Http\Controllers\ChatController::class, 'store'])->middleware('throttle:chat')->name('chat.store');
    Route::post('orders/{order}/messages/read', [\App\Http\Controllers\ChatController::class, 'markAsRead'])->name('chat.read');

    // Invoice & Job Ticket
    Route::get('orders/{order}/invoice', [\App\Http\Controllers\InvoiceController::class, 'download'])->name('orders.invoice');
    Route::get('orders/{order}/job-ticket', [\App\Http\Controllers\JobTicketController::class, 'download'])->name('orders.job-ticket');

    // Notifications API
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::get('notifications/recent', [\App\Http\Controllers\NotificationController::class, 'recent'])->name('notifications.recent');
    Route::patch('notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

require __DIR__ . '/auth.php';
