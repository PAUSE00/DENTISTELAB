import AdminLayout from '@/Layouts/AdminLayout';
import ClinicLayout from '@/Layouts/ClinicLayout';
import LabLayout from '@/Layouts/LabLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import useTranslation from '@/Hooks/useTranslation';
import { User, Shield, Lock, Trash2, Fingerprint } from 'lucide-react';

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { t } = useTranslation();
    
    // Choose layout based on role
    const Layout = auth.user.role === 'super_admin' ? AdminLayout 
                 : (auth.user.role === 'dentist' || auth.user.role === 'clinic_staff') ? ClinicLayout 
                 : LabLayout;

    return (
        <Layout header={t('Account Settings')}>
            <Head title={t('Profile')} />

            <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
                {/* Header Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Fingerprint className="w-5 h-5 text-indigo-500" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{t('User Identity')}</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {t('Configure')} <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{t('Profile Parameters')}</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-2 max-w-2xl">
                        {t('Manage your personal information, security credentials, and system access rights in one centralized vault.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Navigation Sidebar (Fake for visual consistent) */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm sticky top-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">{t('Vault Sections')}</h4>
                            <div className="space-y-1">
                                {[
                                    { id: 'info', label: t('Identity'), icon: User, active: true },
                                    { id: 'security', label: t('Security'), icon: Lock },
                                    { id: 'danger', label: t('Destruction'), icon: Trash2 },
                                ].map((item) => (
                                    <button 
                                        key={item.id}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${item.active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 font-black' : 'text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-xs">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Forms Content */}
                    <div className="lg:col-span-9 space-y-12">
                        {/* Profile Info */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                               <User className="w-32 h-32" />
                           </div>
                           <div className="relative z-10">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                         <Shield className="w-5 h-5" />
                                     </div>
                                     {t('Identity Verification')}
                                </h3>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                           </div>
                        </section>

                        {/* Password */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                               <Lock className="w-32 h-32" />
                           </div>
                           <div className="relative z-10">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                         <Lock className="w-5 h-5" />
                                     </div>
                                     {t('Encryption Keys')}
                                </h3>
                                <UpdatePasswordForm />
                           </div>
                        </section>

                        {/* Delete Account */}
                        <section className="bg-rose-50/30 dark:bg-rose-500/5 rounded-[2.5rem] p-10 border border-rose-100 dark:border-rose-500/20 shadow-sm relative overflow-hidden group transition-colors hover:bg-rose-50/50">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none text-rose-500">
                               <Trash2 className="w-32 h-32" />
                           </div>
                           <div className="relative z-10">
                                <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight mb-4 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                         <Trash2 className="w-5 h-5" />
                                     </div>
                                     {t('Irreversible Operations')}
                                </h3>
                                <div className="max-w-2xl">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">
                                        {t('Once your account is deleted, all of its architectural resources and data will be permanently purged. Please download any data or information you wish to retain.')}
                                    </p>
                                    <DeleteUserForm />
                                </div>
                           </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
