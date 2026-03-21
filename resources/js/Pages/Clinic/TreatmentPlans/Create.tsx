import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
 Plus, Trash2, Save, X, DollarSign, Stethoscope, 
 User, ListOrdered, FileText, ChevronLeft, ArrowRight,
 GripVertical, Info
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Props {
 patients: { id: number; first_name: string; last_name: string }[];
 preselectedPatientId?: number;
}

export default function CreateTreatmentPlan({ patients, preselectedPatientId }: Props) {
 const { t } = useTranslation();
 const { data, setData, post, processing, errors } = useForm({
 patient_id: preselectedPatientId || '',
 title: '',
 description: '',
 status: 'draft',
 estimated_cost: 0,
 steps: [{ title: '', description: '', cost: 0, sort_order: 0 }]
 });

 const addStep = () => {
 setData('steps', [...data.steps, { title: '', description: '', cost: 0, sort_order: data.steps.length }]);
 };

 const removeStep = (idx: number) => {
 if (data.steps.length === 1) return;
 setData('steps', data.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sort_order: i })));
 };

 const updateStep = (idx: number, field: string, value: any) => {
 const newSteps = [...data.steps];
 newSteps[idx] = { ...newSteps[idx], [field]: value };
 setData('steps', newSteps);
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('clinic.treatment-plans.store'));
 };

 return (
 <ClinicLayout>
 <Head title={t('Create Treatment Plan')} />

 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <Link
 href={route('clinic.treatment-plans.index')}
 className="p-2 rounded-xl transition-colors shrink-0"
 style={{ background: 'var(--surface-hover)', color: 'var(--txt-2)' }}
 >
 <ChevronLeft size={20} />
 </Link>
 <div>
 <h1 className="text-xl font-semibold transition-colors" style={{ color: 'var(--txt-1)' }}>{t('Plan Treatment')}</h1>
 <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Design a clinical journey for your patient')}</p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 {/* Basic Info */}
 <div className="card p-5 space-y-5">
 <div className="flex items-center gap-2 mb-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
 <Stethoscope style={{ color: 'var(--txt-accent)' }} size={16} />
 <h2 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-1)' }}>{t('Basic Information')}</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5 md:col-span-2">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Plan Title')}</label>
 <input
 type="text"
 value={data.title}
 onChange={(e) => setData('title', e.target.value)}
 placeholder={t('e.g. Full Arch Oral Rehabilitation')}
 className="app-input font-medium"
 />
 {errors.title && <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.title}</p>}
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Select Patient')}</label>
 <div className="relative">
 <select
 value={data.patient_id}
 onChange={(e) => setData('patient_id', e.target.value)}
 className="app-input appearance-none pr-10"
 >
 <option value="">{t('Choose a patient...')}</option>
 {patients.map(p => (
 <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
 ))}
 </select>
 <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-3)' }} size={14} />
 </div>
 {errors.patient_id && <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.patient_id}</p>}
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Estimated Cost')}</label>
 <div className="relative">
 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} size={14} />
 <input
 type="number"
 value={data.estimated_cost}
 onChange={(e) => setData('estimated_cost', parseFloat(e.target.value) || 0)}
 className="app-input pl-9"
 />
 </div>
 </div>

 <div className="space-y-1.5 md:col-span-2">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Clinical Summary')}</label>
 <textarea
 value={data.description}
 onChange={(e) => setData('description', e.target.value)}
 rows={3}
 placeholder={t('Describe the clinical approach, patient goals, or case background...')}
 className="app-input text-[13px] leading-relaxed"
 />
 </div>
 </div>
 </div>

 {/* Steps Card */}
 <div className="card p-5 space-y-5">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <ListOrdered style={{ color: 'var(--txt-accent)' }} size={16} />
 <h2 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-1)' }}>{t('Treatment Steps')}</h2>
 </div>
 <button
 type="button"
 onClick={addStep}
 className="btn-primary"
 >
 <Plus size={14} /> {t('Add Step')}
 </button>
 </div>

 <div className="space-y-3">
 {data.steps.map((step, idx) => (
 <div key={idx} className="flex gap-4 p-4 rounded-xl border group relative transition-colors"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex flex-col items-center gap-2 pt-1">
 <div className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-black/5 light:hover:bg-white/50 transition-colors"
 style={{ color: 'var(--txt-3)' }}>
 <GripVertical size={16} />
 </div>
 <div className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border"
 style={{ background: 'var(--teal-10)', color: 'var(--teal)', borderColor: 'var(--teal-20)' }}>
 {idx + 1}
 </div>
 </div>

 <div className="flex-1 space-y-3">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
 <div className="md:col-span-3 space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Step Title')}</label>
 <input
 type="text"
 value={step.title}
 onChange={(e) => updateStep(idx, 'title', e.target.value)}
 placeholder={t('Example: Scaling, Extractions, Preliminary Scans...')}
 className="app-input"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Step Cost')}</label>
 <input
 type="number"
 value={step.cost}
 onChange={(e) => updateStep(idx, 'cost', parseFloat(e.target.value) || 0)}
 className="app-input"
 />
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Description (Optional)')}</label>
 <textarea
 value={step.description}
 onChange={(e) => updateStep(idx, 'description', e.target.value)}
 rows={2}
 className="app-input text-[12px]"
 />
 </div>
 </div>
 
 <button
 type="button"
 onClick={() => removeStep(idx)}
 className="absolute top-4 right-4 p-1.5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-lg"
 >
 <Trash2 size={16} />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="card p-5 lg:sticky lg:top-20 space-y-5">
 <h2 className="text-[12px] font-semibold uppercase tracking-wider border-b pb-3" style={{ color: 'var(--txt-1)', borderColor: 'var(--border)' }}>{t('Finalize Plan')}</h2>
 
 <div className="space-y-4">
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Starting Status')}</label>
 <select
 value={data.status}
 onChange={(e) => setData('status', e.target.value)}
 className="app-input appearance-none font-semibold uppercase tracking-wider cursor-pointer"
 >
 <option value="draft">{t('Draft Only')}</option>
 <option value="active">{t('Active / Ready')}</option>
 </select>
 </div>

 <div className="p-4 rounded-xl space-y-2 border" style={{ background: 'var(--teal-10)', borderColor: 'var(--teal-20)' }}>
 <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--teal)' }}>
 <Info size={14} />
 <span className="text-[10px] font-semibold uppercase tracking-widest">{t('Pro Tip')}</span>
 </div>
 <p className="text-[10.5px] leading-relaxed font-medium uppercase" style={{ color: 'var(--teal)' }}>
 {t('You can link these steps to Lab Orders later from the plan detail page to track manufacturing.')}
 </p>
 </div>

 <div className="pt-4 flex flex-col gap-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
 <button
 type="submit"
 disabled={processing}
 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
 style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}
 >
 <Save size={16} /> {t('Save Plan')}
 </button>
 <Link
 href={route('clinic.treatment-plans.index')}
 className="btn-ghost w-full justify-center py-2.5"
 >
 {t('Discard')}
 </Link>
 </div>
 </div>
 </div>
 </div>
 </form>
 </div>
 </ClinicLayout>
 );
}
