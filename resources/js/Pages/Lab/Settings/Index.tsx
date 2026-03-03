import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Settings, Building, Mail, Phone, MapPin, Globe, Save, Upload, Loader2, Image as ImageIcon, FileText, CheckSquare, User, Shield } from 'lucide-react';
import { useState, useRef, FormEventHandler } from 'react';
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
        _method: 'PATCH', // Fake PATCH for file uploads
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

            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4 animate-fade-in animate-delay-100">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{t('Lab Settings')}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Manage your laboratory information')}</p>
                    </div>
                </div>

                {/* Lab Info Form */}
                <form onSubmit={submit} encType="multipart/form-data" className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-200">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <Building className="w-5 h-5 text-primary-500" />
                            {t('General Information')}
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Logo Upload */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                {t('Lab Logo')}
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    {lab.logo_path ? (
                                        <img src={`/storage/${lab.logo_path}`} alt="Lab Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building className="w-8 h-8 text-gray-300 dark:text-gray-600" />
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
                                        PNG, JPG {t('or')} WEBP. Max 2MB.
                                    </p>
                                    {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 dark:border-slate-700" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Lab Name')}</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Phone')}</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Address')}</label>
                                <textarea
                                    rows={2}
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('City')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                    />
                                </div>
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-100 dark:border-slate-700" />

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {t('Description / About')}
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                                placeholder={t('Describe your lab, specialties, equipment...')}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Terms */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <CheckSquare className="w-4 h-4 text-gray-400" />
                                {t('Terms & Conditions / Policy')}
                            </label>
                            <textarea
                                value={data.terms}
                                onChange={(e) => setData('terms', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                                placeholder={t('Payment terms, delivery conditions, warranties...')}
                            />
                            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {t('Save Changes')}
                        </button>
                    </div>
                </form>

                {/* Account / User Settings */}
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-300">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <User className="w-5 h-5 text-primary-500" />
                            {t('Profile Information')}
                        </h2>
                    </div>
                    <div className="p-6 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-400">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <Shield className="w-5 h-5 text-primary-500" />
                            {t('Update Password')}
                        </h2>
                    </div>
                    <div className="p-6 sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </LabLayout>
    );
}
