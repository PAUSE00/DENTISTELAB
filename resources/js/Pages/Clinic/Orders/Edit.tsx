import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState, FormEventHandler } from 'react';
import { Check, ChevronRight, FileText, Activity, User, Building, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';

// Types
interface Patient { id: number; name: string; }
interface Lab { id: number; name: string; services: any[] }

interface Order {
    id: number;
    patient_id: number;
    lab_id: number;
    service_id: number;
    due_date: string;
    priority: string;
    teeth: number[];
    shade: string;
    material: string;
    instructions: string | null;
}

interface Props extends PageProps {
    order: Order;
    patients: Patient[];
    labs: Lab[];
}

export default function Edit({ auth, order, patients, labs }: Props) {
    const [step, setStep] = useState(1);

    const { data, setData, patch, processing, errors } = useForm({
        patient_id: order.patient_id?.toString() ?? '',
        lab_id: order.lab_id?.toString() ?? '',
        service_id: order.service_id?.toString() ?? '',
        due_date: order.due_date ? new Date(order.due_date).toISOString().split('T')[0] : '',
        priority: order.priority ?? 'normal',
        teeth: order.teeth ?? ([] as number[]),
        shade: order.shade ?? '',
        material: order.material ?? '',
        instructions: order.instructions ?? '',
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('clinic.orders.update', order.id));
    };

    const selectedLab = labs.find(l => l.id.toString() === data.lab_id);
    const availableServices = selectedLab ? selectedLab.services : [];

    const steps = [
        { id: 1, name: 'Patient & Service', icon: User },
        { id: 2, name: 'Clinical Details', icon: Activity },
    ];

    const toggleTooth = (toothNumber: number) => {
        if (data.teeth.includes(toothNumber)) {
            setData('teeth', data.teeth.filter(t => t !== toothNumber));
        } else {
            setData('teeth', [...data.teeth, toothNumber]);
        }
    };

    return (
        <ClinicLayout>
            <Head title={`Edit Order #${order.id}`} />

            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => window.history.back()} className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Edit Order #{order.id}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 2: {steps[step - 1].name}</p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="relative flex justify-between items-center px-4 md:px-12 py-4">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-gray-200 dark:bg-slate-700 -z-10"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gradient-to-r from-primary-500 to-primary-600 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-primary-50 dark:bg-slate-900 px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step >= s.id
                                    ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110'
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs font-semibold uppercase tracking-wider transition-colors hidden sm:block ${step >= s.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>{s.name}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={submit} className="glass-card rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 md:p-8 min-h-[400px]">

                        {/* STEP 1: PATIENT & SERVICE */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                value={data.patient_id}
                                                onChange={(e) => setData('patient_id', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select a patient</option>
                                                {patients.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                                            </div>
                                        </div>
                                        <InputError message={errors.patient_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Laboratory</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                value={data.lab_id}
                                                onChange={(e) => setData('lab_id', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select a laboratory</option>
                                                {labs.map(l => (
                                                    <option key={l.id} value={l.id}>{l.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                                            </div>
                                        </div>
                                        <InputError message={errors.lab_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
                                        <div className="relative">
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <select
                                                value={data.service_id}
                                                onChange={(e) => setData('service_id', e.target.value)}
                                                disabled={!data.lab_id}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select service</option>
                                                {availableServices.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.name} - {s.price} MAD</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                                            </div>
                                        </div>
                                        <InputError message={errors.service_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                                            />
                                        </div>
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority Level</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 border rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all ${data.priority === 'normal'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500'
                                            : 'border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600'
                                            }`}>
                                            <input type="radio" value="normal" checked={data.priority === 'normal'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className={`w-4 h-4 rounded-full border-2 ${data.priority === 'normal' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}></div>
                                            <span className="font-medium">Standard Priority</span>
                                        </label>
                                        <label className={`flex-1 border rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all ${data.priority === 'urgent'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ring-1 ring-red-500'
                                            : 'border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-slate-600'
                                            }`}>
                                            <input type="radio" value="urgent" checked={data.priority === 'urgent'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className={`w-4 h-4 rounded-full border-2 ${data.priority === 'urgent' ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}></div>
                                            <span className="font-medium">Urgent Rush</span>
                                        </label>
                                    </div>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: CLINICAL DETAILS */}
                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-white/40 dark:bg-slate-900/40 shadow-inner p-4 sm:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden backdrop-blur-sm">
                                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary-500" />
                                        Interactive Odontogram
                                    </h3>

                                    <div className="w-full flex justify-center pb-4">
                                        <Odontogram
                                            selectedTeeth={data.teeth}
                                            onToggle={toggleTooth}
                                        />
                                    </div>

                                    <div className="text-center relative z-10 mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-slate-800/80 shadow-sm inline-block px-6 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                                            Selected teeth: <span className="font-bold text-primary-600 dark:text-primary-400">{data.teeth.length > 0 ? [...data.teeth].sort().join(', ') : 'None'}</span>
                                        </p>
                                    </div>
                                    <InputError message={errors.teeth} className="text-center mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shade (Teinte)</label>
                                        <select
                                            value={data.shade}
                                            onChange={(e) => setData('shade', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Shade</option>
                                            {['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4', 'BL1', 'BL2', 'BL3', 'BL4'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.shade} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Preference</label>
                                        <TextInput
                                            value={data.material}
                                            onChange={(e) => setData('material', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. Zirconia ML, E-max Press"
                                        />
                                        <InputError message={errors.material} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions & Notes</label>
                                    <textarea
                                        rows={4}
                                        value={data.instructions}
                                        onChange={(e) => setData('instructions', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
                                        placeholder="Add specific instructions for the lab technician..."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50/50 dark:bg-slate-900/50 px-4 sm:px-8 py-5 border-t border-gray-100 dark:border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${step === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
                                }`}
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={step === 2 ? (() => submit({ preventDefault: () => { } } as any)) : nextStep}
                            disabled={processing}
                            className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:from-primary-500 hover:to-primary-400 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            {step === 2 ? 'Update Order' : 'Next Step'}
                            {!processing && step !== 2 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </ClinicLayout>
    );
}
