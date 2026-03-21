import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { ArrowLeft, Save, Activity, MapPin, Phone, User, Mail, Power, X } from 'lucide-react';
import { FormEventHandler } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Lab {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean;
}

interface Owner {
    id: number;
    name: string;
    email: string;
}

interface Props {
    lab: Lab;
    current_owner_id: number | null;
    owners: Owner[];
}

const fieldBase = {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    color: 'var(--txt-1)',
    borderRadius: '12px',
    padding: '11px 14px 11px 42px',
    width: '100%',
    outline: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'border-color 0.2s',
} as React.CSSProperties;

export default function Edit({ lab, current_owner_id, owners }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: lab.name,
        email: lab.email,
        phone: lab.phone,
        address: lab.address,
        owner_id: current_owner_id || '',
        is_active: lab.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.labs.update', lab.id));
    };

    return (
        <AdminLayout header={t('Edit Laboratory')}>
            <Head title={`${t('Edit')} ${lab.name}`} />

            <div className="space-y-8 animate-fade-in pb-12">

                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.labs.index')}
                        className="p-2.5 rounded-xl border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Lab Directory')}</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('Edit')} <span style={{ color: 'var(--accent)' }}>{lab.name}</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Left Sidebar */}
                    <div className="space-y-4">

                        {/* Account Status */}
                        <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--txt-3)' }}>
                                {t('Operational Status')}
                            </p>
                            {/* Status indicator */}
                            <div
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
                                style={{
                                    background: data.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(244,63,94,0.1)',
                                    border: `1.5px solid ${data.is_active ? 'rgba(52,211,153,0.25)' : 'rgba(244,63,94,0.25)'}`,
                                }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: data.is_active ? '#34d399' : '#f43f5e', boxShadow: data.is_active ? '0 0 6px rgba(52,211,153,0.6)' : 'none' }}
                                />
                                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: data.is_active ? '#34d399' : '#f43f5e' }}>
                                    {data.is_active ? t('Lab Active') : t('Lab Suspended')}
                                </span>
                            </div>

                            {/* Toggle button */}
                            <button
                                type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all hover:opacity-80"
                                style={{
                                    background: data.is_active ? 'rgba(244,63,94,0.08)' : 'rgba(52,211,153,0.08)',
                                    borderColor: data.is_active ? 'rgba(244,63,94,0.2)' : 'rgba(52,211,153,0.2)',
                                    color: data.is_active ? '#f43f5e' : '#34d399',
                                }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {data.is_active ? t('Suspend Operations') : t('Restore Operations')}
                                </span>
                                <Power className="w-3.5 h-3.5" />
                            </button>
                        </div>

                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={submit} className="rounded-2xl border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="p-8 space-y-8">

                                {/* Primary Details */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('General Information')}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Lab Name')}</label>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    required
                                                    style={fieldBase}
                                                />
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Email Address')}</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    required
                                                    style={fieldBase}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Phone Number')}</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                                <input
                                                    id="phone"
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    required
                                                    style={fieldBase}
                                                />
                                            </div>
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Physical Address')}</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                                <input
                                                    id="address"
                                                    type="text"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    required
                                                    style={fieldBase}
                                                />
                                            </div>
                                            <InputError message={errors.address} />
                                        </div>

                                    </div>
                                </section>

                                {/* Assignment */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Lead Assignment')}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Operation Manager / Owner')}</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                id="owner_id"
                                                value={data.owner_id}
                                                onChange={e => setData('owner_id', e.target.value)}
                                                required
                                                style={{ ...fieldBase, appearance: 'none', cursor: 'pointer' }}
                                            >
                                                <option value="" disabled style={{ color: 'var(--txt-3)' }}>{t('Select a lab owner...')}</option>
                                                {owners.map(o => (
                                                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-[10px] mt-1.5 ml-1" style={{ color: 'var(--txt-3)' }}>
                                            {t('Current owner and unassigned lab owners are listed.')}
                                        </p>
                                        <InputError message={errors.owner_id} />
                                    </div>
                                </section>

                            </div>

                            {/* Footer */}
                            <div className="px-8 py-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                                <Link
                                    href={route('admin.labs.index')}
                                    className="flex items-center gap-2 text-[12px] font-semibold transition-colors hover:text-[var(--accent)]"
                                    style={{ color: 'var(--txt-3)' }}
                                >
                                    <X className="w-4 h-4" />
                                    {t('Discard Changes')}
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? t('Saving...') : t('Update Lab')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
