import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { CheckCircle2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const LABEL = "block text-[10px] uppercase font-black tracking-widest mb-2 opacity-70";
const INPUT_BASE = "app-input w-full";

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
        <form onSubmit={submit} className={`space-y-6 ${className}`}>
            
            {/* Box exactly like reference image */}
            <div className="card p-6 flex flex-col gap-6 relative" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={LABEL} style={{ color: 'var(--txt-1)' }}>
                            {t('Full Name')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            className={INPUT_BASE}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2 text-[11px]" message={errors.name} />
                    </div>

                    <div>
                        <label htmlFor="email" className={LABEL} style={{ color: 'var(--txt-1)' }}>
                            {t('Personal Work Email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            className={INPUT_BASE}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2 text-[11px]" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-2">
                        <p className="text-[12.5px] text-amber-500 font-medium">
                            {t('Your email address is unverified.')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold text-amber-400 underline hover:no-underline transition-all"
                            >
                                {t('Resend verification email')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-[11.5px] font-bold text-emerald-500 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {t('A new verification link has been sent.')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-6 pt-2">
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
                        {t('Updated')}
                    </div>
                </Transition>

                <button 
                    type="submit" 
                    disabled={processing}
                    className="btn-primary px-8 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                    {t('Update Identity')}
                </button>
            </div>
        </form>
    );
}
