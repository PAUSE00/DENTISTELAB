const fs = require('fs');
let c = fs.readFileSync('c:/Users/ilyas/Desktop/Dentallab/resources/css/app.css', 'utf8');

// The file was corrupted at the end due to a bad echo command.
// We chop everything after the `/* ── Animations` or `/*  Animations` block
let idx = c.indexOf('/* ── Animations');
if(idx === -1) idx = c.indexOf('/*  Animations');
if(idx === -1) idx = c.indexOf('@layer utilities {');

let goodPart = c.slice(0, idx);

let animPart = `/* ── Animations ──────────────────────────────────────────────────────────── */
@layer utilities {
    .animate-delay-100 { animation-delay: 100ms; }
    .animate-delay-200 { animation-delay: 200ms; }
    .animate-delay-300 { animation-delay: 300ms; }
    .animate-delay-400 { animation-delay: 400ms; }
    .animate-delay-500 { animation-delay: 500ms; }
    .animate-fill-both { animation-fill-mode: both; }
}

@keyframes shimmer { 100% { left: 100%; } }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(96,221,198,0.3); }
    50%       { box-shadow: 0 0 0 6px rgba(96,221,198,0); }
}
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
}
.animate-fade-up {
    animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
.animate-slide-left {
    animation: slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;
}

/* ── Print Styles ──────────────────────────────────────────────────────────── */
@media print {
    @page { size: auto; margin: 10mm; }
    body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: white !important;
        color: black !important;
    }
    .app-sidebar, .app-header { display: none !important; }
    .no-print { display: none !important; }
    main {
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        height: auto !important;
    }
    .layout-main {
        overflow: visible !important;
        height: auto !important;
    }
}
`;

fs.writeFileSync('c:/Users/ilyas/Desktop/Dentallab/resources/css/app.css', goodPart + animPart, 'utf8');
console.log("Fixed app.css");
