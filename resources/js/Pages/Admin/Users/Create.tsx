import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, User, Mail, Shield, Lock, ChevronRight, UserPlus, Sparkles } from 'lucide-react';
import { FormEventHandler } from 'react';
import useTranslation from '@/Hooks/useTranslation';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'dentist',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AdminLayout header={t('Create New User')}>
            <Head title={t('Create User')} />

            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
                {/* Header Header */}
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.users.index')}
                        className="p-4 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <UserPlus className="w-4 h-4 text-indigo-500" />
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{t('User Management')}</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Provision')} <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{t('New Account')}</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Information Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                            <div className="relative z-10">
                                <Sparkles className="w-10 h-10 text-indigo-400 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                                <h3 className="text-white font-black text-xl mb-3 leading-tight italic underline decoration-indigo-500/30 uppercase tracking-tight">{t('Security Protocol')}</h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                                    {t('Ensure all identity parameters are verified before provisioning new architectural access roles.')}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('SSL Encryption Active')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('Role Validation Ready')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('Access Level Map')}</h4>
                            <div className="space-y-3">
                                {[
                                    { r: 'dentist', l: t('Clinic Owner') },
                                    { r: 'lab_owner', l: t('Lab Enterprise') },
                                    { r: 'lab_tech', l: t('Technician Staff') },
                                    { r: 'super_admin', l: t('Full System') }
                                ].map(item => (
                                    <div key={item.r} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                        <span className="text-xs font-bold text-slate-500 capitalize">{item.r.replace('_', ' ')}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="space-y-8 relative z-10">
                                <section>
                                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <div className="w-4 h-[2px] bg-indigo-500" /> {t('Primary Identity')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="name" value={t('Legal Full Name')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                            <div className="relative group/field">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                                                <TextInput
                                                    id="name"
                                                    value={data.name}
                                                    className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="email" value={t('System Email Interface')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                            <div className="relative group/field">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <div className="w-4 h-[2px] bg-indigo-500" /> {t('Access & Permissions')}
                                    </h3>
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="role" value={t('Architectural Role')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                        <div className="relative group/field">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                                            <select
                                                id="role"
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="w-full pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14 appearance-none"
                                                required
                                            >
                                                <option value="dentist">{t('Dentist (Clinic Owner)')}</option>
                                                <option value="lab_owner">{t('Lab Owner')}</option>
                                                <option value="lab_tech">{t('Lab Technician')}</option>
                                                <option value="clinic_staff">{t('Clinic Staff')}</option>
                                                <option value="super_admin">{t('Super Admin')}</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                        <InputError message={errors.role} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <div className="w-4 h-[2px] bg-indigo-500" /> {t('Security Credentials')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="password" value={t('Access Key')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                            <div className="relative group/field">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="password_confirmation" value={t('Re-verify Key')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                            <div className="relative group/field">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/field:text-indigo-500 transition-colors" />
                                                <TextInput
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    className="pl-12 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-white font-bold h-14"
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </section>

                                <div className="flex items-center justify-between pt-10 border-t border-slate-50 dark:border-slate-800">
                                    <Link
                                        href={route('admin.users.index')}
                                        className="text-[10px] font-black text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-2"
                                    >
                                        <X className="w-3 h-3" /> {t('Abort Mission')}
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="btn-primary group relative overflow-hidden flex items-center gap-3 px-10 py-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(99,102,241,0.3)] transition-all duration-500 disabled:opacity-50 disabled:grayscale"
                                    >
                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-black tracking-tight">{t('Finalize Account')}</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);
