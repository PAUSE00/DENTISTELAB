import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ChevronLeft, Save, User, Phone } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        dob: '',
        phone: '',
        email: '',
        external_id: '',
        medical_notes: '',
        blood_group: '',
        allergies: '',
        medical_history: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clinic.patients.store'));
    };

    return (
        <ClinicLayout>
            <Head title="Add Patient" />

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
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Add New Patient</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Register a new patient to your clinic</p>
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
                                            autoComplete="given-name"
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
                                            autoComplete="family-name"
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
                                            autoComplete="tel"
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
                                            autoComplete="email"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Blood Group */}
                                    <div>
                                        <InputLabel htmlFor="blood_group" value="Blood Group" />
                                        <select
                                            id="blood_group"
                                            className="mt-1 block w-full border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-300 focus:border-primary-500 rounded-xl shadow-sm"
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
                                        <InputLabel htmlFor="medical_history" value="Medical History" />
                                        <TextInput
                                            id="medical_history"
                                            className="mt-1 block w-full"
                                            value={data.medical_history}
                                            onChange={(e) => setData('medical_history', e.target.value)}
                                            placeholder="e.g. Diabetes, Hypertension..."
                                        />
                                        <InputError className="mt-2" message={errors.medical_history} />
                                    </div>
                                </div>

                                {/* Allergies */}
                                <div>
                                    <InputLabel htmlFor="allergies" value="Allergies" />
                                    <TextInput
                                        id="allergies"
                                        className="mt-1 block w-full"
                                        value={data.allergies}
                                        onChange={(e) => setData('allergies', e.target.value)}
                                        placeholder="e.g. Penicillin, Latex..."
                                    />
                                    <InputError className="mt-2" message={errors.allergies} />
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
                                        placeholder="Any important medical history or allergies..."
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
                                    Save Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
