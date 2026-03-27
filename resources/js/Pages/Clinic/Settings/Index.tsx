import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Save, Building2, Mail, Phone, MapPin, Image as ImageIcon, Settings } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import useTranslation from '@/Hooks/useTranslation';

interface Clinic {
 id: number; name: string; email: string | null; phone: string | null; address: string | null; logo_path: string | null;
}
interface Props extends PageProps { clinic: Clinic; mustVerifyEmail: boolean; status?: string; }

export default function SettingsIndex({ auth, clinic, mustVerifyEmail, status }: Props) {
 const { flash } = usePage().props as any;
 const { t } = useTranslation();
 const [toast, setToast] = useState<string | null>(null);

 const { data, setData, post, processing, errors, isDirty } = useForm({
 name: clinic.name || '',
 email: clinic.email || '',
 phone: clinic.phone || '',
 address: clinic.address || '',
 logo: null as File | null,
 _method: 'PATCH',
 });

 useEffect(() => {
 if (flash?.success) {
 setToast(flash.success);
 const t = setTimeout(() => setToast(null), 3000);
 return () => clearTimeout(t);
 }
 }, [flash]);

 const submit: FormEventHandler = (e) => {
 e.preventDefault();
 post(route('clinic.settings.update'));
 };

 const fieldStyle = {
 background: 'var(--surface)',
 border: '1px solid var(--border-strong)',
 color: 'var(--txt-1)',
 borderRadius: 8,
 padding: '7px 12px',
 fontSize: 13,
 fontFamily: 'inherit',
 outline: 'none',
 width: '100%',
 };

 const labelStyle = {
 fontSize: 11,
 fontWeight: 600,
 letterSpacing: '0.08em',
 textTransform: 'uppercase' as const,
 color: 'var(--txt-3)',
 marginBottom: 6,
 display: 'flex',
 alignItems: 'center',
 gap: 6,
 };

 return (
 <ClinicLayout>
 <Head title={t('Settings')} />

 {/* Toast */}
 {toast && (
 <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-lg"
 style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 {toast}
 </div>
 )}

    <div className="max-w-4xl mx-auto flex flex-col gap-5 pb-10">

 {/* Header */}
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
 style={{ background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }}>
 <Settings size={18} />
 </div>
 <div>
 <h1 className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Clinic Settings')}
 </h1>
 <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {t('Manage your clinic information')}
 </p>
 </div>
 </div>

 {/* Clinic Form */}
 <form onSubmit={submit} encType="multipart/form-data">
 <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
 <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[12px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Clinic Profile')}</p>
 </div>
 <div className="p-5 flex flex-col gap-5">

 {/* Clinic Name */}
 <div>
 <label style={labelStyle}><Building2 size={13} /> {t('Clinic Name')}</label>
 <input type="text" style={fieldStyle} value={data.name}
 onChange={e => setData('name', e.target.value)}
 onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.12)'; }}
 onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
 placeholder={t('Clinic name')} />
 {errors.name && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label style={labelStyle}><Mail size={13} /> {t('Email')}</label>
 <input type="email" style={fieldStyle} value={data.email}
 onChange={e => setData('email', e.target.value)}
 onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.12)'; }}
 onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
 placeholder="contact@clinic.ma" />
 {errors.email && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
 </div>
 <div>
 <label style={labelStyle}><Phone size={13} /> {t('Phone')}</label>
 <input type="tel" style={fieldStyle} value={data.phone}
 onChange={e => setData('phone', e.target.value)}
 onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.12)'; }}
 onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
 placeholder="0522-123456" />
 {errors.phone && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.phone}</p>}
 </div>
 </div>

 <div>
 <label style={labelStyle}><MapPin size={13} /> {t('Address')}</label>
 <textarea rows={3} style={{ ...fieldStyle, resize: 'none' }}
 value={data.address}
 onChange={e => setData('address', e.target.value)}
 onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,221,198,0.12)'; }}
 onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
 placeholder={t('Full clinic address')} />
 {errors.address && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.address}</p>}
 </div>
 </div>

 <div className="px-5 py-3.5 border-t flex justify-end" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.01)' }}>
 <button type="submit" disabled={processing || !isDirty} className="btn-primary disabled:opacity-50">
 <Save size={13} />
 {processing ? t('Saving...') : t('Save Changes')}
 </button>
 </div>
 </div>
 </form>

        {/* Account Settings */}
        <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="w-full" />
        </div>

        <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
            <UpdatePasswordForm className="w-full" />
        </div>
 </div>
 </ClinicLayout>
 );
}
