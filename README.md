# DentalLab — Dental Laboratory Management Platform

A modern, full-stack web application connecting dental clinics and dental laboratories for streamlined order management, real-time communication, and workflow tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Frontend** | React 18 + TypeScript + Inertia.js |
| **Styling** | Tailwind CSS 3 |
| **Real-time** | Laravel Reverb + Pusher |
| **Database** | MySQL 8 / SQLite (dev) |
| **PDF** | DomPDF |
| **i18n** | Laravel translations + react-i18next (fr, en, ar) |

## Features

- **Dual Portals** — Separate dashboards for Labs and Clinics
- **Order Management** — Full lifecycle: New → In Progress → Fitting → Finished → Shipped → Delivered → Archived
- **Real-time Chat** — Per-order messaging with file attachments via WebSockets
- **File Management** — STL, DICOM, PDF, and image uploads with 3D preview
- **Clinic Invitations** — Labs invite clinics via email with secure tokens
- **Finance Tracking** — Payment status management and reporting
- **Notifications** — Real-time in-app notifications via broadcasting
- **Dark Mode** — Full dark mode support
- **Multi-language** — French, English, and Arabic

## Prerequisites

- **PHP** ≥ 8.2 with extensions: `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- **Composer** ≥ 2.x
- **Node.js** ≥ 18.x with **npm**
- **MySQL** 8.x (or SQLite for local dev)

## Development Setup

```bash
# 1. Clone the repo
git clone <repository-url>
cd DentalLab

# 2. Install PHP dependencies
composer install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Set up database
#    Edit .env with your DB credentials, then:
php artisan migrate

# 5. Seed demo data
php artisan db:seed

# 6. Install JS dependencies
npm install

# 7. Start all dev servers (Laravel, Vite, Reverb, Queue)
composer dev
```

This runs concurrently:
- **Laravel** server on `http://localhost:8000`
- **Vite** HMR on `http://localhost:5173`
- **Reverb** WebSocket server
- **Queue** worker

## Demo Credentials

All accounts use the password: `password`

| Role | Email |
|------|-------|
| Super Admin | `admin@dentallab.com` |
| Lab Owner | `lab@dentallab.com` |
| Lab Tech | `youssef@prodentlab.ma` |
| Dentist | `alami@cabinet.ma` |
| Dentist | `bennani@cabinet.ma` |
| Dentist | `elfassi@dentaire.ma` |

## Running Tests

```bash
# Run all tests
php artisan test

# Run specific test suites
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Run specific test
php artisan test --filter=OrderStatusTest
```

## Project Structure

```
app/
├── Enums/          # OrderStatus, PaymentStatus
├── Events/         # OrderSubmitted, OrderStatusUpdated, etc.
├── Http/
│   ├── Controllers/
│   │   ├── Clinic/ # Clinic portal controllers
│   │   ├── Lab/    # Lab portal controllers
│   │   └── Admin/  # Admin controllers
│   ├── Middleware/  # RoleMiddleware, etc.
│   └── Requests/   # Form request validators
├── Models/         # Eloquent models
└── Services/       # OrderService, NotificationService
resources/
├── js/
│   ├── Components/ # Reusable React components
│   ├── Hooks/      # Custom React hooks
│   ├── Layouts/    # ClinicLayout, LabLayout
│   └── Pages/      # Inertia page components
└── views/          # Blade templates
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `composer dev` | Start all development servers |
| `composer test` | Run test suite |
| `composer setup` | Full initial setup (install + migrate + build) |
| `npm run dev` | Start Vite dev server only |
| `npm run build` | Build production assets |

## License

[MIT](LICENSE)
