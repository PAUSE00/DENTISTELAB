import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const LABEL = "block text-[10px] uppercase font-black tracking-widest mb-2 opacity-70";
const INPUT_BASE = "app-input w-full";

export default function UpdatePasswordForm({
 className = '',
}: {
 className?: string;
}) {
 const { t } = useTranslation();
 const passwordInput = useRef<HTMLInputElement>(null);
 const currentPasswordInput = useRef<HTMLInputElement>(null);

 const {
 data,
 setData,
 errors,
 put,
 reset,
 processing,
 recentlySuccessful,
 } = useForm({
 current_password: '',
 password: '',
 password_confirmation: '',
 });

 const updatePassword: FormEventHandler = (e) => {
 e.preventDefault();

 put(route('password.update'), {
 preserveScroll: true,
 onSuccess: () => reset(),
 onError: (errors) => {
 if (errors.password) {
 reset('password', 'password_confirmation');
 passwordInput.current?.focus();
 }

 if (errors.current_password) {
 reset('current_password');
 currentPasswordInput.current?.focus();
 }
 },
 });
 };

 return (
 <form onSubmit={updatePassword} className={`space-y-6 ${className}`}>
 
 {/* Box exactly like reference image */}
 <div className="card p-6 flex flex-col gap-6 relative" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Current */}
 <div>
 <label htmlFor="current_password" className={LABEL} style={{ color: 'var(--txt-1)' }}>
 {t('Current Password')}
 </label>
 <input
 id="current_password"
 ref={currentPasswordInput}
 value={data.current_password}
 onChange={(e) => setData('current_password', e.target.value)}
 type="password"
 className={INPUT_BASE}
 autoComplete="current-password"
 placeholder="••••••••"
 />
 <InputError message={errors.current_password} className="mt-2 text-[11px]" />
 </div>

 {/* New */}
 <div>
 <label htmlFor="password" className={LABEL} style={{ color: 'var(--txt-1)' }}>
 {t('New Password')}
 </label>
 <input
 id="password"
 ref={passwordInput}
 value={data.password}
 onChange={(e) => setData('password', e.target.value)}
 type="password"
 className={INPUT_BASE}
 autoComplete="new-password"
 placeholder="Minimum 12 chars"
 />
 <InputError message={errors.password} className="mt-2 text-[11px]" />
 </div>

 {/* Confirm */}
 <div>
 <label htmlFor="password_confirmation" className={LABEL} style={{ color: 'var(--txt-1)' }}>
 {t('Confirm New Password')}
 </label>
 <input
 id="password_confirmation"
 value={data.password_confirmation}
 onChange={(e) => setData('password_confirmation', e.target.value)}
 type="password"
 className={INPUT_BASE}
 autoComplete="new-password"
 placeholder="••••••••"
 />
 <InputError message={errors.password_confirmation} className="mt-2 text-[11px]" />
 </div>
 </div>
 </div>

 <div className="flex justify-end gap-6 pt-2 items-center">
 <Transition
 show={recentlySuccessful}
 enter="transition ease-in-out duration-300"
 enterFrom="opacity-0 translate-x-4"
 enterTo="opacity-100 translate-x-0"
 leave="transition ease-in-out duration-300"
 leaveTo="opacity-0 translate-x-4"
 >
 <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
 <CheckCircle2 className="w-4 h-4" />
 {t('Secured')}
 </div>
 </Transition>

 <button 
 type="submit" 
 disabled={processing}
 className="btn-primary px-8 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-accent disabled:opacity-50"
 >
 {t('Update Password')}
 </button>
 </div>
 </form>
 );
}
