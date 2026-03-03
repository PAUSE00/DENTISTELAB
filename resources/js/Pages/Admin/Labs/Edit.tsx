import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, Activity, MapPin, Phone, User, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Lab {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean;
}

interface Owner {
    id: number;
    name: string;
    email: string;
}

interface Props {
    lab: Lab;
    current_owner_id: number | null;
    owners: Owner[];
}

export default function Edit({ lab, current_owner_id, owners }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: lab.name,
        email: lab.email,
        phone: lab.phone,
        address: lab.address,
        owner_id: current_owner_id || '',
        is_active: lab.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.labs.update', lab.id));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center gap-4 w-full pr-4">
                    <Link
                        href={route('admin.labs.index')}
                        className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Edit Lab: {lab.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${lab.name}`} />

            <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
                <form onSubmit={submit} className="glass-card p-6 space-y-6">

                    {/* Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Lab Name" />
                        <div className="relative mt-1">
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
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

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 w-full"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
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

                    {/* Lab Owner */}
                    <div>
                        <InputLabel htmlFor="owner_id" value="Lab Owner" />
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sub w-5 h-5" />
                            <select
                                id="owner_id"
                                name="owner_id"
                                value={data.owner_id}
                                onChange={(e) => setData('owner_id', e.target.value)}
                                className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-brand dark:focus:border-brand focus:ring-brand dark:focus:ring-brand shadow-sm"
                                required
                            >
                                <option value="">Select a lab owner...</option>
                                {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="mt-1 text-sm text-sub">Current owner and unassigned lab owners are listed.</p>
                        <InputError message={errors.owner_id} className="mt-2" />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-700 text-primary-600 shadow-sm focus:ring-primary-500 w-5 h-5 transition-all"
                        />
                        <InputLabel htmlFor="is_active" value="Lab Active" className="!mb-0 cursor-pointer text-gray-700 dark:text-gray-300 font-medium" />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-slate-700/50">
                        <Link
                            href={route('admin.labs.index')}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton disabled={processing} className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Update Lab
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
