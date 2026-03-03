<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Clinic;
use App\Models\Invitation;
use App\Models\Lab;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with rich demo data.
     */
    public function run(): void
    {
        $this->command->info('🦷 Seeding DentalLab demo data...');

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 0. SUPER ADMIN
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating super admin...');
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@dentallab.com',
            'role' => 'super_admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'locale' => 'en',
        ]);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 1. LAB + LAB OWNER
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating lab and lab team...');

        $labOwner = User::create([
            'name' => 'Karim Lahlou',
            'email' => 'lab@dentallab.com',
            'role' => 'lab_owner',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'locale' => 'fr',
        ]);

        $lab = Lab::create([
            'name' => 'ProDent Lab Casablanca',
            'email' => 'contact@prodentlab.ma',
            'phone' => '0522-334455',
            'address' => '45 Rue Ibn Sina, Maarif, Casablanca',
            'description' => 'Laboratoire de prothèse dentaire spécialisé en zircone et céramique pressée.',
            'terms' => 'Paiement à 30 jours. Livraison sous 5-10 jours ouvrables.',
            'is_active' => true,
            'owner_id' => $labOwner->id,
        ]);

        $labOwner->update(['lab_id' => $lab->id]);

        // Lab team members
        $labTech1 = User::create([
            'name' => 'Youssef Amrani',
            'email' => 'youssef@prodentlab.ma',
            'role' => 'lab_tech',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'lab_id' => $lab->id,
            'locale' => 'fr',
        ]);

        $labTech2 = User::create([
            'name' => 'Fatima Zohra',
            'email' => 'fatima@prodentlab.ma',
            'role' => 'lab_tech',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'lab_id' => $lab->id,
            'locale' => 'fr',
        ]);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 2. SERVICES
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating services...');

        $services = collect([
            ['name' => 'Couronne Zircone', 'price' => 1500, 'production_days' => 7],
            ['name' => 'Couronne Céramo-Métallique', 'price' => 900, 'production_days' => 5],
            ['name' => 'Bridge 3 Éléments Zircone', 'price' => 4200, 'production_days' => 10],
            ['name' => 'Facette Emax', 'price' => 2000, 'production_days' => 8],
            ['name' => 'Inlay/Onlay Céramique', 'price' => 1200, 'production_days' => 5],
            ['name' => 'Prothèse Amovible Complète', 'price' => 4000, 'production_days' => 14],
            ['name' => 'Prothèse Partielle Stellite', 'price' => 2800, 'production_days' => 10],
            ['name' => 'Gouttière Orthodontique', 'price' => 1800, 'production_days' => 5],
            ['name' => 'Couronne sur Implant', 'price' => 2800, 'production_days' => 8],
            ['name' => 'Provisoire Résine', 'price' => 400, 'production_days' => 2],
        ])->map(fn($s) => Service::create(array_merge($s, [
            'lab_id' => $lab->id,
            'description' => "Service professionnel de prothèse dentaire.",
            'is_active' => true,
        ])));

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 3. CLINICS + DENTISTS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating clinics and doctors...');

        $clinicsData = [
            ['clinic_name' => 'Cabinet Dr. Alami', 'doctor' => 'Dr. Ahmed Alami', 'email' => 'alami@cabinet.ma'],
            ['clinic_name' => 'Cabinet Dr. Bennani', 'doctor' => 'Dr. Sara Bennani', 'email' => 'bennani@cabinet.ma'],
            ['clinic_name' => 'Centre Dentaire Rabat', 'doctor' => 'Dr. Omar El Fassi', 'email' => 'elfassi@dentaire.ma'],
        ];

        $clinics = collect();
        $dentists = collect();

        foreach ($clinicsData as $cd) {
            $clinic = Clinic::create([
                'name' => $cd['clinic_name'],
                'email' => $cd['email'],
                'phone' => '05' . fake()->numerify('########'),
                'address' => fake()->address(),
                'is_active' => true,
            ]);

            // Link clinic to lab
            DB::table('clinic_lab')->insert([
                'clinic_id' => $clinic->id,
                'lab_id' => $lab->id,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $dentist = User::create([
                'name' => $cd['doctor'],
                'email' => $cd['email'],
                'role' => 'dentist',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'clinic_id' => $clinic->id,
                'locale' => 'fr',
            ]);

            $clinics->push($clinic);
            $dentists->push($dentist);
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 4. PATIENTS (8-12 per clinic)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating patients...');

        $patients = collect();
        foreach ($clinics as $clinic) {
            $count = fake()->numberBetween(8, 12);
            for ($i = 0; $i < $count; $i++) {
                $patients->push(Patient::create([
                    'clinic_id' => $clinic->id,
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'dob' => fake()->dateTimeBetween('-70 years', '-15 years'),
                    'phone' => '06' . fake()->numerify('########'),
                    'email' => fake()->optional(0.5)->safeEmail(),
                    'external_id' => 'PR-' . fake()->unique()->numerify('####'),
                    'medical_notes' => fake()->optional(0.3)->sentence(8),
                ]));
            }
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 5. ORDERS (40-50 orders spread across clinics)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating orders with status history...');

        $shades = ['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'C1', 'C2', 'D2'];
        $materials = ['Zircone', 'Emax', 'Céramo-Métallique', 'Composite', 'PMMA'];
        $allTeeth = array_merge(range(11, 18), range(21, 28), range(31, 38), range(41, 48));

        $statusWeights = [
            OrderStatus::New->value => 5,
            OrderStatus::InProgress->value => 10,
            OrderStatus::Fitting->value => 4,
            OrderStatus::Finished->value => 8,
            OrderStatus::Shipped->value => 5,
            OrderStatus::Delivered->value => 12,
            OrderStatus::Rejected->value => 2,
            OrderStatus::Archived->value => 4,
        ];

        // Build weighted array
        $weightedStatuses = [];
        foreach ($statusWeights as $status => $weight) {
            for ($i = 0; $i < $weight; $i++) {
                $weightedStatuses[] = $status;
            }
        }

        $orders = collect();
        $orderCount = 45;

        for ($i = 0; $i < $orderCount; $i++) {
            $clinic = $clinics->random();
            $clinicPatients = $patients->where('clinic_id', $clinic->id);
            $patient = $clinicPatients->random();
            $service = $services->random();

            $selectedTeeth = collect($allTeeth)->random(fake()->numberBetween(1, 6))->sort()->values()->toArray();
            $status = fake()->randomElement($weightedStatuses);
            $createdAt = fake()->dateTimeBetween('-90 days', '-1 day');
            $dueDate = (clone $createdAt);
            $dueDate->modify('+' . fake()->numberBetween(5, 20) . ' days');

            $paymentStatus = match (true) {
                in_array($status, ['delivered', 'archived']) => fake()->randomElement([
                    PaymentStatus::Paid->value,
                    PaymentStatus::Paid->value,
                    PaymentStatus::Partial->value
                ]),
                $status === 'rejected' => PaymentStatus::Unpaid->value,
                default => fake()->randomElement(PaymentStatus::cases())->value,
            };

            $price = $service->price;

            $order = Order::create([
                'clinic_id' => $clinic->id,
                'lab_id' => $lab->id,
                'patient_id' => $patient->id,
                'service_id' => $service->id,
                'status' => $status,
                'priority' => fake()->randomElement(['normal', 'normal', 'normal', 'urgent']),
                'due_date' => $dueDate,
                'teeth' => $selectedTeeth,
                'shade' => fake()->randomElement($shades),
                'material' => fake()->randomElement($materials),
                'instructions' => fake()->optional(0.4)->sentence(12),
                'price' => $price,
                'payment_status' => $paymentStatus,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Create status history
            $statusFlow = ['new', 'in_progress', 'fitting', 'finished', 'shipped', 'delivered'];
            $currentIndex = array_search($status, $statusFlow);

            if ($currentIndex !== false) {
                $historyDate = clone $createdAt;
                for ($j = 0; $j <= $currentIndex; $j++) {
                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => $statusFlow[$j],
                        'changed_by_user_id' => $j === 0
                            ? $dentists->where('clinic_id', $clinic->id)->first()?->id
                            : $labOwner->id,
                        'created_at' => $historyDate,
                        'updated_at' => $historyDate,
                    ]);
                    $historyDate->modify('+' . fake()->numberBetween(1, 3) . ' days');
                }
            } elseif ($status === 'rejected') {
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => 'new',
                    'changed_by_user_id' => $dentists->random()->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
                $order->update(['rejection_reason' => fake()->randomElement([
                    'Empreinte de mauvaise qualité, impossible de travailler.',
                    'Informations manquantes sur le bon de commande.',
                    'Teinte non disponible pour ce matériau.',
                ])]);
            }

            $orders->push($order);
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 6. INVITATIONS (pending + accepted + expired)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating invitations...');

        // Pending invitation
        Invitation::create([
            'lab_id' => $lab->id,
            'email' => 'newclinic@contact.ma',
            'token' => Str::random(64),
            'expires_at' => now()->addDays(5),
        ]);

        // Expired invitation
        Invitation::create([
            'lab_id' => $lab->id,
            'email' => 'expired@clinic.ma',
            'token' => Str::random(64),
            'expires_at' => now()->subDays(3),
        ]);

        // Accepted invitation (for one of our existing clinics)
        Invitation::create([
            'lab_id' => $lab->id,
            'email' => $clinicsData[0]['email'],
            'token' => Str::random(64),
            'expires_at' => now()->addDays(2),
            'accepted_at' => now()->subDays(10),
        ]);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 7. NOTIFICATIONS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('  → Creating notifications...');

        $notificationTypes = [
            ['type' => 'order_status', 'title' => 'Commande mise à jour', 'body' => 'La commande #%d est passée à "%s".'],
            ['type' => 'new_order', 'title' => 'Nouvelle commande', 'body' => 'Nouvelle commande #%d reçue de %s.'],
            ['type' => 'new_message', 'title' => 'Nouveau message', 'body' => 'Message reçu sur la commande #%d.'],
        ];

        // Notifications for lab owner
        $recentOrders = $orders->sortByDesc('created_at')->take(10);
        foreach ($recentOrders as $idx => $order) {
            $notifType = $notificationTypes[$idx % 3];
            Notification::create([
                'user_id' => $labOwner->id,
                'type' => $notifType['type'],
                'title' => $notifType['title'],
                'body' => sprintf($notifType['body'], $order->id, $order->status->value ?? $order->status),
                'data' => ['order_id' => $order->id],
                'read_at' => $idx < 4 ? null : fake()->dateTimeBetween('-2 days', 'now'),
                'created_at' => fake()->dateTimeBetween('-5 days', 'now'),
            ]);
        }

        // Notifications for dentists
        foreach ($dentists as $dentist) {
            $dentistOrders = $orders->where('clinic_id', $dentist->clinic_id)->take(3);
            foreach ($dentistOrders as $order) {
                Notification::create([
                    'user_id' => $dentist->id,
                    'type' => 'order_status',
                    'title' => 'Mise à jour de commande',
                    'body' => "Votre commande #{$order->id} est maintenant \"" . ($order->status->value ?? $order->status) . '".',
                    'data' => ['order_id' => $order->id],
                    'read_at' => fake()->optional(0.5)->dateTimeBetween('-3 days', 'now'),
                    'created_at' => fake()->dateTimeBetween('-5 days', 'now'),
                ]);
            }
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // SUMMARY
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        $this->command->info('');
        $this->command->info('✅ Seeding complete!');
        $this->command->table(
            ['Entity', 'Count'],
            [
                ['Labs', Lab::count()],
                ['Clinics', Clinic::count()],
                ['Users', User::count()],
                ['Services', Service::count()],
                ['Patients', Patient::count()],
                ['Orders', Order::count()],
                ['Invitations', Invitation::count()],
                ['Notifications', Notification::count()],
            ]
        );

        $this->command->info('');
        $this->command->info('🔑 Login credentials (password: "password"):');
        $this->command->table(
            ['Role', 'Email'],
            [
                ['Super Admin', 'admin@dentallab.com'],
                ['Lab Owner', 'lab@dentallab.com'],
                ['Lab Tech', 'youssef@prodentlab.ma'],
                ['Dentist', 'alami@cabinet.ma'],
                ['Dentist', 'bennani@cabinet.ma'],
                ['Dentist', 'elfassi@dentaire.ma'],
            ]
        );
    }
}
