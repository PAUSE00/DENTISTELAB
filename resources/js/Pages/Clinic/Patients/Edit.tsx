import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { FormEventHandler, useState } from 'react';
import { ChevronLeft, Save, Trash2, AlertTriangle, User, Phone } from 'lucide-react';
import ConfirmModal from '@/Components/ConfirmModal';

interface Props extends PageProps {
    patient: Patient;
}

export default function Edit({ auth, patient }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: patient.first_name,
        last_name: patient.last_name,
        dob: patient.dob,
        phone: patient.phone,
        email: patient.email || '',
        external_id: patient.external_id || '',
        medical_notes: patient.medical_notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('clinic.patients.update', patient.id));
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route('clinic.patients.destroy', patient.id), {
            onFinish: () => setShowDeleteModal(false),
        });
    };

    return (
        <ClinicLayout>
            <Head title="Edit Patient" />

            <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                        href={route('clinic.patients.index')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-500 dark:text-gray-400 transition-all shadow-sm hover:shadow"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Edit Patient</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Update patient information</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Personal Information Section */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700/50 pb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary-500" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name" />
                                        <TextInput
                                            id="first_name"
                                            className="mt-1 block w-full"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                            isFocused
                                        />
                                        <InputError className="mt-2" message={errors.first_name} />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name" />
                                        <TextInput
                                            id="last_name"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.last_name} />
                                    </div>

                                    {/* DOB */}
                                    <div>
                                        <InputLabel htmlFor="dob" value="Date of Birth" />
                                        <TextInput
                                            id="dob"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.dob} />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700/50 pb-3 flex items-center gap-2 mt-4">
                                    <Phone className="w-4 h-4 text-emerald-500" /> Contact & Additional Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number" />
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.phone} />
                                    </div>

                                    {/* Email (Optional) */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Email (Optional)" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                {/* Medical Notes */}
                                <div>
                                    <InputLabel htmlFor="medical_notes" value="Medical Notes (Optional)" />
                                    <textarea
                                        id="medical_notes"
                                        className="mt-1 block w-full border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-500 rounded-xl shadow-sm transition-colors"
                                        value={data.medical_notes}
                                        onChange={(e) => setData('medical_notes', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError className="mt-2" message={errors.medical_notes} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
                                <Link href={route('clinic.patients.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-card bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0 shadow-sm">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-900 dark:text-red-100">Delete Patient</h3>
                                <p className="text-red-600/80 dark:text-red-400/80 text-sm mt-1">
                                    Permanently remove this patient and all their associated data. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <DangerButton onClick={() => setShowDeleteModal(true)} className="shrink-0 flex items-center gap-2 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                            Delete Patient
                        </DangerButton>
                    </div>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Supprimer le patient"
                    message="Êtes-vous sûr de vouloir supprimer ce patient et toutes ses données associées ? Cette action est irréversible."
                    confirmText="Supprimer"
                    variant="danger"
                />
            </div>
        </ClinicLayout>
    );
}
