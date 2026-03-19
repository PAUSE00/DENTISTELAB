import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState, FormEventHandler, useRef } from 'react';
import { Check, ChevronRight, Upload, FileText, AlertCircle, User, Building, Activity, Calendar, File as FileIcon, X, ArrowLeft, Loader2, Bookmark } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import useTranslation from '@/Hooks/useTranslation';

// Types
interface Patient { id: number; name: string; }
interface Lab { id: number; name: string; services: any[] }

interface Template {
    id: number;
    name: string;
    lab_id: number | null;
    service_id: number | null;
    teeth_data: number[] | null;
    notes: string | null;
}

interface DuplicateData {
    patient_id: number;
    lab_id: number;
    service_id: number;
    priority: string;
    teeth: number[];
    shade: string;
    material: string;
    instructions: string | null;
}

interface Props extends PageProps {
    patients: Patient[];
    labs: Lab[];
    templates: Template[];
    duplicate?: DuplicateData;
}

export default function Create({ auth, patients, labs, templates, duplicate }: Props) {
    const [step, setStep] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        // Step 1
        patient_id: duplicate?.patient_id?.toString() ?? '',
        lab_id: duplicate?.lab_id?.toString() ?? '',
        service_id: duplicate?.service_id?.toString() ?? '',
        due_date: '',
        priority: duplicate?.priority ?? 'normal',

        // Step 2
        teeth: duplicate?.teeth ?? ([] as number[]),
        shade: duplicate?.shade ?? '',
        material: duplicate?.material ?? '',
        instructions: duplicate?.instructions ?? '',

        // Step 3
        files: [] as File[],
    });

    const applyTemplate = (template: Template) => {
        if (template.lab_id) setData('lab_id', template.lab_id.toString());
        // Wait for lab selection to propagate if service depends on it? 
        // In this UI it's separate state, so we just set it.
        if (template.service_id) setData('service_id', template.service_id.toString());
        if (template.teeth_data) setData('teeth', template.teeth_data);
        if (template.notes) setData('instructions', template.notes);
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clinic.orders.store'));
    };

    const removeFile = (indexToRemove: number) => {
        setData('files', data.files.filter((_, index) => index !== indexToRemove));
    };

    const toggleTooth = (toothNumber: number) => {
        if (data.teeth.includes(toothNumber)) {
            setData('teeth', data.teeth.filter(t => t !== toothNumber));
        } else {
            setData('teeth', [...data.teeth, toothNumber]);
        }
    };

    // Filter services based on selected lab
    const selectedLab = labs.find(l => l.id.toString() === data.lab_id);
    const availableServices = selectedLab ? selectedLab.services : [];

    const steps = [
        { id: 1, name: 'Patient & Service', icon: User },
        { id: 2, name: 'Clinical Details', icon: Activity },
        { id: 3, name: 'Files & Review', icon: FileText },
    ];

    return (
        <ClinicLayout>
            <Head title="New Order" />

            <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-2 rounded-xl transition-colors hover:bg-white/5" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--txt-2)' }}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--txt-1)' }}>{t('Create New Order')}</h1>
                            <p className="text-[12px] mt-0.5 uppercase tracking-widest font-bold opacity-50" style={{ color: 'var(--txt-2)' }}>{t('Step')} {step} {t('of')} 3: {steps[step - 1].name}</p>
                        </div>
                    </div>

                    {/* Quick Templates Toggle */}
                    {templates.length > 0 && (
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar max-w-md">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 shrink-0" style={{ color: 'var(--txt-2)' }}>{t('Smart Presets')}:</span>
                            {templates.map(tmp => (
                                <button 
                                    key={tmp.id} 
                                    type="button"
                                    onClick={() => applyTemplate(tmp)}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center gap-1.5 hover:opacity-80"
                                    style={{ border: '1px solid var(--teal-20)', background: 'var(--teal-10)', color: 'var(--teal)' }}
                                >
                                    <Bookmark size={10} /> {tmp.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stepper */}
                <div className="relative flex justify-between items-center px-4 md:px-12 py-4">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] -z-10" style={{ background: 'var(--border)' }}></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] -z-10 transition-all duration-500" style={{ background: 'var(--teal)', width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 px-2" style={{ background: 'var(--bg)' }}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2`}
                                style={step >= s.id
                                    ? { background: 'var(--teal-10)', borderColor: 'var(--teal-20)', color: 'var(--teal)', boxShadow: '0 0 16px rgba(96,221,198,0.2)' }
                                    : { background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--txt-3)' }}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider transition-colors hidden sm:block" 
                                  style={{ color: step >= s.id ? 'var(--txt-1)' : 'var(--txt-3)' }}>
                                {s.name}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={submit} className="card overflow-hidden transition-all duration-300">
                    <div className="p-6 md:p-8 min-h-[400px]">

                        {/* STEP 1: PATIENT & SERVICE */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Patient')}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.patient_id}
                                                onChange={(e) => setData('patient_id', e.target.value)}
                                                className="app-input pl-11 appearance-none py-3"
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
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.lab_id}
                                                onChange={(e) => setData('lab_id', e.target.value)}
                                                className="app-input pl-11 appearance-none py-3"
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
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                            <select
                                                value={data.service_id}
                                                onChange={(e) => setData('service_id', e.target.value)}
                                                disabled={!data.lab_id}
                                                className="app-input pl-11 appearance-none py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                            <input
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                className="app-input pl-11 py-3"
                                            />
                                        </div>
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <label className="block text-xs font-bold uppercase tracking-widest mt-4" style={{ color: 'var(--txt-2)' }}>{t('Priority Level')}</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all border"
                                            style={data.priority === 'normal'
                                                ? { borderColor: 'var(--teal-20)', background: 'var(--teal-10)', color: 'var(--teal)' }
                                                : { borderColor: 'var(--border-strong)', background: 'var(--surface)', color: 'var(--txt-2)' }}>
                                            <input type="radio" value="normal" checked={data.priority === 'normal'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: data.priority === 'normal' ? 'var(--teal)' : 'var(--border-strong)', background: data.priority === 'normal' ? 'var(--teal)' : 'transparent' }}></div>
                                            <span className="font-bold text-[13px]">{t('Standard Priority')}</span>
                                        </label>
                                        <label className="flex-1 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all border"
                                            style={data.priority === 'urgent'
                                                ? { borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }
                                                : { borderColor: 'var(--border-strong)', background: 'var(--surface)', color: 'var(--txt-2)' }}>
                                            <input type="radio" value="urgent" checked={data.priority === 'urgent'} onChange={(e) => setData('priority', e.target.value)} className="hidden" />
                                            <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: data.priority === 'urgent' ? '#f43f5e' : 'var(--border-strong)', background: data.priority === 'urgent' ? '#f43f5e' : 'transparent' }}></div>
                                            <span className="font-bold text-[13px]">{t('Urgent Rush')}</span>
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
                                            className="app-input py-3"
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
                                        className="app-input resize-none py-3"
                                        placeholder={t('Add specific instructions for the lab technician...')}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: FILES & REVIEW */}
                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.style.borderColor = 'var(--teal)';
                                        e.currentTarget.style.background = 'var(--teal-10)';
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.style.borderColor = 'var(--teal-20)';
                                        e.currentTarget.style.background = 'var(--bg)';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.style.borderColor = 'var(--teal-20)';
                                        e.currentTarget.style.background = 'var(--bg)';
                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                            setData('files', [...data.files, ...Array.from(e.dataTransfer.files)]);
                                        }
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group"
                                    style={{ borderColor: 'var(--teal-20)', background: 'var(--bg)' }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept=".stl,.obj,.ply,.pdf,.jpg,.png"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setData('files', [...data.files, ...Array.from(e.target.files)]);
                                            }
                                        }}
                                    />
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--teal-10)', color: 'var(--teal)' }}>
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--txt-1)' }}>{t('Upload Digital Impressions')}</h3>
                                    <p className="text-[13px] max-w-sm mx-auto" style={{ color: 'var(--txt-3)' }}>
                                        {t('Drag & drop files here or click to browse. Supports STL, OBJ, PLY, PDF, and Images up to 50MB.')}
                                    </p>
                                </div>

                                {data.files.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Attached Files')}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data.files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'var(--bg)', color: 'var(--teal)' }}>
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[13px] font-bold truncate max-w-[150px]" style={{ color: 'var(--txt-1)' }}>{file.name}</p>
                                                            <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="p-2 transition-colors hover:text-red-500" style={{ color: 'var(--txt-3)' }}>
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.files && <div className="text-red-500 font-bold text-sm mt-2">{errors.files}</div>}
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm font-bold">
                                        {t('Please check for errors in the previous steps before submitting.')}
                                        <ul className="list-disc pl-5 mt-2 text-xs font-normal">
                                            {Object.entries(errors).map(([key, value]) => (
                                                <li key={key}>{key.replace('_', ' ')}: {value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {data.service_id && availableServices.find((s: any) => s.id.toString() === data.service_id) && (
                                    <div className="p-5 rounded-xl flex items-center justify-between border" style={{ background: 'var(--teal-10)', borderColor: 'var(--teal-20)' }}>
                                        <span className="font-bold text-[13px] uppercase tracking-widest" style={{ color: 'var(--teal)' }}>{t('Estimated Total')}:</span>
                                        <span className="text-[18px] font-extrabold" style={{ color: 'var(--teal)' }}>
                                            {availableServices.find((s: any) => s.id.toString() === data.service_id)?.price} MAD
                                        </span>
                                    </div>
                                )}

                                <div className="p-5 rounded-xl flex items-start gap-4 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--purple)' }} />
                                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                                        {t('By submitting this order, you confirm that all patient details and clinical specifications are accurate. The laboratory will be notified immediately.')}
                                    </p>
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
                            type={step === 3 ? "submit" : "button"}
                            onClick={step === 3 ? undefined : nextStep}
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span className="font-bold">{step === 3 ? t('Submit Order') : t('Next Step')}</span>
                            {!processing && step !== 3 && <ChevronRight className="w-4 h-4 ml-1" />}
                        </button>
                    </div>
                </form>
            </div>

        </ClinicLayout>
    );
}
