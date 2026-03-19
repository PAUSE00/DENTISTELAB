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
        blood_group: patient.blood_group || '',
        allergies: patient.allergies || '',
        medical_history: patient.medical_history || '',
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

            <div className="max-w-4xl mx-auto animate-fade-up space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                        href={route('clinic.patients.index')}
                        className="p-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--txt-2)' }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--txt-1)' }}>Edit Patient</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60" style={{ color: 'var(--txt-2)' }}>Update patient information</p>
                    </div>
                </div>

                <div className="card overflow-hidden transition-all duration-300">
                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest border-b pb-3 flex items-center gap-2" style={{ color: 'var(--txt-2)', borderColor: 'var(--border)' }}>
                                        <User className="w-4 h-4" style={{ color: 'var(--teal)' }} /> Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div>
                                            <label htmlFor="first_name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>First Name</label>
                                            <input
                                                id="first_name"
                                                className="app-input w-full"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                required
                                                autoFocus
                                            />
                                            <InputError className="mt-2" message={errors.first_name} />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label htmlFor="last_name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Last Name</label>
                                            <input
                                                id="last_name"
                                                className="app-input w-full"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.last_name} />
                                        </div>

                                        {/* DOB */}
                                        <div>
                                            <label htmlFor="dob" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Date of Birth</label>
                                            <input
                                                id="dob"
                                                type="date"
                                                className="app-input w-full"
                                                value={data.dob}
                                                onChange={(e) => setData('dob', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.dob} />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="space-y-6 mt-8">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest border-b pb-3 flex items-center gap-2" style={{ color: 'var(--txt-2)', borderColor: 'var(--border)' }}>
                                        <Phone className="w-4 h-4" style={{ color: 'var(--purple)' }} /> Contact & Additional Info
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Phone Number</label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                className="app-input w-full"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        {/* Email (Optional) */}
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Email (Optional)</label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="app-input w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        {/* Blood Group */}
                                        <div>
                                            <label htmlFor="blood_group" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Blood Group</label>
                                            <select
                                                id="blood_group"
                                                className="app-input w-full appearance-none"
                                                value={data.blood_group}
                                                onChange={(e) => setData('blood_group', e.target.value)}
                                            >
                                                <option value="">N/A</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                            <InputError className="mt-2" message={errors.blood_group} />
                                        </div>

                                        {/* Medical History */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="medical_history" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Medical History</label>
                                            <input
                                                id="medical_history"
                                                className="app-input w-full"
                                                value={data.medical_history}
                                                onChange={(e) => setData('medical_history', e.target.value)}
                                                placeholder="e.g. Diabetes, Hypertension..."
                                            />
                                            <InputError className="mt-2" message={errors.medical_history} />
                                        </div>
                                    </div>

                                    {/* Allergies */}
                                    <div className="mt-4">
                                        <label htmlFor="allergies" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Allergies</label>
                                        <input
                                            id="allergies"
                                            className="app-input w-full"
                                            value={data.allergies}
                                            onChange={(e) => setData('allergies', e.target.value)}
                                            placeholder="e.g. Penicillin, Latex..."
                                        />
                                        <InputError className="mt-2" message={errors.allergies} />
                                    </div>

                                    {/* Medical Notes */}
                                    <div className="mt-4">
                                        <label htmlFor="medical_notes" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Medical Notes (Optional)</label>
                                        <textarea
                                            id="medical_notes"
                                            className="app-input w-full resize-none"
                                            value={data.medical_notes}
                                            onChange={(e) => setData('medical_notes', e.target.value)}
                                            rows={4}
                                        />
                                        <InputError className="mt-2" message={errors.medical_notes} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <Link href={route('clinic.patients.index')} className="btn-ghost" style={{ textDecoration: 'none' }}>
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-primary"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span className="font-bold">Save Changes</span>
                                    </button>
                                </div>
                        </form>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="border rounded-2xl overflow-hidden mt-8 transition-all duration-300 shadow-sm hover:shadow" style={{ borderColor: 'var(--red-20)', background: 'var(--bg)' }}>
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="p-3 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--red-10)', color: 'var(--red)' }}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--red)' }}>Delete Patient</h3>
                                <p className="text-sm mt-1" style={{ color: 'var(--txt-2)' }}>
                                    Permanently remove this patient and all their associated data. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)} className="btn-danger shrink-0 flex items-center gap-2 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                            <span className="font-bold">Delete Patient</span>
                        </button>
                    </div>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Patient"
                    message="Are you sure you want to delete this patient and all associated data? This action cannot be undone."
                    confirmText="Delete"
                    variant="danger"
                />
            </div>
        </ClinicLayout>
    );
}
