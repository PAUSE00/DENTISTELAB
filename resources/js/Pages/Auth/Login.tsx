import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const [showPass, setShowPass] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const INPUT_STYLE: React.CSSProperties = {
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '12px 44px 12px 40px',
        fontSize: 14,
        color: '#f1f0f8',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const ICON_STYLE: React.CSSProperties = {
        position: 'absolute',
        left: 13,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(241,240,248,0.25)',
        pointerEvents: 'none',
    };

    const LABEL_STYLE: React.CSSProperties = {
        fontSize: 12,
        fontWeight: 600,
        color: 'rgba(241,240,248,0.5)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 8,
    };

    return (
        <GuestLayout>
            <Head title="Sign In — DentalLab" />

            <div>
                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', color: '#f1f0f8', marginBottom: 8 }}>
                        Welcome back
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(241,240,248,0.4)', lineHeight: 1.6 }}>
                        Sign in to your laboratory workspace.
                    </p>
                </div>

                {/* Status message */}
                {status && (
                    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: 13 }}>
                        {status}
                    </div>
                )}

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Email */}
                    <div>
                        <label style={LABEL_STYLE} htmlFor="email">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={ICON_STYLE} />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={e => setData('email', e.target.value)}
                                style={INPUT_STYLE}
                                placeholder="doctor@clinic.com"
                                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,221,198,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.08)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                        </div>
                        {errors.email && <InputError message={errors.email} className="mt-2" />}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={LABEL_STYLE} htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={15} style={ICON_STYLE} />
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={e => setData('password', e.target.value)}
                                style={INPUT_STYLE}
                                placeholder="••••••••••••"
                                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,221,198,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.08)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,240,248,0.3)', padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,240,248,0.7)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,240,248,0.3)')}
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {errors.password && <InputError message={errors.password} className="mt-2" />}
                    </div>

                    {/* Remember + Forgot */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked as false)}
                                style={{ width: 15, height: 15, accentColor: '#60ddc6', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: 13, color: 'rgba(241,240,248,0.45)', fontWeight: 500 }}>Remember me</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                style={{ fontSize: 13, color: '#60ddc6', textDecoration: 'none', fontWeight: 600, opacity: 0.8, transition: 'opacity 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            width: '100%',
                            padding: '13px 24px',
                            borderRadius: 11,
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            opacity: processing ? 0.7 : 1,
                            border: 'none',
                            background: 'linear-gradient(135deg, #60ddc6 0%, #4f46e5 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 0 24px rgba(96,221,198,0.2)',
                            transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { if (!processing) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(96,221,198,0.3)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = processing ? '0.7' : '1'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 24px rgba(96,221,198,0.2)'; }}
                    >
                        {processing ? (
                            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                        ) : (
                            <>Sign In <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                {/* Footer link */}
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                    <span style={{ fontSize: 13.5, color: 'rgba(241,240,248,0.35)' }}>
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            style={{ color: '#60ddc6', fontWeight: 600, textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                            Create one
                        </Link>
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </GuestLayout>
    );
}
