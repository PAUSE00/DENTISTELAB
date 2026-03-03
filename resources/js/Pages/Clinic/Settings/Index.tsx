import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Save, Building2, Mail, Phone, MapPin, Image as ImageIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';

interface Clinic {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo_path: string | null;
}

interface Props extends PageProps {
    clinic: Clinic;
    mustVerifyEmail: boolean;
    status?: string;
}

export default function SettingsIndex({ auth, clinic, mustVerifyEmail, status }: Props) {
    const { flash } = usePage().props as any;
    const [toast, setToast] = useState<string | null>(null);

    const { data, setData, post, processing, errors, isDirty } = useForm({
        name: clinic.name || '',
        email: clinic.email || '',
        phone: clinic.phone || '',
        address: clinic.address || '',
        logo: null as File | null,
        _method: 'PATCH', // For file uploads we need to fake PATCH with POST
    });

    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success);
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clinic.settings.update'));
    };

    return (
        <ClinicLayout>
            <Head title="Settings" />

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
                    <div className="bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {toast}
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Paramètres de la Clinique
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les informations de votre clinique
                    </p>
                </div>

                {/* Settings Form */}
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* Logo Upload */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    <ImageIcon className="w-4 h-4 text-primary-500" />
                                    Logo de la clinique
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                        {clinic.logo_path ? (
                                            <img src={`/storage/${clinic.logo_path}`} alt="Clinic Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            dark:file:bg-primary-900/20 dark:file:text-primary-400
                                            hover:file:bg-primary-100 dark:hover:file:bg-primary-900/40 transition-colors cursor-pointer"
                                            accept="image/*"
                                        />
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                            PNG, JPG ou WEBP. Max 2MB.
                                        </p>
                                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                    </div>
                                </div>
                            </div>
                            <hr className="border-gray-100 dark:border-slate-700" />

                            {/* Clinic Name */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 mt-2">
                                    <Building2 className="w-4 h-4 text-primary-500" />
                                    Nom de la clinique
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                                    placeholder="Nom de la clinique"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                        <Mail className="w-4 h-4 text-emerald-500" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                                        placeholder="contact@clinique.ma"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                        <Phone className="w-4 h-4 text-orange-500" />
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                                        placeholder="0522-123456"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 mt-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    Adresse
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm resize-none"
                                    placeholder="Adresse complète de la clinique"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700/50 flex justify-end backdrop-blur-sm">
                            <button
                                type="submit"
                                disabled={processing || !isDirty}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Account / User Settings */}
                <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-6 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-6 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>
            </div>
        </ClinicLayout>
    );
}
