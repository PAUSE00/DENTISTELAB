import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { FormEventHandler } from 'react';
import { Package, FileText, DollarSign, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        production_days: '1',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('lab.services.store'));
    };

    return (
        <LabLayout>
            <Head title="Add Service" />

            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('lab.services.index')} className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Add New Service</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expand your catalog with a new offering</p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 space-y-8">

                    <div className="space-y-6">
                        <div className="border-b border-gray-100 dark:border-slate-700 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary-500" />
                                Service Details
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Basic information regarding the service.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Service Name" />
                            <div className="relative mt-1">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <TextInput
                                    id="name"
                                    className="pl-10 block w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-primary-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    placeholder="e.g. Zirconia Crown"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <div className="relative mt-1">
                                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <textarea
                                    id="description"
                                    className="pl-10 block w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Briefly describe the service, materials used, etc..."
                                />
                            </div>
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b border-gray-100 dark:border-slate-700 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary-500" />
                                Pricing & Timing
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set the cost and expected turnaround time.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel htmlFor="price" value="Price (MAD)" />
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className="pl-10 block w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-primary-500"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <InputError message={errors.price} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="production_days" value="Production Days" />
                                <div className="relative mt-1">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <TextInput
                                        id="production_days"
                                        type="number"
                                        className="pl-10 block w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-primary-500"
                                        value={data.production_days}
                                        onChange={(e) => setData('production_days', e.target.value)}
                                        required
                                        placeholder="1"
                                    />
                                </div>
                                <InputError message={errors.production_days} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                        <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                            </div>
                            <div className="flex-1">
                                <span className="block font-medium text-gray-900 dark:text-white">Active Status</span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400">Make this service immediately available to clinics</span>
                            </div>
                            <div className={`p-2 rounded-full ${data.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href={route('lab.services.index')}>
                            <SecondaryButton className="!rounded-xl">Cancel</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing} className="min-w-[140px] !rounded-xl shadow-lg shadow-primary-500/30">
                            {processing ? 'Saving...' : 'Create Service'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </LabLayout>
    );
}
