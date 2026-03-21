import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Building, User, Shield, Upload, Loader2, CloudUpload } from 'lucide-react';
import { FormEventHandler } from 'react';
import { ToastContainer, useToast } from '@/Components/Toast';
import useTranslation from '@/Hooks/useTranslation';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';

interface Lab {
 id: number;
 name: string;
 email: string;
 phone: string;
 address: string | null;
 city: string | null;
 description: string | null;
 terms: string | null;
 logo_path: string | null;
}

interface Props extends PageProps {
 lab: Lab;
 mustVerifyEmail: boolean;
 status?: string;
}

const SECTION_TITLE = "text-[16px] font-bold flex items-center gap-3 text-white tracking-wide";
const LABEL = "block text-[10px] uppercase font-bold tracking-widest mb-2 opacity-70";
const INPUT_BASE = "w-full px-4 py-2.5 rounded-lg text-[13px] border border-[#312e81] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-accent transition-colors bg-[rgba(15,23,42,0.2)] text-[var(--txt-1)] placeholder-white/30";

export default function LabSettings({ auth, lab, mustVerifyEmail, status }: Props) {
 const { t } = useTranslation();
 const { toasts, addToast, removeToast } = useToast();

 const { data, setData, post, processing, errors } = useForm({
 name: lab.name || '',
 email: lab.email || '',
 phone: lab.phone || '',
 address: lab.address || '',
 city: lab.city || '',
 description: lab.description || '',
 terms: lab.terms || '',
 logo: null as File | null,
 _method: 'PATCH',
 });

 const submit: FormEventHandler = (e) => {
 e.preventDefault();
 post(route('lab.settings.update'), {
 onSuccess: () => addToast(t('Settings updated successfully!'), 'success'),
 onError: () => addToast(t('Error updating settings.'), 'error'),
 });
 };

 return (
 <LabLayout>
 <Head title={t('Settings')} />

 <div className="max-w-[900px] mx-auto space-y-16 py-10 px-6 sm:px-8">

 {/* --- 1. GENERAL INFORMATION --- */}
 <form onSubmit={submit} encType="multipart/form-data">
 <h2 className={SECTION_TITLE} style={{ color: 'var(--txt-1)' }}>
 <Building className="w-5 h-5 text-accent" />
 {t('General Information')}
 </h2>
 
 <div className="flex flex-col md:flex-row gap-10 mt-6">
 {/* Logo Upload (Left Col) */}
 <div className="w-full md:w-[220px] shrink-0">
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Laboratory Logo')}</label>
 <div className="relative h-[220px] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden mt-1 group cursor-pointer">
 <input
 type="file"
 onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
 className="absolute inset-0 opacity-0 cursor-pointer z-10"
 accept="image/*"
 />
 {lab.logo_path && !data.logo ? (
 <div className="absolute inset-0 bg-black">
 <img src={`/storage/${lab.logo_path}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" alt="Logo" />
 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <CloudUpload className="text-white w-8 h-8 mb-2" />
 <span className="text-white text-xs font-bold">{t('Change Logo')}</span>
 </div>
 </div>
 ) : data.logo ? (
 <div className="text-center px-4">
 <div className="w-10 h-10 mx-auto bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-3">
 <CloudUpload className="w-5 h-5" />
 </div>
 <p className="text-[12px] font-bold text-emerald-500 truncate">{data.logo.name}</p>
 </div>
 ) : (
 <div className="text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity">
 <CloudUpload className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
 <p className="text-[11.5px] font-medium text-indigo-300 px-4">{t('Click to upload brand asset')}</p>
 </div>
 )}
 </div>
 <p className="text-[10px] mt-4 font-medium opacity-50 text-center" style={{ color: 'var(--txt-1)' }}>
 {t('Recommended: 512×512px SVG or PNG.')}
 </p>
 {errors.logo && <p className="text-red-500 text-[11px] font-bold mt-2 text-center">{errors.logo}</p>}
 </div>

 {/* Form Inputs (Right Col) */}
 <div className="flex-1 flex flex-col gap-5 pt-1">
 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Laboratory Name')}</label>
 <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={INPUT_BASE} />
 {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Official Email')}</label>
 <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={INPUT_BASE} />
 {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
 </div>
 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Phone Number')}</label>
 <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={INPUT_BASE} />
 {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
 </div>
 </div>

 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Address Line')}</label>
 <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className={INPUT_BASE} />
 {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('City / Region')}</label>
 <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className={INPUT_BASE} />
 {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
 </div>
 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Postal Code')}</label>
 <input type="text" placeholder={t('Optional')} className={INPUT_BASE} />
 </div>
 </div>

 <div>
 <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Lab Description')}</label>
 <textarea 
 value={data.description} 
 onChange={e => setData('description', e.target.value)} 
 rows={3} 
 className={`${INPUT_BASE} resize-none`}
 />
 {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>}
 </div>

 <div className="flex justify-end mt-2">
 <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[13px] font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
 {processing && <Loader2 className="w-4 h-4 animate-spin" />}
 {t('Save Lab Profile')}
 </button>
 </div>
 </div>
 </div>
 </form>

 <div className="w-full h-[1px] bg-[var(--border)] opacity-50" />

 {/* --- 2. PERSONAL IDENTITY --- */}
 <div>
 <h2 className={SECTION_TITLE} style={{ color: 'var(--txt-1)' }}>
 <User className="w-5 h-5 text-accent" />
 {t('Personal Identity')}
 </h2>
 <div className="mt-6">
 <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
 </div>
 </div>

 <div className="w-full h-[1px] bg-[var(--border)] opacity-50" />

 {/* --- 3. SECURITY & AUTHENTICATION --- */}
 <div>
 <h2 className={SECTION_TITLE} style={{ color: 'var(--txt-1)' }}>
 <Shield className="w-5 h-5 text-accent" />
 {t('Security & Authentication')}
 </h2>
 <div className="mt-6 pb-12">
 <UpdatePasswordForm />
 </div>
 </div>

 </div>

 <ToastContainer toasts={toasts} removeToast={removeToast} />
 </LabLayout>
 );
}
