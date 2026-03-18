import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Activity, Users, FileText, MessageSquare, Clock, ArrowRight, Zap, CheckCircle2, ShieldPlus, ChevronDown, Sparkles, Globe2, BarChart3 } from 'lucide-react';
import SplineBackground from '@/Components/SplineBackground';
import { useEffect, useState, useRef } from 'react';

const SPLINE_SCENE = 'https://prod.spline.design/dMwT5dUZYvBMbVxl/scene.splinecode';

const features = [
    {
        icon: FileText, color: '#60ddc6', bg: 'rgba(96,221,198,0.06)',
        title: 'Digital Lab Orders',
        desc: 'Create detailed lab orders with a teeth-selection wizard, file attachments, and clinical notes.',
    },
    {
        icon: Clock, color: '#818cf8', bg: 'rgba(129,140,248,0.06)',
        title: 'Real-time Tracking',
        desc: 'Monitor case status from submission to delivery with instant production stage updates.',
    },
    {
        icon: MessageSquare, color: '#c084fc', bg: 'rgba(192,132,252,0.06)',
        title: 'Instant Messaging',
        desc: 'Direct communication between clinicians and technicians — tied to each specific case.',
    },
    {
        icon: ShieldCheck, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)',
        title: 'Role-Based Access',
        desc: 'Secure portals for Lab Owners, Dentists, Technicians, and Assistants.',
    },
    {
        icon: BarChart3, color: '#34d399', bg: 'rgba(52,211,153,0.06)',
        title: 'Analytics & Reports',
        desc: 'Gain insights into monthly volume, revenue, and popular services with visual charts.',
    },
    {
        icon: Users, color: '#60a5fa', bg: 'rgba(96,165,250,0.06)',
        title: 'Team Management',
        desc: 'Invite and manage staff members seamlessly. Collaborate within your organization.',
    },
];

export default function Welcome({ auth }: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [scrollY, setScrollY] = useState(0);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        setHeroVisible(true);
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const parallaxOffset = scrollY * 0.3;

    return (
        <>
            <Head title="DentalLab — Modern Dental Laboratory Platform" />

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
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::selection { background: rgba(96,221,198,0.25); }

                /* ── Animations ──────────────────── */
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to   { opacity: 1; transform: translateY(0); }
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
                    to   { opacity: 1; transform: perspective(800px) rotateY(0deg) translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to   { opacity: 1; transform: scale(1); }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 11,
                            background: 'linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(96,221,198,0.2)',
                        }}>
                            <ShieldPlus size={17} color="#fff" />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.5px' }}>DentalLab</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="btn-hero" style={{ padding: '9px 20px', fontSize: 13, animation: 'none' }}>
                                Dashboard <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'rgba(241,240,248,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#f1f0f8')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,240,248,0.6)')}
                                >Sign In</Link>
                                <Link href={route('register')} style={{
                                    padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700,
                                    color: '#60ddc6', textDecoration: 'none',
                                    border: '1px solid rgba(96,221,198,0.25)',
                                    background: 'rgba(96,221,198,0.06)',
                                    transition: 'background 0.2s, border-color 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,221,198,0.12)'; e.currentTarget.style.borderColor = 'rgba(96,221,198,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,221,198,0.06)'; e.currentTarget.style.borderColor = 'rgba(96,221,198,0.25)'; }}
                                >Get Started</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* ════════════════════ 3D HERO ════════════════════ */}
                <SplineBackground
                    sceneUrl={SPLINE_SCENE}
                    fallbackColor="#080610"
                    mobileBreakpoint={768}
                >
                    {/* Layer 1: Almost-opaque base — kills ALL Spline text */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        background: '#080610',
                        opacity: 0.88,
                        pointerEvents: 'none',
                    }} />

                    {/* Layer 2: Vignette-style reveal — transparent at edges so 3D colors glow through */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        background: `radial-gradient(ellipse 70% 60% at 50% 50%, #080610 0%, rgba(8,6,16,0.7) 50%, transparent 100%)`,
                        pointerEvents: 'none',
                    }} />

                    {/* Layer 3: Bottom gradient for seamless transition to features */}
                    <div style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%', zIndex: 1,
                        background: 'linear-gradient(to bottom, transparent, #080610)',
                        pointerEvents: 'none',
                    }} />

                    {/* Subtle grid */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                        pointerEvents: 'none',
                        mask: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
                        WebkitMask: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
                    }} />

                    {/* Ambient 3D glow orbs — sit ABOVE overlay, creating immersive light feel */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
                        {/* Teal orb bottom-left */}
                        <div style={{
                            position: 'absolute', bottom: '10%', left: '-5%',
                            width: 500, height: 500, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(96,221,198,0.12) 0%, transparent 60%)',
                            filter: 'blur(80px)',
                            animation: 'float 10s ease-in-out infinite',
                        }} />
                        {/* Indigo orb top-right */}
                        <div style={{
                            position: 'absolute', top: '5%', right: '-5%',
                            width: 600, height: 600, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 60%)',
                            filter: 'blur(80px)',
                            animation: 'float 13s ease-in-out infinite reverse',
                        }} />
                        {/* Purple orb center-bottom */}
                        <div style={{
                            position: 'absolute', bottom: '20%', right: '20%',
                            width: 350, height: 350, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 60%)',
                            filter: 'blur(60px)',
                            animation: 'float 16s ease-in-out infinite 3s',
                        }} />
                    </div>

                    {/* Hero Content */}
                    <div className={heroVisible ? 'hero-visible' : ''} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: '100%', position: 'relative', zIndex: 2,
                        textAlign: 'center', padding: '60px 24px 0',
                    }}>
                        <div style={{ maxWidth: 700, transform: `translateY(${-parallaxOffset * 0.2}px)` }}>
                            <div className="fade-1" style={{ marginBottom: 28 }}>
                                <span className="badge-glow">
                                    <Sparkles size={12} />
                                    Immersive 3D Experience
                                </span>
                            </div>

                            <h1 className="fade-2" style={{
                                fontSize: 'clamp(38px, 6vw, 64px)',
                                fontWeight: 900,
                                lineHeight: 1.04,
                                letterSpacing: '-3px',
                                marginBottom: 20,
                                textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                            }}>
                                The Future of<br />
                                <span className="text-gradient">Dental Laboratories</span>
                            </h1>

                            <p className="fade-3" style={{
                                fontSize: 16.5,
                                color: 'rgba(241,240,248,0.5)',
                                maxWidth: 480,
                                margin: '0 auto 36px',
                                lineHeight: 1.75,
                                textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                            }}>
                                Connect clinics and laboratories in one unified platform.
                                Manage orders, track production, and grow your business.
                            </p>

                            <div className="fade-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="btn-hero">
                                        Open Dashboard <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('register')} className="btn-hero">
                                            Start for Free <ArrowRight size={16} />
                                        </Link>
                                        <Link href={route('login')} className="btn-glass">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Stats Row */}
                            <div className="fade-5" style={{
                                marginTop: 64,
                                display: 'inline-flex', alignItems: 'center', gap: 0,
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(12px)',
                                overflow: 'hidden',
                            }}>
                                {[
                                    { val: '500+', label: 'Lab Partners' },
                                    { val: '50k+', label: 'Orders' },
                                    { val: '99.9%', label: 'Uptime' },
                                    { val: '<2min', label: 'Response' },
                                ].map((s, i) => (
                                    <div key={s.label} style={{
                                        padding: '16px 28px',
                                        textAlign: 'center',
                                        borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                    }}>
                                        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: '#60ddc6', textShadow: '0 0 18px rgba(96,221,198,0.25)' }}>{s.val}</div>
                                        <div style={{ fontSize: 10.5, color: 'rgba(241,240,248,0.35)', fontWeight: 600, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div style={{
                        position: 'absolute', bottom: 28, left: '50%',
                        animation: 'bounceDown 2.5s ease-in-out infinite',
                        zIndex: 3, opacity: 0.4,
                    }}>
                        <ChevronDown size={22} />
                    </div>
                </SplineBackground>

                {/* ════════════════════ FEATURES ════════════════════ */}
                <hr className="section-glow" />

                <div style={{ padding: '120px 32px', background: '#080610', position: 'relative', overflow: 'hidden' }}>
                    {/* Ambient glow */}
                    <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.03) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

                    <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <div style={{ textAlign: 'center', marginBottom: 72 }}>
                            <div className="badge-glow" style={{ marginBottom: 20, display: 'inline-flex' }}>
                                <Globe2 size={12} /> Platform Capabilities
                            </div>
                            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>
                                Everything you need,<br />
                                <span className="text-gradient">nothing you don't</span>
                            </h2>
                            <p style={{ fontSize: 15.5, color: 'rgba(241,240,248,0.4)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
                                Powerful tools built specifically for modern dental clinics and laboratories.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                            {features.map((feat, i) => (
                                <div key={feat.title} className="card-3d" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 20, border: `1px solid ${feat.color}15`,
                                        boxShadow: `0 0 20px ${feat.color}08`,
                                    }}>
                                        <feat.icon size={22} color={feat.color} />
                                    </div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#f1f0f8' }}>{feat.title}</h3>
                                    <p style={{ fontSize: 13.5, color: 'rgba(241,240,248,0.4)', lineHeight: 1.75 }}>{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════ WHY US ════════════════════ */}
                <hr className="section-glow" />

                <div style={{ padding: '120px 32px', background: '#080610', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.025) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                    <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 2 }}>
                        {/* Left — Copy */}
                        <div>
                            <div className="badge-glow" style={{ marginBottom: 24, display: 'inline-flex' }}>
                                <Zap size={12} /> Why DentalLab
                            </div>
                            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
                                Built by labs,<br />for <span className="text-gradient">labs.</span>
                            </h2>
                            <p style={{ fontSize: 15, color: 'rgba(241,240,248,0.4)', lineHeight: 1.8, marginBottom: 36, maxWidth: 400 }}>
                                Every feature was designed around how dental labs actually work — not how a generic SaaS thinks they do.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    'Zero paperwork — fully digital workflow',
                                    'Real-time notifications & status updates',
                                    'Secure file sharing & case attachments',
                                    'Multi-role access control',
                                    'Integrated billing & invoicing',
                                    'Production Kanban board',
                                ].map(b => (
                                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                            background: 'rgba(96,221,198,0.08)',
                                            border: '1px solid rgba(96,221,198,0.12)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <CheckCircle2 size={13} color="#60ddc6" />
                                        </div>
                                        <span style={{ fontSize: 13.5, color: 'rgba(241,240,248,0.7)', fontWeight: 500 }}>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Stats grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Active Labs', value: '500+', accent: '#60ddc6', glow: 'rgba(96,221,198,0.08)' },
                                { label: 'Orders / Month', value: '12k+', accent: '#818cf8', glow: 'rgba(129,140,248,0.08)' },
                                { label: 'Clinics Connected', value: '1,800+', accent: '#c084fc', glow: 'rgba(192,132,252,0.08)' },
                                { label: 'Customer Rating', value: '4.9 ★', accent: '#f59e0b', glow: 'rgba(245,158,11,0.08)' },
                            ].map(s => (
                                <div key={s.label} className="stat-3d">
                                    <div style={{
                                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                        width: '60%', height: 1,
                                        background: `linear-gradient(90deg, transparent, ${s.accent}30, transparent)`,
                                    }} />
                                    <div style={{ fontSize: 32, fontWeight: 900, color: s.accent, letterSpacing: '-1px', marginBottom: 6, textShadow: `0 0 20px ${s.glow}` }}>{s.value}</div>
                                    <div style={{ fontSize: 11.5, color: 'rgba(241,240,248,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════ FINAL CTA ════════════════════ */}
                <hr className="section-glow" />

                <div style={{
                    padding: '100px 32px',
                    textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(180deg, #080610 0%, rgba(96,221,198,0.02) 50%, #080610 100%)',
                }}>
                    {/* Radial glow */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.04) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                    <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16, lineHeight: 1.1 }}>
                            Ready to modernize<br />
                            <span className="text-gradient">your lab?</span>
                        </h2>
                        <p style={{ fontSize: 15.5, color: 'rgba(241,240,248,0.4)', marginBottom: 40, lineHeight: 1.7 }}>
                            Join hundreds of dental laboratories already running on DentalLab.
                        </p>
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {auth.user ? (
                                <Link href={route('dashboard')} className="btn-hero">
                                    Open Dashboard <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="btn-hero">
                                        Get Started Free <ArrowRight size={16} />
                                    </Link>
                                    <Link href={route('login')} className="btn-glass">
                                        Sign In
                                    </Link>
                                </>
                            )}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 7,
                            background: 'linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <ShieldPlus size={12} color="#fff" />
                        </div>
                        <span style={{ fontSize: 12.5, color: 'rgba(241,240,248,0.25)', fontWeight: 500 }}>© 2026 DentalLab. All rights reserved.</span>
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
