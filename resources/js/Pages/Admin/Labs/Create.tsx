import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { ArrowLeft, Activity, Mail, Phone, MapPin, User, Save, X } from 'lucide-react';
import { FormEventHandler } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Owner {
    id: number;
    name: string;
    email: string;
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

export default function Create({ owners }: { owners: Owner[] }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        owner_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.labs.store'));
    };

    return (
        <AdminLayout header={t('Create New Lab')}>
            <Head title={t('Add New Lab')} />

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
                            {t('Add New')} <span style={{ color: 'var(--accent)' }}>{t('Laboratory')}</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Left Sidebar */}
                    <div className="space-y-4">

                        {/* Connection Card */}
                        <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--txt-3)' }}>
                                {t('Connection Status')}
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                    <div className="w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('System Integration Ready')}</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--accent-20)]" style={{ background: 'var(--accent)' }} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Data Sync Pending')}</span>
                                </div>
                            </div>
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
                                                    placeholder="Precision Dental Lab"
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
                                                    placeholder="hello@precisionlab.com"
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
                                                    placeholder="+1 (555) 123-4567"
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
                                                    placeholder="123 Dental Way, Suite A"
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
                                                <option value="" disabled style={{ color: 'var(--txt-3)' }}>Select a lab owner...</option>
                                                {owners.map(o => (
                                                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-[10px] mt-1.5 ml-1" style={{ color: 'var(--txt-3)' }}>{t('Only lab owners without an assigned lab are listed.')}</p>
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
                                    {t('Cancel')}
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? t('Saving...') : t('Save Lab')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
