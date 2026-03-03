import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Lock, Save, CheckCircle2, KeyRound } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

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
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div className="space-y-2">
                    <InputLabel
                        htmlFor="current_password"
                        value={t('Current Authorization Key')}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                    />
                    <div className="relative group/field max-w-md">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-purple-500 transition-colors" />
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 text-slate-700 dark:text-white font-bold h-14"
                            autoComplete="current-password"
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value={t('New Encryption Key')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                        <div className="relative group/field">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-purple-500 transition-colors" />
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 text-slate-700 dark:text-white font-bold h-14"
                                autoComplete="new-password"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value={t('Verify New Key')}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                        />
                        <div className="relative group/field">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-purple-500 transition-colors" />
                            <TextInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 text-slate-700 dark:text-white font-bold h-14"
                                autoComplete="new-password"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="btn-primary group relative overflow-hidden flex items-center gap-3 px-10 py-5 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(168,85,247,0.3)] transition-all duration-500 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-black tracking-tight">{t('Update Security')}</span>
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-x-4"
                    >
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" />
                            {t('Encrypted')}
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
