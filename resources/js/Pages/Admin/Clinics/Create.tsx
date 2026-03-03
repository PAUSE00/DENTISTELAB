import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, Building2, MapPin, Phone, User } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Dentist {
    id: number;
    name: string;
    email: string;
}

export default function Create({ dentists }: { dentists: Dentist[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        phone: '',
        manager_name: '',
        dentist_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.clinics.store'));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center gap-4 w-full pr-4">
                    <Link
                        href={route('admin.clinics.index')}
                        className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Add New Clinic
                    </h2>
                </div>
            }
        >
            <Head title="Create Clinic" />

            <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
                <form onSubmit={submit} className="glass-card p-6 space-y-6">

                    {/* Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Clinic Name" />
                        <div className="relative mt-1">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="pl-10 w-full"
                                autoComplete="organization"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Address */}
                    <div>
                        <InputLabel htmlFor="address" value="Address" />
                        <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <TextInput
                                id="address"
                                name="address"
                                value={data.address}
                                className="pl-10 w-full"
                                onChange={(e) => setData('address', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    {/* Phone */}
                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number" />
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <TextInput
                                id="phone"
                                name="phone"
                                value={data.phone}
                                className="pl-10 w-full"
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    {/* Clinic Owner (Dentist) */}
                    <div>
                        <InputLabel htmlFor="dentist_id" value="Clinic Owner (Dentist)" />
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <select
                                id="dentist_id"
                                name="dentist_id"
                                value={data.dentist_id}
                                onChange={(e) => setData('dentist_id', e.target.value)}
                                className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-brand dark:focus:border-brand focus:ring-brand dark:focus:ring-brand shadow-sm"
                                required
                            >
                                <option value="">Select a dentist...</option>
                                {dentists.map((dentist) => (
                                    <option key={dentist.id} value={dentist.id}>
                                        {dentist.name} ({dentist.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="mt-1 text-sm text-sub">Only dentists without an assigned clinic are listed.</p>
                        <InputError message={errors.dentist_id} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-slate-700/50">
                        <Link
                            href={route('admin.clinics.index')}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton disabled={processing} className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Create Clinic
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
