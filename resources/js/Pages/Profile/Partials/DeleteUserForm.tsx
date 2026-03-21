import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Trash2, X, AlertTriangle, ShieldAlert, KeyRound } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function DeleteUserForm({
 className = '',
}: {
 className?: string;
}) {
 const { t } = useTranslation();
 const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
 const passwordInput = useRef<HTMLInputElement>(null);

 const {
 data,
 setData,
 delete: destroy,
 processing,
 reset,
 errors,
 clearErrors,
 } = useForm({
 password: '',
 });

 const confirmUserDeletion = () => {
 setConfirmingUserDeletion(true);
 };

 const deleteUser: FormEventHandler = (e) => {
 e.preventDefault();

 destroy(route('profile.destroy'), {
 preserveScroll: true,
 onSuccess: () => closeModal(),
 onError: () => passwordInput.current?.focus(),
 onFinish: () => reset(),
 });
 };

 const closeModal = () => {
 setConfirmingUserDeletion(false);
 clearErrors();
 reset();
 };

 return (
 <section className={className}>
 <button 
 onClick={confirmUserDeletion}
 className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(244,63,94,0.2)] transition-all duration-500"
 >
 <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
 <span className="font-black tracking-tight uppercase text-xs tracking-widest">{t('Initialize Deletion')}</span>
 </button>

 <Modal show={confirmingUserDeletion} onClose={closeModal}>
 <form onSubmit={deleteUser} className="p-8 overflow-hidden relative">
 {/* Decorative Background Icon */}
 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
 <AlertTriangle className="w-64 h-64 text-rose-500" />
 </div>

 <div className="relative z-10">
 <div className="flex items-center gap-4 mb-6">
 <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
 <ShieldAlert className="w-6 h-6" />
 </div>
 <div>
 <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">
 {t('Confirm Destruction')}
 </h2>
 <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">
 {t('Security Clearance Required')}
 </p>
 </div>
 </div>

 <p className="text-sm font-medium leading-relaxed mb-8">
 {t('This operation is irreversible. All associated data will be purged from our primary and backup storage arrays. Please enter your authorization key to proceed.')}
 </p>

 <div className="space-y-4">
 <div className="space-y-2">
 <InputLabel
 htmlFor="password"
 value={t('Authorization Key')}
 className="text-[10px] font-black uppercase tracking-widest ml-1"
 />
 <div className="relative group/field">
 <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within/field:text-rose-500 transition-colors" />
 <TextInput
 id="password"
 type="password"
 name="password"
 ref={passwordInput}
 value={data.password}
 onChange={(e) => setData('password', e.target.value)}
 className="pl-12 w-full border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 dark:text-white font-bold h-14"
 isFocused
 placeholder={t('Enter Key')}
 />
 </div>
 <InputError message={errors.password} className="mt-2" />
 </div>
 </div>

 <div className="mt-10 flex items-center justify-end gap-4">
 <button
 type="button"
 onClick={closeModal}
 className="text-[10px] font-black hover: dark:hover: uppercase tracking-widest transition-colors flex items-center gap-2 px-6 py-3"
 >
 <X className="w-4 h-4" /> {t('Abort Mission')}
 </button>

 <button 
 type="submit" 
 disabled={processing}
 className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
 >
 <Trash2 className="w-5 h-5 group-hover:shake transition-transform" />
 <span className="font-black tracking-tight">{t('Permanently Terminate Account')}</span>
 </button>
 </div>
 </div>
 </form>
 </Modal>
 </section>
 );
}
