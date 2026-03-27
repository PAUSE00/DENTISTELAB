<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Invitation;
use App\Models\Lab;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use App\Models\OrderNote;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    private array $moroccanFirstNames = [
        'Ahmed', 'Mohammed', 'Youssef', 'Hassan', 'Ibrahim', 'Omar', 'Ali',
        'Khalid', 'Rachid', 'Fouad', 'Hamid', 'Karim', 'Nabil', 'Samir',
        'Tariq', 'Walid', 'Aziz', 'Brahim', 'Driss', 'Amine', 'Mehdi',
        'Soufiane', 'Ayoub', 'Othmane', 'Zakaria', 'Imad', 'Badr', 'Adil',
        'Fatima', 'Aicha', 'Khadija', 'Zineb', 'Nadia', 'Leila', 'Samira',
        'Hafssa', 'Maryam', 'Soukaina', 'Houda', 'Najat', 'Imane', 'Wafa',
        'Loubna', 'Sanae', 'Ilham', 'Ghita', 'Sara', 'Hind', 'Rim', 'Yasmine',
    ];

    private array $moroccanLastNames = [
        'Ait Ouahmane', 'Boulhrouz', 'Elguessi', 'Tachfine', 'Amazigh',
        'Aït Benhaddou', 'Ida Ou Blal', 'Chabat', 'Belfkih', 'Chbanat',
        'Ouahmane', 'Boumlik', 'Hnawi', 'Elmaati', 'Bouzid',
        'Agnaou', 'Oussoufi', 'Taghbalout', 'Benlahcen', 'Errachidi',
        'Afkir', 'El Mrabet', 'Talhaoui', 'Benali', 'Seddik',
        'El Harti', 'Benyoussef', 'Chakir', 'Moussaoui', 'Oulhaj',
        'Hajji', 'Essalhi', 'Boukhris', 'Elkhattabi', 'Aghbar',
        'Zouheir', 'Moudnib', 'Harrouchi', 'Lakhdar', 'Boutayeb',
        'Chafik', 'Loudiyi', 'Mkadmi', 'Benomar', 'Rhiat',
    ];

    private array $servicesCatalog = [
        ['name' => 'Couronne Zircone',                'price' => 1500, 'days' => 7,  'category' => 'Prothèse Fixe'],
        ['name' => 'Couronne Céramo-Métallique',      'price' => 900,  'days' => 5,  'category' => 'Prothèse Fixe'],
        ['name' => 'Couronne sur Implant',            'price' => 2800, 'days' => 8,  'category' => 'Implantologie'],
        ['name' => 'Bridge 3 Éléments Zircone',       'price' => 4200, 'days' => 10, 'category' => 'Prothèse Fixe'],
        ['name' => 'Bridge 3 Éléments CMK',           'price' => 2500, 'days' => 8,  'category' => 'Prothèse Fixe'],
        ['name' => 'Facette Emax',                    'price' => 2000, 'days' => 8,  'category' => 'Esthétique'],
        ['name' => 'Facette Composite',               'price' => 800,  'days' => 3,  'category' => 'Esthétique'],
        ['name' => 'Inlay/Onlay Céramique',           'price' => 1200, 'days' => 5,  'category' => 'Restauration'],
        ['name' => 'Prothèse Amovible Complète',      'price' => 4000, 'days' => 14, 'category' => 'Prothèse Amovible'],
        ['name' => 'Prothèse Partielle Stellite',     'price' => 2800, 'days' => 10, 'category' => 'Prothèse Amovible'],
        ['name' => 'Prothèse Partielle Résine',       'price' => 1600, 'days' => 7,  'category' => 'Prothèse Amovible'],
        ['name' => 'Gouttière Orthodontique',         'price' => 1800, 'days' => 5,  'category' => 'Orthodontie'],
        ['name' => 'Gouttière Bruxisme',              'price' => 1200, 'days' => 4,  'category' => 'Orthodontie'],
        ['name' => 'Provisoire Résine',               'price' => 400,  'days' => 2,  'category' => 'Temporaire'],
        ['name' => 'Chassis Nial',                    'price' => 500,  'days' => 3,  'category' => 'Prothèse Amovible'],
        ['name' => 'Couronne PMMA',                   'price' => 600,  'days' => 3,  'category' => 'Temporaire'],
    ];

    public function run(): void
    {
        $this->command->info('🦷 Seeding DentalLabPro with Agadir real data...');
        $start = microtime(true);

        // ── 0. SUPER ADMIN ───────────────────────────────────────────────
        $this->command->info('  → Creating super admin...');
        User::create([
            'name'              => 'Super Admin',
            'email'             => 'admin@dentallab.com',
            'role'              => 'super_admin',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'locale'            => 'fr',
        ]);

        // ── 1. LABS ──────────────────────────────────────────────────────
        $this->command->info('  → Creating 3 labs in Agadir...');

        $labsData = [
            [
                'owner_name'  => 'Dr. Karim Tachfine',
                'owner_email' => 'lab@dentallab.com',
                'lab_name'    => 'ProDent Lab Agadir',
                'lab_email'   => 'contact@prodentlab.ma',
                'lab_phone'   => '0528-234455',
                'lab_address' => 'Rue des FAR, Talborjt, Agadir',
                'description' => "Laboratoire de prothèse dentaire spécialisé en zircone CAD/CAM et céramique pressée. Plus de 15 ans d'expérience au service des cabinets dentaires d'Agadir et de la région Souss-Massa.",
                'terms'       => "Délai de livraison : 5 à 10 jours ouvrables. Paiement à réception ou 30 jours pour partenaires agréés. Retouches gratuites sous 15 jours.",
                'techs'       => [
                    ['name' => 'Youssef Aît Ouahmane', 'email' => 'youssef@prodentlab.ma'],
                    ['name' => 'Fatima Boulhrouz',      'email' => 'fatima@prodentlab.ma'],
                    ['name' => 'Said Elguessi',          'email' => 'said@prodentlab.ma'],
                ],
            ],
            [
                'owner_name'  => 'Dr. Omar Ida Ou Blal',
                'owner_email' => 'lab2@dentallab.com',
                'lab_name'    => 'Souss Dental Technique',
                'lab_email'   => 'info@soussdental.ma',
                'lab_phone'   => '0528-456789',
                'lab_address' => 'Boulevard Mohammed V, Agadir',
                'description' => "Spécialiste en prothèse amovible et implantologie. Équipés des dernières technologies CEREC et impression 3D. Partenaire de plus de 20 cliniques dans la région.",
                'terms'       => "Livraison incluse dans Agadir. Paiement sous 15 jours. Garantie 1 an sur toutes les prothèses.",
                'techs'       => [
                    ['name' => 'Khalid Chabat',  'email' => 'khalid@soussdental.ma'],
                    ['name' => 'Nadia Belfkih',   'email' => 'nadia@soussdental.ma'],
                ],
            ],
            [
                'owner_name'  => 'Dr. Rachid Amazigh',
                'owner_email' => 'lab3@dentallab.com',
                'lab_name'    => 'Atlas Prothèse Dentaire',
                'lab_email'   => 'atlas@atlaslab.ma',
                'lab_phone'   => '0528-567890',
                'lab_address' => 'Cité Founty, Agadir',
                'description' => "Centre de prothèse haut de gamme, spécialisé en esthétique dentaire : facettes, sourires Hollywood et couronnes tout-céramique. Technologie CEREC 3D dernière génération.",
                'terms'       => "Paiement à 30 jours. Retouches gratuites sous 30 jours. Livraison express disponible.",
                'techs'       => [
                    ['name' => 'Hamid Ouahmane', 'email' => 'hamid@atlaslab.ma'],
                    ['name' => 'Zineb Boumlik',  'email' => 'zineb@atlaslab.ma'],
                ],
            ],
        ];

        $labs        = collect();
        $labOwners   = collect();
        $allLabTechs = collect();

        foreach ($labsData as $ld) {
            $owner = User::create([
                'name'              => $ld['owner_name'],
                'email'             => $ld['owner_email'],
                'role'              => 'lab_owner',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'locale'            => 'fr',
            ]);

            $lab = Lab::create([
                'name'        => $ld['lab_name'],
                'email'       => $ld['lab_email'],
                'phone'       => $ld['lab_phone'],
                'address'     => $ld['lab_address'],
                'description' => $ld['description'],
                'terms'       => $ld['terms'],
                'is_active'   => true,
                'owner_id'    => $owner->id,
            ]);

            $owner->update(['lab_id' => $lab->id]);
            $labs->push($lab);
            $labOwners->push($owner);

            foreach ($ld['techs'] as $td) {
                $tech = User::create([
                    'name'              => $td['name'],
                    'email'             => $td['email'],
                    'role'              => 'lab_tech',
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'lab_id'            => $lab->id,
                    'locale'            => 'fr',
                ]);
                $allLabTechs->push($tech);
            }
        }

        // ── 2. SERVICES ──────────────────────────────────────────────────
        $this->command->info('  → Creating ' . (count($this->servicesCatalog) * $labs->count()) . ' services...');
        $allServices = collect();

        foreach ($labs as $lab) {
            foreach ($this->servicesCatalog as $sc) {
                $variation = rand(-100, 200);
                $service = Service::create([
                    'lab_id'          => $lab->id,
                    'name'            => $sc['name'],
                    'description'     => "Prestation professionnelle de laboratoire — {$sc['name']}. Matériaux certifiés CE, respect strict des délais.",
                    'price'           => max(200, $sc['price'] + $variation),
                    'production_days' => $sc['days'],
                    'is_active'       => true,
                    'category'        => $sc['category'],
                ]);
                $allServices->push($service);
            }
        }

        // ── 3. CLINICS ───────────────────────────────────────────────────
        $this->command->info('  → Creating 8 dental clinics in Agadir...');

        $clinicsData = [
            ['name' => 'Cabinet Dentaire Dr. Tachfine',   'doctor' => 'Dr. Ahmed Tachfine',    'email' => 'clinic@dentallab.com',  'phone' => '0528-223344', 'address' => 'Avenue Hassan II, Agadir',         'labs' => [0, 1]],
            ['name' => 'Centre Dentaire Founty',           'doctor' => 'Dr. Sara Belfkih',       'email' => 'clinic2@dentallab.com', 'phone' => '0528-334455', 'address' => 'Cité Founty, Agadir',              'labs' => [0]],
            ['name' => 'Cabinet Dr. Hnawi',                'doctor' => 'Dr. Hamid Hnawi',        'email' => 'clinic3@dentallab.com', 'phone' => '0528-445566', 'address' => 'Quartier Tilila, Agadir',          'labs' => [1]],
            ['name' => 'Clinique Dentaire Al Houda',       'doctor' => 'Dr. Khadija Elmaati',    'email' => 'clinic4@dentallab.com', 'phone' => '0528-556677', 'address' => 'Quartier Al Houda, Agadir',        'labs' => [0, 2]],
            ['name' => 'Cabinet Dr. Bouzid',               'doctor' => 'Dr. Omar Bouzid',        'email' => 'clinic5@dentallab.com', 'phone' => '0528-667788', 'address' => 'Hay Mohammadi, Agadir',            'labs' => [2]],
            ['name' => 'Centre Dentaire Talborjt',         'doctor' => 'Dr. Nabil Agnaou',       'email' => 'clinic6@dentallab.com', 'phone' => '0528-778899', 'address' => 'Rue des FAR, Talborjt, Agadir',   'labs' => [0, 1, 2]],
            ['name' => 'Cabinet Dentaire Anza',            'doctor' => 'Dr. Leila Oussoufi',     'email' => 'clinic7@dentallab.com', 'phone' => '0528-889900', 'address' => 'Cité Anza, Agadir',                'labs' => [1]],
            ['name' => 'Polyclinique Dentaire Souss',      'doctor' => 'Dr. Rachid Taghbalout',  'email' => 'clinic8@dentallab.com', 'phone' => '0528-990011', 'address' => 'Boulevard du Souss, Agadir',       'labs' => [0, 2]],
        ];

        $clinics  = collect();
        $dentists = collect();

        foreach ($clinicsData as $cd) {
            $clinic = Clinic::create([
                'name'      => $cd['name'],
                'email'     => $cd['email'],
                'phone'     => $cd['phone'],
                'address'   => $cd['address'],
                'is_active' => true,
            ]);

            foreach ($cd['labs'] as $labIdx) {
                DB::table('clinic_lab')->insert([
                    'clinic_id'  => $clinic->id,
                    'lab_id'     => $labs[$labIdx]->id,
                    'status'     => 'active',
                    'created_at' => now()->subDays(rand(30, 365)),
                    'updated_at' => now(),
                ]);
            }

            $dentist = User::create([
                'name'              => $cd['doctor'],
                'email'             => $cd['email'],
                'role'              => 'dentist',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'clinic_id'         => $clinic->id,
                'locale'            => 'fr',
            ]);

            // 1–2 clinic staff
            for ($s = 0; $s < rand(1, 2); $s++) {
                $staffFn = $this->rndFirst();
                $staffLn = $this->rndLast();
                User::create([
                    'name'              => "$staffFn $staffLn",
                    'email'             => strtolower($staffFn) . '.' . rand(10, 99) . '@' . Str::slug($cd['name']) . '.ma',
                    'role'              => 'clinic_staff',
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'clinic_id'         => $clinic->id,
                    'locale'            => 'fr',
                ]);
            }

            $clinics->push($clinic);
            $dentists->push($dentist);
        }

        // ── 4. PATIENTS (20-30 per clinic → 180-240 total) ───────────────
        $this->command->info('  → Creating patients (~200)...');

        $bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $allergies   = [null, null, null, 'Pénicilline', 'Latex', 'Aspirine', 'Anesthésiques locaux', 'Iode'];
        $medNotes    = [
            null, null, null,
            'Diabète type 2, contrôle glycémique avant anesthésie.',
            'Hypertension artérielle — Amlodipine 5mg.',
            'Sous anticoagulants (Xarelto). Consultation médicale recommandée.',
            'Antécédent de maladie cardiaque, prophylaxie antibiotique requise.',
            'Asthme léger, éviter les aérosols irritants.',
            'Grossesse (2ème trimestre), radiographies à éviter si possible.',
            'Ostéoporose, patient sous bisphosphonates.',
        ];

        $patients = collect();
        foreach ($clinics as $clinic) {
            $count = rand(20, 30);
            for ($i = 0; $i < $count; $i++) {
                $fn = $this->rndFirst();
                $ln = $this->rndLast();
                $patients->push(Patient::create([
                    'clinic_id'      => $clinic->id,
                    'first_name'     => $fn,
                    'last_name'      => $ln,
                    'dob'            => Carbon::now()->subYears(rand(18, 75))->subDays(rand(0, 364)),
                    'phone'          => '06' . rand(10000000, 99999999),
                    'email'          => rand(0, 1) ? strtolower($fn . '.' . rand(1, 99)) . '@gmail.com' : null,
                    'external_id'    => 'AG-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                    'blood_group'    => rand(0, 1) ? $bloodGroups[array_rand($bloodGroups)] : null,
                    'allergies'      => $allergies[array_rand($allergies)],
                    'medical_notes'  => $medNotes[array_rand($medNotes)],
                    'created_at'     => Carbon::now()->subDays(rand(30, 730)),
                ]));
            }
        }
        $this->command->info("     ✓ " . $patients->count() . " patients created.");

        // ── 5. ORDERS (~320) ─────────────────────────────────────────────
        $this->command->info('  → Creating ~320 orders with full history & payments...');

        $shades    = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2', 'D2', 'D3', 'OM1', 'OM2'];
        $materials = ['Zircone', 'Emax', 'Céramo-Métallique', 'Composite', 'PMMA', 'Résine', 'Stellite'];
        $allTeeth  = array_merge(range(11, 18), range(21, 28), range(31, 38), range(41, 48));

        $statusFlow       = ['new', 'in_progress', 'fitting', 'finished', 'shipped', 'delivered'];
        $weightedStatuses = [];
        $statusWeights    = [
            'new' => 15, 'in_progress' => 20, 'fitting' => 10,
            'finished' => 15, 'shipped' => 10, 'delivered' => 60,
            'rejected' => 8,  'cancelled' => 5, 'archived' => 12,
        ];
        foreach ($statusWeights as $st => $w) {
            for ($i = 0; $i < $w; $i++) $weightedStatuses[] = $st;
        }

        $rejectionReasons = [
            "Empreinte de mauvaise qualité, impossible de reproduire l'anatomie.",
            "Informations manquantes sur le bon de commande (teinte non précisée).",
            "Teinte demandée non disponible pour ce matériau.",
            "Mesures incompatibles avec les dents antagonistes.",
            "Patient a changé de plan de traitement.",
        ];

        $clinicNotes = [
            "Attention à l'espace inter-occlusaux réduit.",
            "Patient anxieux, priorité souhaitée.",
            "Teinte vérifiée sous lumière naturelle.",
            "Implant posé il y a 4 mois, osseointegration confirmée.",
            "Préférence du patient pour un résultat très naturel.",
            "À livrer avant le 15 pour le prochain rendez-vous.",
            "Modèles de travail joints dans le colis.",
        ];

        $labNotes = [
            "Couleur légèrement ajustée pour mieux correspondre aux dents adjacentes.",
            "Retouche d'occlusion effectuée en interne avant livraison.",
            "Zircone renforcée utilisée vu la position postérieure.",
            "Céramique stratifiée pour un résultat plus naturel.",
            "Essayage recommandé avant collage définitif.",
        ];

        $orders = collect();

        for ($i = 0; $i < 320; $i++) {
            $clinic   = $clinics->random();
            $clinicLabIds = DB::table('clinic_lab')
                ->where('clinic_id', $clinic->id)->pluck('lab_id')->toArray();
            if (empty($clinicLabIds)) continue;

            $labId    = $clinicLabIds[array_rand($clinicLabIds)];
            $labOwner = $labOwners->firstWhere('lab_id', $labId);
            $dentist  = $dentists->firstWhere('clinic_id', $clinic->id);

            $clinicPats = $patients->where('clinic_id', $clinic->id);
            if ($clinicPats->isEmpty()) continue;
            $patient = $clinicPats->random();

            $labSvcs = $allServices->where('lab_id', $labId);
            if ($labSvcs->isEmpty()) continue;
            $service = $labSvcs->random();

            $teeth     = collect($allTeeth)->random(rand(1, 6))->sort()->values()->toArray();
            $status    = $weightedStatuses[array_rand($weightedStatuses)];
            $createdAt = Carbon::now()->subDays(rand(1, 400));
            $dueDate   = (clone $createdAt)->addDays(rand(5, 21));

            $paymentStatus = match(true) {
                in_array($status, ['delivered', 'archived']) => (rand(0, 9) < 7 ? 'paid' : 'partial'),
                in_array($status, ['rejected', 'cancelled']) => 'unpaid',
                default => ['unpaid', 'unpaid', 'partial', 'partial', 'paid'][rand(0, 4)],
            };

            $price       = $service->price;
            $paidAmount  = match($paymentStatus) {
                'paid'    => $price,
                'partial' => round($price * rand(30, 70) / 100),
                default   => 0,
            };

            $order = Order::create([
                'clinic_id'      => $clinic->id,
                'lab_id'         => $labId,
                'patient_id'     => $patient->id,
                'service_id'     => $service->id,
                'user_id'        => $dentist?->id,
                'status'         => $status,
                'priority'       => (rand(0, 4) === 0) ? 'urgent' : 'normal',
                'due_date'       => $dueDate,
                'teeth'          => $teeth,
                'shade'          => $shades[array_rand($shades)],
                'material'       => $materials[array_rand($materials)],
                'instructions'   => rand(0, 1) ? $clinicNotes[array_rand($clinicNotes)] : null,
                'price'          => $price,
                'paid_amount'    => $paidAmount,
                'payment_status' => $paymentStatus,
                'created_at'     => $createdAt,
                'updated_at'     => $createdAt,
            ]);

            // Status history
            $currentIdx = array_search($status, $statusFlow);
            if ($currentIdx !== false) {
                $histDate = clone $createdAt;
                for ($j = 0; $j <= $currentIdx; $j++) {
                    OrderStatusHistory::create([
                        'order_id'           => $order->id,
                        'status'             => $statusFlow[$j],
                        'changed_by_user_id' => $j === 0 ? $dentist?->id : $labOwner?->id,
                        'created_at'         => $histDate,
                        'updated_at'         => $histDate,
                    ]);
                    $histDate = (clone $histDate)->addDays(rand(1, 4));
                }
            } elseif (in_array($status, ['rejected', 'cancelled'])) {
                OrderStatusHistory::create([
                    'order_id'           => $order->id,
                    'status'             => 'new',
                    'changed_by_user_id' => $dentist?->id,
                    'created_at'         => $createdAt,
                    'updated_at'         => $createdAt,
                ]);
                if ($status === 'rejected') {
                    $order->update(['rejection_reason' => $rejectionReasons[array_rand($rejectionReasons)]]);
                }
            }

            // Order notes
            if (rand(0, 2) === 0 && $dentist) {
                $noteAt = (clone $createdAt)->addHours(rand(1, 24));
                OrderNote::create([
                    'order_id'   => $order->id,
                    'user_id'    => $dentist->id,
                    'content'    => $clinicNotes[array_rand($clinicNotes)],
                    'created_at' => $noteAt,
                    'updated_at' => $noteAt,
                ]);
            }
            if (rand(0, 3) === 0 && $labOwner) {
                $noteAt = (clone $createdAt)->addDays(rand(1, 3));
                OrderNote::create([
                    'order_id'   => $order->id,
                    'user_id'    => $labOwner->id,
                    'content'    => $labNotes[array_rand($labNotes)],
                    'created_at' => $noteAt,
                    'updated_at' => $noteAt,
                ]);
            }

            // Payment record
            if ($paidAmount > 0 && $dentist) {
                DB::table('payments')->insert([
                    'order_id'       => $order->id,
                    'clinic_id'      => $clinic->id,
                    'lab_id'         => $labId,
                    'amount'         => $paidAmount,
                    'payment_method' => ['cash', 'bank_transfer', 'check', 'card'][rand(0, 3)],
                    'notes'          => rand(0, 1) ? 'Versement reçu au cabinet.' : null,
                    'paid_at'        => (clone $createdAt)->addDays(rand(0, 15)),
                    'recorded_by_id' => $dentist->id,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            }

            $orders->push($order);
        }
        $this->command->info("     ✓ " . $orders->count() . " orders created.");

        // ── 6. APPOINTMENTS ──────────────────────────────────────────────
        $this->command->info('  → Creating appointments...');

        $totalAppts = 0;

        foreach ($clinics as $ci => $clinic) {
            $clinicPats = $patients->where('clinic_id', $clinic->id)->values();
            $doctorUser = $dentists->firstWhere('clinic_id', $clinic->id);
            if (!$doctorUser) continue;

            $count = rand(12, 22);
            for ($a = 0; $a < $count; $a++) {
                if ($clinicPats->isEmpty()) continue;
                $apptPat  = $clinicPats->random();
                $apptDate = Carbon::now()->addDays(rand(-45, 45))
                    ->setHour(rand(8, 17))
                    ->setMinute([0, 15, 30, 45][rand(0, 3)])
                    ->setSecond(0);
                $apptStatus = $apptDate->isPast() ? 'completed' : 'confirmed';
                if (rand(0, 7) === 0) $apptStatus = 'cancelled';

                DB::table('appointments')->insert([
                    'clinic_id'  => $clinic->id,
                    'patient_id' => $apptPat->id,
                    'doctor_id'  => $doctorUser->id,
                    'start_time' => $apptDate,
                    'end_time'   => (clone $apptDate)->addMinutes([30, 45, 60, 90][rand(0, 3)]),
                    'status'     => $apptStatus,
                    'notes'      => rand(0, 2) === 0 ? 'Patient à contacter la veille pour confirmation.' : null,
                    'created_at' => Carbon::now()->subDays(rand(1, 60)),
                    'updated_at' => now(),
                ]);
                $totalAppts++;
            }
        }
        $this->command->info("     ✓ {$totalAppts} appointments created.");

        // ── 7. NOTIFICATIONS ─────────────────────────────────────────────
        $this->command->info('  → Creating notifications...');

        foreach ($orders->sortByDesc('created_at')->take(80) as $idx => $order) {
            $labOwner = $labOwners->firstWhere('lab_id', $order->lab_id);
            $dentist  = $dentists->firstWhere('clinic_id', $order->clinic_id);

            if ($labOwner) {
                $createdAt = Carbon::now()->subDays(rand(1, 5));
                Notification::create([
                    'user_id'    => $labOwner->id,
                    'type'       => 'new_order',
                    'title'      => 'Nouvelle commande reçue',
                    'body'       => "La commande #{$order->id} a été soumise par le cabinet.",
                    'data'       => ['order_id' => $order->id],
                    'read_at'    => $idx < 20 ? null : (clone $createdAt)->addMinutes(rand(10, 120)),
                    'created_at' => $createdAt,
                ]);
            }
            if ($dentist && rand(0, 1)) {
                $createdAt = Carbon::now()->subDays(rand(1, 3));
                Notification::create([
                    'user_id'    => $dentist->id,
                    'type'       => 'order_status',
                    'title'      => 'Mise à jour de commande',
                    'body'       => "Votre commande #{$order->id} est maintenant « " . (is_object($order->status) ? $order->status->value : $order->status) . " ».",
                    'data'       => ['order_id' => $order->id],
                    'read_at'    => rand(0, 1) ? (clone $createdAt)->addMinutes(rand(10, 120)) : null,
                    'created_at' => $createdAt,
                ]);
            }
        }

        // ── 8. INVITATIONS ───────────────────────────────────────────────
        $this->command->info('  → Creating invitations...');

        foreach ($labs as $lab) {
            Invitation::create([
                'lab_id'     => $lab->id,
                'email'      => 'nouveau.cabinet@gmail.com',
                'token'      => Str::random(64),
                'expires_at' => now()->addDays(7),
            ]);
            Invitation::create([
                'lab_id'     => $lab->id,
                'email'      => 'clinique.souss@yahoo.fr',
                'token'      => Str::random(64),
                'expires_at' => now()->subDays(2), // expired
            ]);
        }

        // ── SUMMARY ──────────────────────────────────────────────────────
        $elapsed = round(microtime(true) - $start, 1);
        $this->command->info('');
        $this->command->info("✅ Seeding completed in {$elapsed}s!");
        $this->command->table(['Entity', 'Count'], [
            ['Labs',           Lab::count()],
            ['Clinics',        Clinic::count()],
            ['Users',          User::count()],
            ['Services',       Service::count()],
            ['Patients',       Patient::count()],
            ['Orders',         Order::count()],
            ['Appointments',   DB::table('appointments')->count()],
            ['Payments',       DB::table('payments')->count()],
            ['Notifications',  Notification::count()],
            ['Invitations',    Invitation::count()],
        ]);

        $this->command->info('');
        $this->command->info('🔑 Login credentials (password: "password"):');
        $this->command->table(['Role', 'Email', 'Entity'], [
            ['Super Admin', 'admin@dentallab.com',   '—'],
            ['Lab Owner',   'lab@dentallab.com',     'ProDent Lab Agadir'],
            ['Lab Owner',   'lab2@dentallab.com',    'Souss Dental Technique'],
            ['Lab Owner',   'lab3@dentallab.com',    'Atlas Prothèse Dentaire'],
            ['Lab Tech',    'youssef@prodentlab.ma', 'ProDent Lab Agadir'],
            ['Dentist',     'clinic@dentallab.com',  'Cabinet Dr. Tachfine'],
            ['Dentist',     'clinic2@dentallab.com', 'Centre Dentaire Founty'],
            ['Dentist',     'clinic3@dentallab.com', 'Cabinet Dr. Hnawi'],
            ['Dentist',     'clinic4@dentallab.com', 'Clinique Dentaire Al Houda'],
            ['Dentist',     'clinic5@dentallab.com', 'Cabinet Dr. Bouzid'],
            ['Dentist',     'clinic6@dentallab.com', 'Centre Dentaire Talborjt'],
            ['Dentist',     'clinic7@dentallab.com', 'Cabinet Dentaire Anza'],
            ['Dentist',     'clinic8@dentallab.com', 'Polyclinique Dentaire Souss'],
        ]);
    }

    private function rndFirst(): string { return $this->moroccanFirstNames[array_rand($this->moroccanFirstNames)]; }
    private function rndLast(): string  { return $this->moroccanLastNames[array_rand($this->moroccanLastNames)]; }
}
