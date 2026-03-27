import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Activity, Users, FileText, MessageSquare, Clock, ArrowRight, Zap, CheckCircle2, ShieldPlus, ChevronDown, Sparkles, Globe2, BarChart3, Box, Wrench, Stethoscope, Sun, Moon } from 'lucide-react';
import SplineBackground from '@/Components/SplineBackground';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useEffect, useState } from 'react';

const SPLINE_SCENE = 'https://prod.spline.design/dMwT5dUZYvBMbVxl/scene.splinecode';

const getFeatures = (lang: 'FR' | 'EN') => {
  if (lang === 'EN') {
    return [
      { icon: FileText, color: '#60ddc6', bg: 'rgba(96,221,198,0.06)', title: 'Lab Order Management', desc: 'Real-time creation and tracking of prescriptions with status history and attachments.' },
      { icon: Users, color: '#818cf8', bg: 'rgba(129,140,248,0.06)', title: 'Patient Records & Plans', desc: 'Complete management including clinical notes, treatment history, and care plans.' },
      { icon: BarChart3, color: '#c084fc', bg: 'rgba(192,132,252,0.06)', title: 'Billing & Transactions', desc: 'Delivery notes, patient payments, and clinical transactions generated centrally.' },
      { icon: Clock, color: '#34d399', bg: 'rgba(52,211,153,0.06)', title: 'Agenda & Appointments', desc: 'Seamless scheduling of consultations, interventions, and automatic reminders.' },
      { icon: MessageSquare, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', title: 'Support & Messaging', desc: 'Direct ticketing system and integrated messaging between clinics and technicians.' },
      { icon: Box, color: '#f43f5e', bg: 'rgba(244,63,94,0.06)', title: 'Inventory Management', desc: 'Control your material inventories accurately to avoid unexpected shortages.' }
    ];
  }
  return [
    { icon: FileText, color: '#60ddc6', bg: 'rgba(96,221,198,0.06)', title: 'Gestion des Commandes Labo', desc: 'Création et suivi en temps réel des prescriptions avec historique des statuts et attachements.' },
    { icon: Users, color: '#818cf8', bg: 'rgba(129,140,248,0.06)', title: 'Dossiers Patients & Plans', desc: 'Gestion complète incluant les notes cliniques, historique des traitements et plans de soins.' },
    { icon: BarChart3, color: '#c084fc', bg: 'rgba(192,132,252,0.06)', title: 'Facturation & Transactions', desc: 'Bons de livraison, paiements patients et transactions cliniques générés de manière centralisée.' },
    { icon: Clock, color: '#34d399', bg: 'rgba(52,211,153,0.06)', title: 'Agenda & Rendez-vous', desc: 'Planification fluide des consultations, interventions et rappels automatiques.' },
    { icon: MessageSquare, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', title: 'Support & Messagerie', desc: 'Système de tickets direct et messagerie intégrée entre cliniques et techniciens.' },
    { icon: Box, color: '#f43f5e', bg: 'rgba(244,63,94,0.06)', title: 'Gestion des Stocks', desc: 'Contrôlez vos inventaires de matériaux avec précision pour éviter les ruptures inattendues.' }
  ];
};

const TRANSLATIONS = {
  FR: {
    nav: { home: 'Accueil', features: 'Fonctionnalités', eco: 'Écosystème', contact: 'Contact', dashboard: 'Dashboard', client: 'Espace Client' },
    hero: { tag: 'EXPÉRIENCE 3D IMMERSIVE', title1: 'Le Futur des', title2: 'Laboratoires Dentaires', sub: 'Connectez cliniques et laboratoires sur une plateforme unifiée.\nGérez les commandes, suivez la production et développez votre activité.', btn1: 'Commencer Gratuitement', btn2: 'Se Connecter' },
    stats: { s1: 'PARTENAIRES LABO', s2: 'COMMANDES', s3: 'DISPONIBILITÉ', s4: 'RÉPONSE' },
    featLabel: 'Fonctionnalités',
    featTitle1: 'Des outils puissants pour',
    featTitle2: 'optimiser la gestion de votre cabinet',
    ecoTag: 'SCHÉMA ARCHITECTURAL',
    ecoTitle1: "L'Écosystème Numérique Unifié : L'Intelligence au Service de",
    ecoTitle2: 'la Prothèse et de la Dentisterie.',
    ecoSub: 'Une plateforme centralisée qui connecte et optimise chaque étape, du diagnostic à la fabrication.',
    ecoLab1: 'Laboratoires Prothétiques:',
    ecoLab2: 'Production & Traçabilité',
    ecoLabDesc: "L'interface technicien de laboratoire est pensée pour la productivité. Gérez vos flux de travail entrants, assignez précisément les différentes étapes de production à vos techniciens, et gardez un contrôle total sur vos matériaux internes.",
    ecoLabStepLabel: 'Flux de Production de Prothèse',
    ecoLabSteps: ['Réception Empreinte Numérique', 'Design & Modélisation CAO', 'Usinage / Impression 3D', 'Finition & Maquillage', 'Contrôle Qualité', 'Expédition Clinic'],
    ecoShieldLabel: 'PROTECTION',
    ecoShield1: 'Chiffrement de bout en bout',
    ecoShield2: 'Données patients sécurisées',
    ecoClinic1: 'Cliniques Dentaires:',
    ecoClinic2: 'Prescription & Suivi Patient',
    ecoClinicDesc: "Créez vos prescriptions en quelques secondes avec l'odontogramme 3D interactif. Suivez vos commandes en temps réel, communiquez directement avec votre technicien dédié et gérez la facturation patient au même endroit.",
    footTag: 'Notre mission: Numériser la dentisterie',
    footP: 'DentalLabPro réinvente la collaboration entre les chirurgiens-dentistes et les prothésistes à travers des outils ultra-modernes, sécurisés, et pensés pour la fluidité de vos journées.',
    footC1Title: 'Produit',
    footC1Links: ['Fonctionnalités', 'Odontogramme 3D', 'Plateforme Laboratoire', 'Tarifs & Plans'],
    footC2Title: 'Légal & Support',
    footC2Links: ['CGU', 'Confidentialité', 'Centre d\'Aide', 'Contact'],
    footCopy: 'Tous droits réservés.'
  },
  EN: {
    nav: { home: 'Home', features: 'Features', eco: 'Ecosystem', contact: 'Contact', dashboard: 'Dashboard', client: 'Client Portal' },
    hero: { tag: 'IMMERSIVE 3D EXPERIENCE', title1: 'The Future of', title2: 'Dental Laboratories', sub: 'Connect clinics and laboratories in one unified platform.\nManage orders, track production, and grow your business.', btn1: 'Start for Free', btn2: 'Sign In' },
    stats: { s1: 'LAB PARTNERS', s2: 'ORDERS', s3: 'UPTIME', s4: 'RESPONSE' },
    featLabel: 'Features',
    featTitle1: 'Powerful tools to',
    featTitle2: 'optimize your clinic management',
    ecoTag: 'ARCHITECTURAL SCHEME',
    ecoTitle1: 'The Unified Digital Ecosystem: Intelligence at the Service of',
    ecoTitle2: 'Prosthetics and Dentistry.',
    ecoSub: 'A centralized platform that connects and optimizes every step, from diagnosis to manufacturing.',
    ecoLab1: 'Prosthetic Laboratories:',
    ecoLab2: 'Production & Traceability',
    ecoLabDesc: 'The dental lab technician interface is designed for productivity. Manage your incoming workflows, accurately assign different production stages to your technicians, and keep full control over your internal materials.',
    ecoLabStepLabel: 'Prosthesis Production Flow',
    ecoLabSteps: ['Digital Impression Receipt', 'CAD Design & Modeling', 'Milling / 3D Printing', 'Finishing & Staining', 'Quality Control', 'Clinic Shipping'],
    ecoShieldLabel: 'PROTECTION',
    ecoShield1: 'End-to-End Encryption',
    ecoShield2: 'Secured Patient Data',
    ecoClinic1: 'Dental Clinics:',
    ecoClinic2: 'Prescription & Patient Tracking',
    ecoClinicDesc: 'Create your prescriptions in seconds with the interactive 3D odontogram. Track your orders in real-time, communicate directly with your dedicated technician, and manage patient billing all in one place.',
    footTag: 'Our mission: Digitizing dentistry',
    footP: 'DentalLabPro reinvents the collaboration between dental surgeons and prosthetists through ultra-modern, secure tools designed for the fluidity of your daily work.',
    footC1Title: 'Product',
    footC1Links: ['Features', '3D Odontogram', 'Lab Platform', 'Pricing & Plans'],
    footC2Title: 'Legal & Support',
    footC2Links: ['Terms of Use', 'Privacy Policy', 'Help Center', 'Contact'],
    footCopy: 'All rights reserved.'
  }
};

export default function Welcome({ auth }: PageProps<{ laravelVersion: string; phpVersion: string }>) {
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const t = TRANSLATIONS[lang];
  const activeFeatures = getFeatures(lang);

  useEffect(() => {
    setHeroVisible(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
       document.documentElement.setAttribute('data-theme', 'light');
    } else {
       document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const parallaxOffset = scrollY * 0.3;

  return (
    <>
      <Head title="DentalLabPro — Modern Dental Laboratory Platform" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        :root { color-scheme: dark; }
        body {
          background: #080610 !important;
          color: #f1f0f8;
          font-family: 'Inter', system-ui, sans-serif;
          margin: 0;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          overflow-y: auto !important;
        }
        /* ── Light Mode Implementation (Smart Color Inversion) ── */
        html[data-theme="light"] {
          filter: invert(1) hue-rotate(180deg);
          /* Inject a hint of warm cream to soften the stark white */
          background-color: #f7f9fa;
        }
        /* Protect natural images from inversion, but let canvas/spline invert natively so their black backgrounds become bright white! */
        html[data-theme="light"] img {
          filter: invert(1) hue-rotate(180deg);
        }
        
        /* Make the ghostly inverted skull subtle so it acts as a light watermark */
        html[data-theme="light"] .skull-bg-layer {
          opacity: 0.15 !important;
        }

        /* 
           Make glass elements feel like premium bright glass! 
           Since html is inverted, declaring BLACK backgrounds will render as WHITE.
        */
        html[data-theme="light"] .card-3d,
        html[data-theme="light"] .stat-3d {
          background: rgba(0,0,0,0.5) !important; /* Inverts to bright solid glass */
          border-color: rgba(255,255,255,0.06) !important; /* Inverts to subtle dark border */
          box-shadow: 0 10px 40px rgba(255,255,255,0.04) !important;
        }
        html[data-theme="light"] .nav-glass {
          background: rgba(0,0,0,0.85) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        html[data-theme="light"] footer {
          border-top-color: rgba(255,255,255,0.06) !important;
        }

        /* ── Animations ──────────────────── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(96,221,198,0.2), 0 0 60px rgba(96,221,198,0.08); }
          50% { box-shadow: 0 0 30px rgba(96,221,198,0.35), 0 0 80px rgba(96,221,198,0.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounceDown {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(8px) translateX(-50%); }
          60% { transform: translateY(4px) translateX(-50%); }
        }
        @keyframes rotateIn {
          from { opacity: 0; transform: perspective(800px) rotateY(-15deg) translateX(-40px); }
          to { opacity: 1; transform: perspective(800px) rotateY(0deg) translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(96,221,198,0.08); }
          50% { border-color: rgba(96,221,198,0.2); }
        }

        .hero-visible .fade-1 { animation: heroFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both 0.3s; }
        .hero-visible .fade-2 { animation: heroFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both 0.5s; }
        .hero-visible .fade-3 { animation: heroFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both 0.7s; }
        .hero-visible .fade-4 { animation: heroFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both 0.9s; }
        .hero-visible .fade-5 { animation: heroFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both 1.1s; }

        /* ── Buttons ─────────────────────── */
        .btn-hero {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 30px; border-radius: 14px; font-size: 14.5px; font-weight: 700;
          background: linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%);
          color: #fff; text-decoration: none; cursor: pointer; border: none;
          transition: transform 0.25s, box-shadow 0.25s;
          animation: pulseGlow 3s ease-in-out infinite;
          position: relative; overflow: hidden;
          font-family: inherit;
        }
        .btn-hero::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 200%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        .btn-hero:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 0 50px rgba(96,221,198,0.4), 0 20px 40px rgba(0,0,0,0.3); }

        .btn-glass {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 30px; border-radius: 14px; font-size: 14.5px; font-weight: 600;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          color: #f1f0f8; text-decoration: none; cursor: pointer;
          backdrop-filter: blur(12px);
          transition: transform 0.25s, background 0.25s, border-color 0.25s;
          font-family: inherit;
        }
        .btn-glass:hover { transform: translateY(-3px); background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        /* ── 3D Cards ────────────────────── */
        .card-3d {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; padding: 32px;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, box-shadow 0.4s;
          transform-style: preserve-3d;
          perspective: 1000px;
          backdrop-filter: blur(8px);
          position: relative; overflow: hidden;
        }
        .card-3d::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          background: radial-gradient(ellipse at 50% 0%, rgba(96,221,198,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .card-3d:hover {
          transform: translateY(-8px) rotateX(2deg);
          border-color: rgba(96,221,198,0.2);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(96,221,198,0.06);
        }

        /* ── Glass Badge ─────────────────── */
        .badge-glow {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 16px; border-radius: 999px;
          background: rgba(96,221,198,0.06);
          border: 1px solid rgba(96,221,198,0.15);
          color: #60ddc6; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          backdrop-filter: blur(8px);
          animation: borderGlow 4s ease-in-out infinite;
        }

        /* ── Gradient text ────────────────── */
        .text-gradient {
          background: linear-gradient(135deg, #60ddc6 0%, #818cf8 40%, #c084fc 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-gradient-gold {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Stat card ───────────────────── */
        .stat-3d {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 18px; padding: 28px 24px;
          text-align: center; position: relative; overflow: hidden;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .stat-3d::after {
          content: ''; position: absolute; bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96,221,198,0.3), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .stat-3d:hover { transform: translateY(-4px); border-color: rgba(96,221,198,0.12); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
        .stat-3d:hover::after { opacity: 1; }

        /* ── Nav ──────────────────────────── */
        .nav-glass {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 64px;
          background: rgba(8,6,16,0.6);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.3s;
        }

        /* ── Section divider ─────────────── */
        .section-glow {
          height: 1px; border: none; margin: 0;
          background: linear-gradient(90deg, transparent 5%, rgba(96,221,198,0.15) 50%, transparent 95%);
        }

        /* ── Spline Watermark Removal (Free Plan) ── */
        spline-viewer::part(logo) { display: none !important; }
        #spline-logo { display: none !important; }
        a[href*="spline.design"] { display: none !important; }

        /* Spline canvas fix */
        canvas { display: block; }
      `}</style>

      <div style={{ background: '#080610', minHeight: '100vh', color: '#f1f0f8' }}>

        {/* ════════════════════ NAVBAR ════════════════════ */}
        <nav className="nav-glass" style={{ background: scrollY > 50 ? 'rgba(8,6,16,0.85)' : 'rgba(8,6,16,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <img src="/images/logo.png" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(96,221,198,0.2)]" alt="Logo" />
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px' }}>DentalLab<span style={{ color: '#60ddc6' }}>Pro</span></span>
          </div>

          {/* Centralized Navigation Menu */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
            {[
              { label: t.nav.home, hash: '#' },
              { label: t.nav.features, hash: '#features' },
              { label: t.nav.eco, hash: '#ecosystem' },
              { label: t.nav.contact, hash: '#contact' }
            ].map((link, idx) => (
              <a key={idx} href={link.hash} 
                 style={{ color: idx === 0 ? '#fff' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14.5, fontWeight: idx === 0 ? 700 : 500, textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = idx === 0 ? '#fff' : 'rgba(255,255,255,0.6)'}>
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, justifyContent: 'flex-end' }}>
            {/* Language Configurator */}
            <div 
              onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
              <Globe2 size={14} color="rgba(255,255,255,0.7)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fff' }}>
                <span style={{ opacity: lang === 'FR' ? 1 : 0.4 }}>FR</span> <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span> <span style={{ opacity: lang === 'EN' ? 1 : 0.4 }}>EN</span>
              </div>
            </div>

            {/* Dark/Light Theme Toggle */}
            <div 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              <div style={{ background: theme === 'dark' ? '#60ddc6' : 'transparent', padding: 6, borderRadius: '50%', boxShadow: theme === 'dark' ? '0 0 10px rgba(96,221,198,0.4)' : 'none', opacity: theme === 'dark' ? 1 : 0.5 }}>
                 <Moon size={12} color={theme === 'dark' ? '#000' : '#fff'} />
              </div>
              <div style={{ background: theme === 'light' ? '#60ddc6' : 'transparent', padding: 6, borderRadius: '50%', boxShadow: theme === 'light' ? '0 0 10px rgba(96,221,198,0.4)' : 'none', opacity: theme === 'light' ? 1 : 0.5 }}>
                 <Sun size={12} color={theme === 'light' ? '#000' : '#fff'} />
              </div>
            </div>

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            {auth.user ? (
              <Link href={route('dashboard')} className="btn-hero" style={{ padding: '9px 20px', fontSize: 13, animation: 'none' }}>
                {t.nav.dashboard} <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href={route('login')} className="btn-glass" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13 }}>
                {t.nav.client}
              </Link>
            )}
          </div>
        </nav>

        {/* ════════════════════ 3D HERO ════════════════════ */}
        {/* ════════════════════ 3D HERO ════════════════════ */}
        <div id="home" style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#080610' }}>
          
          {/* Skull Background Image */}
          {/* Applying brightness ensures the raw pixels are bright enough before the HTML root inverts the final composite, translating directly to a rich dark watermark overlay. */}
          <div className="skull-bg-layer" style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: "url('/images/skull-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: theme === 'dark' ? 0.85 : 0.7,
            filter: theme === 'dark' ? 'none' : 'brightness(4) contrast(1.5)',
            pointerEvents: 'none'
          }} />

          {/* Spline 3D Scene - Screen blend mode to remove any dark canvas background */}
          <div className="spline-wrapper" style={{ 
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', 
            mixBlendMode: 'screen', 
            opacity: 0.8,
            clipPath: 'inset(0px 0px 60px 0px)' 
          }}>
            <SplineBackground
              sceneUrl={SPLINE_SCENE}
              fallbackColor="transparent"
              mobileBreakpoint={768}
            />
          </div>

          {/* Layer 1: Ambient darkening overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(8,6,16,0.3) 0%, rgba(8,6,16,0.9) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Layer 2: Bottom gradient for seamless transition to features */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', zIndex: 1,
            background: 'linear-gradient(to bottom, transparent, #080610)',
            pointerEvents: 'none',
          }} />

          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            pointerEvents: 'none',
            mask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }} />

          {/* Hero Content */}
          <div className={heroVisible ? 'hero-visible' : ''} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100%', position: 'relative', zIndex: 2,
            textAlign: 'center', padding: '60px 24px 20px', flex: 1
          }}>
            <div style={{ maxWidth: 800, transform: `translateY(${-parallaxOffset * 0.15}px)` }}>
              <div className="fade-1" style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                <span className="badge-glow" style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f0f8', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Sparkles size={12} style={{ color: '#60ddc6' }} />
                  {t.hero.tag}
                </span>
              </div>

              <h1 className="fade-2" style={{
                fontSize: 'clamp(36px, 6vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-2.5px',
                marginBottom: 16,
                textShadow: '0 10px 40px rgba(0,0,0,0.8)',
              }}>
                {t.hero.title1}<br />
                <span className="text-gradient">{t.hero.title2}</span>
              </h1>

              <p className="fade-3" style={{
                fontSize: 16,
                color: 'rgba(241,240,248,0.7)',
                maxWidth: 480,
                margin: '0 auto 30px',
                lineHeight: 1.6,
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}>
                {t.hero.sub.split('\n')[0]}<br className="hidden sm:block" />
                {t.hero.sub.split('\n')[1]}
              </p>

              <div className="fade-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                {auth.user ? (
                  <Link href={route('dashboard')} className="btn-hero" style={{ padding: '14px 30px', fontSize: 15 }}>
                    {t.nav.dashboard} <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <a href="#contact" className="btn-hero" style={{ padding: '14px 30px', fontSize: 15, textDecoration: 'none' }}>
                      {t.hero.btn1} <ArrowRight size={16} />
                    </a>
                    <Link href={route('login')} className="btn-glass" style={{ padding: '14px 30px', fontSize: 15 }}>
                      {t.hero.btn2}
                    </Link>
                  </>
                )}
              </div>

              {/* Stats Row - 4 distinct glass cards */}
              <div className="fade-5" style={{
                marginTop: 40,
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20,
              }}>
                {[
                  { val: '500+', label: t.stats.s1, icon: Users, color: '#60ddc6' },
                  { val: '50K+', label: t.stats.s2, icon: FileText, color: '#818cf8' },
                  { val: '99.9%', label: t.stats.s3, icon: Activity, color: '#34d399' },
                  { val: '<2min', label: t.stats.s4, icon: Zap, color: '#c084fc' },
                ].map((s, i) => (
                  <div key={s.label} className="stat-3d" style={{
                    flex: '1 1 180px',
                    maxWidth: 240,
                    padding: '28px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
                  }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 16, 
                      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='${s.color.replace('#', '%23')}' stop-opacity='0.2'/%3E%3Cstop offset='100%25' stop-color='transparent' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${s.color}30`
                    }}>
                      <s.icon size={22} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#fff', textShadow: `0 0 20px ${s.color}40`, lineHeight: 1.1 }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: 32, left: '50%',
            animation: 'bounceDown 2.5s ease-in-out infinite',
            zIndex: 3, opacity: 0.5,
          }}>
            <ChevronDown size={24} />
          </div>

          {/* Spline Watermark Blocker 
              Since Spline fights to show its watermark, we place a solid un-clickable block permanently over it
              in the bottom right corner exactly where the logo renders */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: 220, height: 75,
            background: '#080610', zIndex: 50, pointerEvents: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 100%, black)'
          }} />
        </div>

        {/* ════════════════════ PRODUITS & FONCTIONNALITÉS (Inspired by Dentapro) ════════════════════ */}
        <hr className="section-glow" />

        <div id="features" style={{ 
          minHeight: '100vh', padding: '120px 32px', background: '#080610', 
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.04) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ marginBottom: 16, display: 'inline-flex', letterSpacing: '0.2em', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', color: '#fff' }}>
                {t.featLabel}
              </div>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16, maxWidth: 640, margin: '0 auto', lineHeight: 1.15 }}>
                {t.featTitle1}<br />
                <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #60ddc6, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{t.featTitle2}</span>
              </h2>
            </div>

            {/* 360° ORBITING CARDS - DYNAMIC CIRCLE (Animated Ecosystem Layout) */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 800, margin: '40px auto 100px auto',
              position: 'relative'
            }}>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes orbit-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes orbit-counter { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
                .orbit-ring { animation: orbit-spin 50s linear infinite; }
                .orbit-item { animation: orbit-counter 50s linear infinite; }
                /* Pause animations instantly when user touches any card */
                .orbit-container:hover .orbit-ring, 
                .orbit-container:hover .orbit-item {
                  animation-play-state: paused;
                }
              `}} />

              <div className="orbit-container" style={{ position: 'relative', width: 660, height: 660, overflow: 'visible' }}>
                {/* Orbital Guide Rings */}
                <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: -50, border: '1px solid rgba(255,255,255,0.02)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: -100, border: '1px solid rgba(96,221,198,0.02)', borderRadius: '50%' }} />
                
                {/* Center Core Logo/Orb */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 170, height: 170, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(96,221,198,0.15) 0%, #080610 80%)',
                  border: '1px solid rgba(96,221,198,0.3)',
                  boxShadow: '0 0 80px rgba(96,221,198,0.2), inset 0 0 30px rgba(96,221,198,0.4)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10
                }}>
                  <div style={{ filter: 'drop-shadow(0 0 12px rgba(96,221,198,0.6))', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0 20px' }}>
                     <img src="/images/dentallab-logo.png" alt="DentalLabPro" style={{ width: '100%', height: 'auto', maxHeight: '110px', objectFit: 'contain' }} />
                  </div>
                </div>

                {/* The Rotating Carrier Ring */}
                <div className="orbit-ring" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 20 }}>
                  {activeFeatures.map((feat, i) => {
                    const angle = (i * 360) / activeFeatures.length;
                    const r = 330; // Matches edge of the 660px container
                    const isHovered = hoveredFeature === i;
                    const isAnyHovered = hoveredFeature !== null;
                    
                    return (
                      <div key={i} style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: `rotate(${angle}deg) translate(${r}px)`,
                        zIndex: isHovered ? 50 : 20,
                      }}>
                        {/* Perfect-center pivot point wrapper */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          
                          {/* STATIC ANTI-ROTATOR: Neutralizes the wrapper's rotate(angle) so the card is perfectly horizontal by default! */}
                          <div style={{ transform: `rotate(-${angle}deg)` }}>
                            
                            {/* DYNAMIC COUNTER-ROTATING CHILD: Ensures text stays upright dynamically while the parent ring spins! */}
                            <div className="orbit-item">
                              <div 
                                onMouseEnter={() => setHoveredFeature(i)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                style={{
                                   width: isHovered ? 340 : 230,
                                   borderRadius: 20,
                                   background: isHovered ? (theme === 'dark' ? 'rgba(28, 24, 38, 0.98)' : 'rgba(0, 0, 0, 1)') : (theme === 'dark' ? 'rgba(12, 10, 15, 0.85)' : 'rgba(10, 10, 10, 0.85)'),
                                   border: `1px solid ${isHovered ? feat.color + '80' : (theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)')}`,
                                   padding: isHovered ? 28 : 20, 
                                   cursor: 'pointer',
                                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                   boxShadow: isHovered 
                                     ? (theme === 'dark' ? `0 30px 60px rgba(0,0,0,0.9), 0 0 40px ${feat.color}40` : `0 30px 60px rgba(255,255,255,0.1), 0 0 40px ${feat.color}40`) 
                                     : (theme === 'dark' ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(255,255,255,0.08)'),
                                   transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                   opacity: isHovered ? 1 : (isAnyHovered ? 0.3 : 1),
                                   transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                   backdropFilter: 'blur(12px)',
                                }}
                              >
                                 <feat.icon size={isHovered ? 32 : 26} color={isHovered ? feat.color : (theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)')} style={{ marginBottom: 12, transition: 'all 0.4s' }} />
                                 
                                 <h3 style={{ fontSize: isHovered ? 18 : 15, fontWeight: 800, color: isHovered ? '#fff' : (theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#fff'), transition: 'all 0.4s', marginBottom: isHovered ? 10 : 0 }}>
                                   {feat.title}
                                 </h3>
                                 
                                 {/* Description only expands beautifully when hovered */}
                                 <div style={{ 
                                   overflow: 'hidden', transition: 'all 0.4s',
                                   opacity: isHovered ? 1 : 0, 
                                   maxHeight: isHovered ? 100 : 0,
                                   marginTop: isHovered ? 4 : 0
                                 }}>
                                   <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                                     {feat.desc}
                                   </p>
                                 </div>
                                 
                                 {/* Hover interior glow */}
                                 {isHovered && (
                                   <div style={{
                                     position: 'absolute', inset: 0, zIndex: -1, borderRadius: 20,
                                     background: `radial-gradient(circle at top, ${feat.color}20 0%, transparent 70%)`,
                                     pointerEvents: 'none'
                                   }} />
                                 )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════ CINEMATIC WAVE BANNER ════════════════════ */}
        <div style={{ width: '100%', position: 'relative', background: 'radial-gradient(ellipse at center, #1b1535 0%, #130f23 100%)', overflow: 'hidden' }}>
          
          {/* Top dark layered waves tinted with the app's #080610 dark theme transitioning into the banner's #130f23 */}
          <div style={{ position: 'relative', height: '120px', width: '100%', overflow: 'hidden' }}>
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, width: '100%', height: '100%' }}>
              <path d="M0,0 C320,80 420,80 720,40 C1020,0 1120,0 1440,40 L1440,0 L0,0 Z" fill="#080610"></path>
              <path d="M0,30 C320,110 420,110 720,70 C1020,30 1120,30 1440,70 L1440,0 L0,0 Z" fill="#0c0919"></path>
              <path d="M0,60 C320,140 420,140 720,100 C1020,60 1120,60 1440,100 L1440,0 L0,0 Z" fill="#130f23"></path>
            </svg>
          </div>

          {/* Central Deep Indigo Banner (Height Augmented via massive padding) */}
          <div style={{ padding: '140px 20px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
             <h2 style={{
                fontSize: 'clamp(32px, 5vw, 60px)', 
                fontWeight: 900, 
                color: '#ffffff', 
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textTransform: 'uppercase',
                maxWidth: 1300, 
                margin: '0 auto', 
                lineHeight: 1.15,
                letterSpacing: '0px',
             }}>
               Connectez laboratoires et cliniques<br/>
               <span 
                 className="text-gradient" 
                 style={{ 
                   fontSize: 'clamp(28px, 4.5vw, 54px)', 
                   background: 'linear-gradient(135deg, #60ddc6 0%, #818cf8 40%, #c084fc 100%)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   display: 'inline-block',
                   marginTop: 10
                 }}
               >
                 avec une efficacité à vitesse lumière.
               </span>
             </h2>
          </div>

          {/* Bottom dark layered waves (flipped symmetrically) */}
          <div style={{ position: 'relative', height: '120px', width: '100%', overflow: 'hidden' }}>
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%', transform: 'scaleY(-1)' }}>
              <path d="M0,0 C320,80 420,80 720,40 C1020,0 1120,0 1440,40 L1440,0 L0,0 Z" fill="#080610"></path>
              <path d="M0,30 C320,110 420,110 720,70 C1020,30 1120,30 1440,70 L1440,0 L0,0 Z" fill="#0c0919"></path>
              <path d="M0,60 C320,140 420,140 720,100 C1020,60 1120,60 1440,100 L1440,0 L0,0 Z" fill="#130f23"></path>
            </svg>
          </div>

        </div>

        {/* ════════════════════ MEGA SCHEMA ARCHITECTURAL (IMAGE MATCH) ════════════════════ */}
        <div id="ecosystem" style={{ maxWidth: 1400, margin: '140px auto', padding: '0 32px' }}>
           
           <div style={{ textAlign: 'center', marginBottom: 60 }}>
             <div className="badge-glow" style={{ marginBottom: 24, borderColor: 'rgba(96,221,198,0.3)', color: '#60ddc6' }}>
               <Zap size={14} /> {t.ecoTag}
             </div>
             <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
               {t.ecoTitle1}<br/>{t.ecoTitle2}
             </h2>
             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
               {t.ecoSub}
             </p>
           </div>
           
           {/* MEGA GRID LAYOUT */}
           <div style={{ 
              display: 'flex', 
              gap: 0, 
              alignItems: 'stretch',
              justifyContent: 'center',
              flexWrap: 'wrap'
           }}>
              
              {/* === LEFT BOX: LABORATOIRES === */}
              <div style={{ flex: '1 1 500px', background: 'rgba(96,221,198,0.02)', border: '1px solid rgba(96,221,198,0.3)', borderRadius: 24, padding: 32, position: 'relative' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(96,221,198,0.1)', padding: 12, borderRadius: '16px' }}>
                      <Wrench size={28} color="#60ddc6" />
                    </div>
                    <div>
                       <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{t.ecoLab1}</h3>
                       <span style={{ color: '#60ddc6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{t.ecoLab2}</span>
                    </div>
                 </div>
                 
                 <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 30 }}>
                    {t.ecoLabDesc}
                 </p>
                 
                 {/* Inner Circular Schema Box */}
                 <div style={{ background: 'rgba(96,221,198,0.03)', border: '1px solid rgba(96,221,198,0.15)', borderRadius: 20, padding: '24px 16px', position: 'relative', marginTop: 20 }}>
                    <h5 style={{ textAlign: 'center', color: '#fff', fontWeight: 700, marginBottom: 30, fontSize: 18 }}>{t.ecoLabStepLabel}</h5>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                       {/* Left Column Nodes */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: -8, right: -8, background: '#34d399', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 2 }}>{t.ecoLabSteps[1]}</strong>
                             <strong style={{ display: 'block', color: '#60ddc6', fontSize: 12, marginBottom: 4 }}>{lang === 'FR' ? 'Attribution des Tâches :' : 'Task Assignment :'}</strong>
                             <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{lang === 'FR' ? 'Assignez facilement la conception CAO et la fabrication au technicien le plus adéquat.' : 'Easily assign CAD design and manufacturing to the most suitable technician.'}</p>
                          </div>
                          
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: -8, right: -8, background: '#34d399', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 2 }}>{t.ecoLabSteps[2]}</strong>
                             <strong style={{ display: 'block', color: '#60ddc6', fontSize: 12, marginBottom: 4 }}>{lang === 'FR' ? 'Gestion des Matériaux :' : 'Material Management :'}</strong>
                             <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{lang === 'FR' ? 'Surveillez vos stocks internes et la tarification de fabrication.' : 'Monitor your internal stocks and manufacturing pricing.'}</p>
                          </div>
                       </div>
                       
                       {/* Center Ring */}
                       <div style={{ width: 150, height: 150, borderRadius: '50%', border: '2px solid rgba(96,221,198,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', flexShrink: 0, background: 'radial-gradient(circle, rgba(96,221,198,0.1) 0%, transparent 70%)', boxShadow: '0 0 30px rgba(96,221,198,0.1)' }}>
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{lang === 'FR' ? <>Flux de<br/>Production<br/>de Prothèse</> : <>Prosthetic<br/>Production<br/>Flow</>}</span>
                       </div>

                       {/* Right Column Nodes */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: -8, right: -8, background: '#34d399', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 2 }}>{t.ecoLabSteps[4]}</strong>
                             <strong style={{ display: 'block', color: '#60ddc6', fontSize: 12, marginBottom: 4 }}>{lang === 'FR' ? 'Contrôle Qualité :' : 'Quality Control :'}</strong>
                             <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{lang === 'FR' ? 'Surveillez systématiquement la fabrication CAO/FAO interne.' : 'Systematically monitor internal CAD/CAM manufacturing.'}</p>
                          </div>
                          
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: -8, right: -8, background: '#34d399', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 2 }}>{t.ecoLabSteps[0]}</strong>
                             <strong style={{ display: 'block', color: '#60ddc6', fontSize: 12, marginBottom: 4 }}>{lang === 'FR' ? 'Réception Intégrée :' : 'Integrated Receipt :'}</strong>
                             <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{lang === 'FR' ? 'Visualisez et organisez les empreintes 3D directement.' : 'Visualize and organize 3D impressions directly.'}</p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Bottom Center Node */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: -15, position: 'relative', zIndex: 5 }}>
                       <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', maxWidth: 280, backdropFilter: 'blur(10px)' }}>
                          <div style={{ position: 'absolute', top: -8, right: -8, background: '#34d399', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                          <strong style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 2 }}>{lang === 'FR' ? 'Gestion des Commandes' : 'Global Order Management'}</strong>
                          <strong style={{ display: 'block', color: '#60ddc6', fontSize: 12, marginBottom: 4 }}>{lang === 'FR' ? 'Vue d\'Ensemble :' : 'Overview :'}</strong>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{lang === 'FR' ? 'Surveillez l\'ensemble de vos commandes et le flux entrant externe.' : 'Monitor all your orders and the external incoming flow.'}</p>
                       </div>
                    </div>

                    {/* Fake UI Element Mockup */}
                    <div style={{ position: 'absolute', bottom: -10, left: 10, background: '#1c1b22', border: '1px solid rgba(96,221,198,0.3)', padding: 12, borderRadius: 12, width: 200, zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                       <div style={{ color: '#fff', fontSize: 10, fontWeight: 700, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}><span>{lang === 'FR' ? 'Commandes actives' : 'Active lab orders'}</span> <span>...</span></div>
                       <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9 }}>Order #MG546G...</span>
                          <span style={{ color: '#f59e0b', fontSize: 9, background: 'rgba(245,158,11,0.2)', padding: '2px 6px', borderRadius: 4 }}>{lang === 'FR' ? 'Reçu' : 'Received'}</span>
                       </div>
                       <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9 }}>Order #MG546D...</span>
                          <span style={{ color: '#34d399', fontSize: 9, background: 'rgba(52,211,153,0.2)', padding: '2px 6px', borderRadius: 4 }}>{lang === 'FR' ? 'Terminé' : 'Done'}</span>
                       </div>
                    </div>

                 </div>
              </div>

              {/* === CENTRAL BRIDGE CONNECTION === */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10px', position: 'relative', zIndex: 10 }}>
                 
                 {/* Connection Ribbon Lines behind */}
                 <div style={{ position: 'absolute', top: '50%', left: -40, right: -40, height: 2, background: 'linear-gradient(90deg, #60ddc6, #818cf8)', zIndex: 0, opacity: 0.5 }} />
                 <div style={{ position: 'absolute', top: '45%', left: -30, right: -30, height: 2, background: 'linear-gradient(90deg, #60ddc6, #818cf8)', zIndex: 0, opacity: 0.3 }} />
                 <div style={{ position: 'absolute', top: '55%', left: -30, right: -30, height: 2, background: 'linear-gradient(90deg, #60ddc6, #818cf8)', zIndex: 0, opacity: 0.3 }} />

                 <div style={{ position: 'relative', zIndex: 2, background: '#080610', padding: 12, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #60ddc6, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(96,221,198,0.5)' }}>
                      <Zap size={30} color="#fff" />
                   </div>
                 </div>
                 
                 <div style={{ textAlign: 'center', marginTop: 16, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                    Synchronisation<br/>de Données &<br/>Collaboration en<br/>Temps Réel
                 </div>

                 {/* Shield Block */}
                 <div style={{
                    position: 'absolute', bottom: -100,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    transform: 'translateY(50%)'
                 }}>
                  <ShieldPlus size={24} color="#60ddc6" />
                  <div>
                    <div style={{ color: '#60ddc6', fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>{t.ecoShieldLabel}</div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="#60ddc6" /> {t.ecoShield1}
                    </div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="#60ddc6" /> {t.ecoShield2}
                    </div>
                  </div>
              </div>
              </div>
              
              {/* === RIGHT BOX: CLINIQUES === */}
              <div style={{ flex: '1 1 500px', background: 'rgba(129,140,248,0.02)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 24, padding: 32, position: 'relative' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(129,140,248,0.1)', padding: 12, borderRadius: '16px' }}>
                      <Stethoscope size={28} color="#818cf8" />
                    </div>
                    <div>
                       <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{t.ecoClinic1}</h3>
                       <span style={{ color: '#818cf8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{t.ecoClinic2}</span>
                    </div>
                 </div>
                 
                 <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 30 }}>
                    {t.ecoClinicDesc}
                 </p>
                 
                 {/* Inner Digital Patient Box */}
                 <div style={{ background: 'rgba(129,140,248,0.03)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 20, padding: '24px', position: 'relative', marginTop: 20 }}>
                    <h5 style={{ textAlign: 'center', color: '#fff', fontWeight: 700, marginBottom: 30, fontSize: 18 }}>Parcours Patient Numérique</h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                       
                       {/* Row 1 */}
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 8, padding: '12px', color: '#fff', fontSize: 13, fontWeight: 600, width: 140, textAlign: 'center', flexShrink: 0 }}>
                             Prescription &<br/>Envoi au Labo
                          </div>
                          
                          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, position: 'relative' }}>
                             <div style={{ position: 'absolute', top: '50%', left: -14, transform: 'translateY(-50%)', background: '#818cf8', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 14, marginBottom: 6 }}>Formulaires de Prescription Digitaux</strong>
                             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>Sélectionnez visuellement les dents (Odontogramme), les nuances et modalités en seulement 3 clics.</p>
                          </div>
                       </div>

                       {/* Row 2 */}
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 8, padding: '12px', color: '#fff', fontSize: 13, fontWeight: 600, width: 140, textAlign: 'center', flexShrink: 0 }}>
                             Consultation &<br/>Support
                          </div>
                          
                          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, position: 'relative' }}>
                             <div style={{ position: 'absolute', top: '50%', left: -14, transform: 'translateY(-50%)', background: '#818cf8', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 14, marginBottom: 6 }}>Support & Assistance Directe :</strong>
                             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>Ouvrez immédiatement un ticket d'assistance ou discutez avec le technicien en charge d'un cas complexe.</p>
                          </div>
                       </div>

                       {/* Row 3 */}
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 8, padding: '12px', color: '#fff', fontSize: 13, fontWeight: 600, width: 140, textAlign: 'center', flexShrink: 0 }}>
                             Patient<br/>Dossiers
                          </div>
                          
                          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, position: 'relative' }}>
                             <div style={{ position: 'absolute', top: '50%', left: -14, transform: 'translateY(-50%)', background: '#818cf8', borderRadius: '50%', padding: 2 }}><CheckCircle2 size={12} color="#000" /></div>
                             <strong style={{ display: 'block', color: '#fff', fontSize: 14, marginBottom: 6 }}>Dossiers Patients Centralisés :</strong>
                             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>Générez des plans de traitement clairs depuis la plateforme.</p>
                          </div>
                       </div>

                    </div>

                    {/* Odontogram Mockup UI */}
                    <div style={{ position: 'absolute', top: 90, right: -40, background: '#1c1b22', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 16, padding: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                       <div style={{ width: 100, height: 100, borderRadius: '50%', border: '2px dashed rgba(129,140,248,0.3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(129,140,248,0.6)' }} />
                         <div style={{ position: 'absolute', top: '10%', left: '50%', width: 2, height: 80, background: 'rgba(129,140,248,0.1)' }} />
                         <div style={{ position: 'absolute', top: '50%', left: '10%', width: 80, height: 2, background: 'rgba(129,140,248,0.1)' }} />
                         {/* Fake teeth arch dots */}
                         {[...Array(12)].map((_, i) => (
                           <div key={i} style={{ 
                             position: 'absolute', 
                             top: 'calc(50% - 3px)', 
                             left: 'calc(50% - 3px)', 
                             width: 6, 
                             height: 6, 
                             background: '#fff', 
                             borderRadius: '50%', 
                             transform: `rotate(${i * 30}deg) translateY(-50px)` 
                           }} />
                         ))}
                       </div>
                    </div>

                    {/* Calendar Mockup UI */}
                    <div style={{ position: 'absolute', bottom: -30, right: -30, background: '#1c1b22', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                       <div style={{ color: '#fff', fontSize: 11, fontWeight: 700, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}><span>Appointments</span> <span>&lt; &gt;</span></div>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                       </div>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', fontSize: 10, color: '#fff' }}>
                          <span style={{opacity: 0.3}}>28</span><span style={{opacity: 0.3}}>29</span><span style={{opacity: 0.3}}>30</span>
                          <span>1</span><span>2</span><span>3</span><span>4</span>
                          <span>5</span><span>6</span><span>7</span><span style={{ background: '#818cf8', color: '#000', borderRadius: 4, fontWeight: 'bold' }}>8</span><span>9</span><span>10</span><span>11</span>
                          <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                       </div>
                    </div>

                 </div>
              </div>
              
           </div>
        </div>

        {/* ════════════════════ CONTACT SECTION ════════════════════ */}
        <hr className="section-glow" />

        <div id="contact" style={{ padding: '120px 32px', background: '#080610', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.04) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div className="badge-glow" style={{ marginBottom: 20, display: 'inline-flex', color: '#60ddc6', background: 'rgba(96,221,198,0.06)', borderColor: 'rgba(96,221,198,0.15)' }}>
                <MessageSquare size={12} /> Contact
              </div>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Prêt à faire évoluer votre <span className="text-gradient">dentisterie ?</span>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(241,240,248,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                Contactez notre équipe pour une démonstration ou pour toute question sur nos solutions logicielles sur mesure.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'center' }}>
              
              {/* Informations de contact (Gauche) */}
              <div style={{ flex: '1 1 400px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                       <div style={{ padding: 16, background: 'rgba(96,221,198,0.1)', borderRadius: 16, border: '1px solid rgba(96,221,198,0.2)' }}>
                          <MessageSquare size={24} color="#60ddc6" />
                       </div>
                       <div>
                          <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Demande de Démo</h4>
                          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 8 }}>Découvrez comment DentalLabPro peut s'adapter exactement à votre flux de travail.</p>
                          <a href="mailto:contact@dentallabpro.com" style={{ color: '#60ddc6', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>contact@dentallabpro.com</a>
                       </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                       <div style={{ padding: 16, background: 'rgba(129,140,248,0.1)', borderRadius: 16, border: '1px solid rgba(129,140,248,0.2)' }}>
                          <Users size={24} color="#818cf8" />
                       </div>
                       <div>
                          <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Support Client</h4>
                          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 8 }}>Déjà client ? Notre équipe technique dédiée est prête à vous assister.</p>
                          <span style={{ color: '#818cf8', fontWeight: 600, fontSize: 14 }}>support@dentallabpro.com</span>
                       </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                       <div style={{ padding: 16, background: 'rgba(192,132,252,0.1)', borderRadius: 16, border: '1px solid rgba(192,132,252,0.2)' }}>
                          <Globe2 size={24} color="#c084fc" />
                       </div>
                       <div>
                          <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Siège Social & Déploiement</h4>
                          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 8 }}>Agadir, Maroc<br/>(Solutions dédiées aux cliniques et laboratoires de la région Souss-Massa)</p>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Formulaire (Droite) */}
              <div style={{ flex: '1 1 450px' }}>
                 <div className="card-3d" style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                       <div style={{ display: 'flex', gap: 20 }}>
                          <div style={{ flex: 1 }}>
                             <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Nom complet</label>
                             <input type="text" placeholder="Dr. Ahmed..." style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', outline: 'none' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                             <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Entreprise</label>
                             <input type="text" placeholder="Clinique / Labo" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', outline: 'none' }} />
                          </div>
                       </div>
                       
                       <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Email professionnel</label>
                          <input type="email" placeholder="contact@votreclinique.com" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', outline: 'none' }} />
                       </div>

                       <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Message</label>
                          <textarea placeholder="Comment pouvons-nous optimiser votre flux de production ?" rows={4} style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', outline: 'none', resize: 'none' }}></textarea>
                       </div>

                       <button type="button" className="btn-hero" style={{ width: '100%', padding: '16px', justifyContent: 'center', marginTop: 10, fontSize: 15, cursor: 'pointer', border: 'none', borderRadius: '12px' }}>
                          Envoyer le message <ArrowRight size={18} />
                       </button>
                    </form>
                 </div>
              </div>

            </div>

          </div>
        </div>


        {/* ════════════════════ FOOTER ════════════════════ */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '24px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/logo.png" className="w-5 h-5 object-contain" alt="Logo" />
            <span style={{ fontSize: 12.5, color: 'rgba(241,240,248,0.25)', fontWeight: 500 }}>© 2026 DentalLabPro. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(241,240,248,0.25)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#60ddc6')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,240,248,0.25)')}
              >{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
