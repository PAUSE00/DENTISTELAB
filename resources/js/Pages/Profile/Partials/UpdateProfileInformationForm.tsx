import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, Save, CheckCircle2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <InputLabel htmlFor="name" value={t('Full Name')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                        <div className="relative group/field">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                            <TextInput
                                id="name"
                                value={data.name}
                                className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="email" value={t('Email Address')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                        <div className="relative group/field">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                            {t('Your email address is unverified.')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-black text-amber-800 dark:text-amber-300 underline hover:no-underline decoration-2 transition-all"
                            >
                                {t('Resend verification email')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                {t('A new verification link has been sent.')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="btn-primary group relative overflow-hidden flex items-center gap-3 px-10 py-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(99,102,241,0.3)] transition-all duration-500 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-black tracking-tight">{t('Save Identity')}</span>
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
                            {t('Synchronized')}
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
