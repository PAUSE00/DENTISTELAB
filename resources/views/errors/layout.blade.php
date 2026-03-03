<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - DentalLab</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
    <div class="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100">
        <div class="max-w-md w-full glass-card rounded-3xl p-10 shadow-2xl shadow-indigo-200/50 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div class="mb-8 flex justify-center">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/30">
                    @yield('code')
                </div>
            </div>

            <h1 class="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                @yield('title')
            </h1>
            
            <p class="text-slate-600 mb-10 leading-relaxed text-lg">
                @yield('message')
            </p>

            <div class="flex flex-col gap-3">
                <a href="/" class="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95">
                    Go Back Home
                </a>
                <button onclick="window.location.reload()" class="w-full inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 text-base font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95">
                    Try Again
                </button>
            </div>

            <div class="mt-10 pt-8 border-t border-slate-200/60">
                <p class="text-slate-400 text-sm font-medium">
                    DentalLab Pro &bull; Support
                </p>
            </div>
        </div>
    </div>
</body>
</html>
