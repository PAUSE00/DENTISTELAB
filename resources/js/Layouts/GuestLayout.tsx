import { PropsWithChildren } from 'react';
import { ShieldPlus, Zap, CheckCircle2, Users, Activity } from 'lucide-react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0c1a',
            display: 'flex',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#f1f0f8',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::selection { background: rgba(96,221,198,0.2); }
                @keyframes floatBlob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-18px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .blob1 { animation: floatBlob 9s ease-in-out infinite; }
                .blob2 { animation: floatBlob 12s ease-in-out infinite reverse; }
                .auth-card { animation: fadeIn 0.5s ease both 0.1s; }
            `}</style>

            {/* ── Left Panel — Branding ─────────────────────────── */}
            <div style={{
                display: 'none',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1a1728 0%, #0f0c1a 60%, #12101e 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
                className="auth-left-panel"
            >
                {/* Grid background */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

                {/* Blobs */}
                <div className="blob1" style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="blob2" style={{ position: 'absolute', bottom: '15%', right: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: 48 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldPlus size={18} color="#fff" />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>DentalLab</span>
                    </div>

                    {/* Main content */}
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(96,221,198,0.08)', border: '1px solid rgba(96,221,198,0.2)', color: '#60ddc6', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 24 }}>
                            <Zap size={11} />
                            Premium Platform
                        </div>
                        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20, color: '#f1f0f8' }}>
                            The future of<br />
                            <span style={{ background: 'linear-gradient(135deg, #60ddc6, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>dental lab management</span>
                        </h1>
                        <p style={{ fontSize: 15, color: 'rgba(241,240,248,0.45)', lineHeight: 1.75, maxWidth: 360 }}>
                            Connect clinics and laboratories seamlessly. From case submission to delivery — all in one place.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
                            {[
                                { icon: CheckCircle2, text: 'Real-time production tracking' },
                                { icon: Users, text: 'Multi-role access for your team' },
                                { icon: Activity, text: 'Advanced analytics & reporting' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(96,221,198,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={13} color="#60ddc6" />
                                    </div>
                                    <span style={{ fontSize: 13.5, color: 'rgba(241,240,248,0.65)', fontWeight: 500 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 32 }}>
                        {[{ val: '500+', label: 'Labs' }, { val: '1,800+', label: 'Clinics' }, { val: '50k+', label: 'Orders' }].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#60ddc6', letterSpacing: '-0.5px' }}>{s.val}</div>
                                <div style={{ fontSize: 11.5, color: 'rgba(241,240,248,0.35)', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Form ───────────────────────────── */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 24px',
                position: 'relative',
                background: '#0f0c1a',
            }}>
                {/* Subtle bg blob */}
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,221,198,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2 }}>
                    {/* Mobile Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldPlus size={16} color="#fff" />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 700 }}>DentalLab</span>
                    </div>

                    <div className="auth-card">
                        {children}
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .auth-left-panel { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
