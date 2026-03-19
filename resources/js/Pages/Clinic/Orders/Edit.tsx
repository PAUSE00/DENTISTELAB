import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import { useState, FormEventHandler } from 'react';
import { Check, ChevronRight, Activity, User, Building, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
        { id: 1, name: t('Patient & Service'), icon: User },
        { id: 2, name: t('Clinical Details'), icon: Activity },
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

            <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => window.history.back()} className="p-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--txt-2)' }}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--txt-1)' }}>{t('Edit Order')} #{order.id}</h1>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--txt-2)' }}>
                            {t('Step')} {step} {t('of')} 2: {steps[step - 1].name}
                        </p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="relative flex justify-between items-center px-4 md:px-12 py-4">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] -z-10" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, background: 'var(--teal)' }}></div>

                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 px-2" style={{ background: 'var(--bg)' }}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step >= s.id
                                    ? 'shadow-lg scale-110'
                                    : ''
                                    }`}
                                style={{
                                    background: step >= s.id ? 'var(--teal)' : 'var(--bg)',
                                    borderColor: step >= s.id ? 'var(--teal)' : 'var(--border)',
                                    color: step >= s.id ? '#fff' : 'var(--txt-3)'
                                }}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors hidden sm:block ${step >= s.id ? '' : 'opacity-50'}`} style={{ color: step >= s.id ? 'var(--teal)' : 'var(--txt-2)' }}>{s.name}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={submit} className="card overflow-hidden">
                    <div className="p-6 md:p-8 min-h-[400px]">

                        {/* STEP 1: PATIENT & SERVICE */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Patient')}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.patient_id}
                                                onChange={(e) => setData('patient_id', e.target.value)}
                                                className="app-input w-full pl-12 py-3 appearance-none"
                                            >
                                                <option value="">{t('Select a patient')}</option>
                                                {patients.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 rotate-90" style={{ color: 'var(--txt-3)' }} />
                                            </div>
                                        </div>
                                        <InputError message={errors.patient_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Target Laboratory')}</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.lab_id}
                                                onChange={(e) => setData('lab_id', e.target.value)}
                                                className="app-input w-full pl-12 py-3 appearance-none"
                                            >
                                                <option value="">{t('Select a laboratory')}</option>
                                                {labs.map(l => (
                                                    <option key={l.id} value={l.id}>{l.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 rotate-90" style={{ color: 'var(--txt-3)' }} />
                                            </div>
                                        </div>
                                        <InputError message={errors.lab_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Service Type')}</label>
                                        <div className="relative">
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.service_id}
                                                onChange={(e) => setData('service_id', e.target.value)}
                                                disabled={!data.lab_id}
                                                className="app-input w-full pl-12 py-3 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{t('Select service')}</option>
                                                {availableServices.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.name} - {s.price} MAD</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 rotate-90" style={{ color: 'var(--txt-3)' }} />
                                            </div>
                                        </div>
                                        <InputError message={errors.service_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Due Date')}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                            <input
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                className="app-input w-full pl-12 py-3"
                                            />
                                        </div>
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 mt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Priority Level')}</label>
                                    <div className="flex gap-4">
                                        <label
                                            className="flex-1 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all border"
                                            style={{
                                                borderColor: data.priority === 'normal' ? 'var(--teal)' : 'var(--border)',
                                                background: data.priority === 'normal' ? 'var(--teal-10)' : 'var(--bg)',
                                            }}
                                        >
                                            <input type="radio" value="normal" checked={data.priority === 'normal'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: data.priority === 'normal' ? 'var(--teal)' : 'var(--txt-3)' }}>
                                                {data.priority === 'normal' && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--teal)' }}></div>}
                                            </div>
                                            <span className="font-bold text-[13px]" style={{ color: data.priority === 'normal' ? 'var(--teal)' : 'var(--txt-1)' }}>{t('Standard Priority')}</span>
                                        </label>
                                        <label
                                            className="flex-1 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all border"
                                            style={{
                                                borderColor: data.priority === 'urgent' ? 'var(--red)' : 'var(--border)',
                                                background: data.priority === 'urgent' ? 'var(--red-10)' : 'var(--bg)',
                                            }}
                                        >
                                            <input type="radio" value="urgent" checked={data.priority === 'urgent'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: data.priority === 'urgent' ? 'var(--red)' : 'var(--txt-3)' }}>
                                                {data.priority === 'urgent' && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--red)' }}></div>}
                                            </div>
                                            <span className="font-bold text-[13px]" style={{ color: data.priority === 'urgent' ? 'var(--red)' : 'var(--txt-1)' }}>{t('Urgent Rush')}</span>
                                        </label>
                                    </div>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: CLINICAL DETAILS */}
                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="p-4 sm:p-8 rounded-2xl border relative overflow-hidden" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest mb-8 flex items-center gap-2" style={{ color: 'var(--txt-2)' }}>
                                        <Activity className="w-4 h-4" style={{ color: 'var(--teal)' }} />
                                        {t('Interactive Odontogram')}
                                    </h3>

                                    <div className="w-full flex justify-center pb-4">
                                        <Odontogram
                                            selectedTeeth={data.teeth}
                                            onToggle={toggleTooth}
                                        />
                                    </div>

                                    <div className="text-center relative z-10 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-[12px] font-semibold inline-block px-6 py-2 rounded-full border shadow-xs" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                                            {t('Selected teeth')}: <span className="font-bold" style={{ color: 'var(--teal)' }}>{data.teeth.length > 0 ? [...data.teeth].sort().join(', ') : 'None'}</span>
                                        </p>
                                    </div>
                                    <InputError message={errors.teeth} className="text-center mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Shade')} (Teinte)</label>
                                        <div className="relative">
                                            <select
                                                value={data.shade}
                                                onChange={(e) => setData('shade', e.target.value)}
                                                className="app-input appearance-none py-3"
                                            >
                                                <option value="">{t('Select Shade')}</option>
                                                {['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4', 'BL1', 'BL2', 'BL3', 'BL4'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 rotate-90" style={{ color: 'var(--txt-3)' }} />
                                            </div>
                                        </div>
                                        <InputError message={errors.shade} />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Material Preference')}</label>
                                        <input
                                            type="text"
                                            value={data.material}
                                            onChange={(e) => setData('material', e.target.value)}
                                            className="app-input py-3 w-full"
                                            placeholder="e.g. Zirconia ML, E-max Press"
                                        />
                                        <InputError message={errors.material} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Instructions')} & Notes</label>
                                    <textarea
                                        rows={4}
                                        value={data.instructions}
                                        onChange={(e) => setData('instructions', e.target.value)}
                                        className="app-input resize-none py-3 w-full"
                                        placeholder={t('Add specific instructions for the lab technician...')}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {t('Back')}
                        </button>

                        <button
                            type="button"
                            onClick={step === 2 ? (() => submit({ preventDefault: () => { } } as any)) : nextStep}
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span className="font-bold">{step === 2 ? t('Update Order') : t('Next Step')}</span>
                            {!processing && step !== 2 && <ChevronRight className="w-4 h-4 ml-1" />}
                        </button>
                    </div>
                </form>
            </div>
        </ClinicLayout>
    );
}
