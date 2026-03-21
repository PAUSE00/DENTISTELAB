import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
 Stethoscope, Clock, CheckCircle2, AlertCircle, FileText, 
 ArrowLeft, Calendar, User, Info, MoreVertical, Plus, 
 ExternalLink, CheckCircle, ChevronDown, ListTodo, History,
 MessageSquare, DollarSign, Activity
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Props {
 plan: any;
}

export default function ShowTreatmentPlan({ plan }: Props) {
 const { t } = useTranslation();
 const [expandedStep, setExpandedStep] = useState<number | null>(null);

 const updateStepStatus = (stepId: number, status: string) => {
 router.patch(route('clinic.treatment-plans.steps.status', { plan: plan.id, step: stepId }), { status }, {
 preserveScroll: true
 });
 };

 const getStatusStyle = (s: string) => {
 switch (s) {
 case 'completed': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: t('Completed') };
 case 'active': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: t('Active') };
 case 'cancelled': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: t('Cancelled') };
 default: return { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', label: t('Draft') };
 }
 };

 const getStepStatusStyle = (s: string) => {
 switch (s) {
 case 'done': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: CheckCircle2 };
 case 'in_progress': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', icon: Activity };
 case 'skipped': return { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', icon: XCircle };
 default: return { bg: 'rgba(255,255,255,0.02)', color: '#64748b', icon: Clock };
 }
 };

 const formatCur = (num: number) => 
 new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(num);

 const activeSteps = plan.steps.filter((s:any) => s.status === 'done').length;
 const progress = (activeSteps / plan.steps.length) * 100;

 return (
 <ClinicLayout>
 <Head title={`${plan.title} - ${plan.patient.first_name}`} />

 <div className="p-6 max-w-5xl mx-auto space-y-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <Link
 href={route('clinic.treatment-plans.index')}
 className="p-2 hover:text-white rounded-xl transition-colors"
 >
 <ArrowLeft size={20} />
 </Link>
 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-2xl font-black text-white">{plan.title}</h1>
 <div 
 className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
 style={{ backgroundColor: getStatusStyle(plan.status).bg, color: getStatusStyle(plan.status).color }}
 >
 {getStatusStyle(plan.status).label}
 </div>
 </div>
 <div className="flex items-center gap-2 text-sm font-bold mt-1">
 <User size={14} className="" />
 {plan.patient.first_name} {plan.patient.last_name}
 <span className=" mx-1">·</span>
 <span className="italic">{t('Created on')} {new Date(plan.created_at).toLocaleDateString()}</span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 hover: text-white font-bold rounded-xl transition-all">
 <Plus size={18} /> {t('Link Lab Order')}
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Steps Timeline */}
 <div className="lg:col-span-2 space-y-6">
 <div className=" border p-6 rounded-3xl shadow-sm relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
 
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-2">
 <ListTodo className="text-blue-500" size={20} />
 <h2 className="text-sm font-black uppercase tracking-widest text-white">{t('Treatment Roadmap')}</h2>
 </div>
 <div className="text-xs font-bold uppercase tracking-widest">
 {activeSteps} / {plan.steps.length} {t('Steps Done')}
 </div>
 </div>

 <div className="space-y-0 relative">
 {/* Connector Line */}
 <div className="absolute left-[19px] top-4 bottom-12 w-0.5 " />
 
 {plan.steps.map((step: any, idx: number) => {
 const st = getStepStatusStyle(step.status);
 const StepIcon = st.icon;
 const isExpanded = expandedStep === idx;
 return (
 <div key={step.id} className={`relative pl-12 pb-10 last:pb-0 group transition-all`}>
 {/* Node */}
 <div 
 className={`absolute left-0 w-10 h-10 rounded-full border-4 ring-2 ring-slate-800 z-10 flex items-center justify-center transition-all `}
 style={{ color: st.color }}
 >
 <StepIcon size={18} className="" />
 </div>

 <div className={`p-5 rounded-2xl border transition-all ${isExpanded ? ' shadow-xl' : ' hover: hover:'}`}>
 <div className="flex items-start justify-between">
 <div className="cursor-pointer flex-1" onClick={() => setExpandedStep(isExpanded ? null : idx)}>
 <h3 className={`font-black text-sm transition-colors ${step.status === 'done' ? ' line-through' : 'text-white'}`}>
 {step.title}
 </h3>
 <div className="flex items-center gap-3 mt-1 text-[10px] uppercase font-black tracking-widest ">
 {step.cost > 0 && <span>{formatCur(step.cost)}</span>}
 {step.completed_at && <span className="text-emerald-500">Done on {new Date(step.completed_at).toLocaleDateString()}</span>}
 </div>
 </div>
 
 <div className="flex items-center gap-2">
 {step.status !== 'done' && (
 <button 
 onClick={(e) => { e.stopPropagation(); updateStepStatus(step.id, 'done'); }}
 className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-lg transition-all"
 title={t('Mark as completed')}
 >
 <CheckCircle size={16} />
 </button>
 )}
 <button 
 className="p-1.5 hover:text-white transition-colors"
 onClick={() => setExpandedStep(isExpanded ? null : idx)}
 >
 <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
 </button>
 </div>
 </div>

 {isExpanded && (
 <div className="mt-4 pt-4 border-t space-y-4 animate-in slide-in-from-top-2 duration-300">
 <div className="text-xs leading-relaxed italic border-l pl-3">
 {step.description || t('No detailed steps provided.')}
 </div>
 
 {step.order_id && (
 <div className="flex items-center justify-between p-2.5 bg-blue-500/5 rounded-xl border border-blue-500/10">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-500">
 <FileText size={14} />
 </div>
 <div className="text-[10px] font-black text-white uppercase">{t('Linked Lab Order')} #{step.order_id}</div>
 </div>
 <Link href={route('clinic.orders.show', step.order_id)} className="text-blue-500 hover:text-blue-400 transition-colors">
 <ExternalLink size={14} />
 </Link>
 </div>
 )}

 <div className="flex items-center gap-2 pt-2">
 <select 
 value={step.status}
 onChange={(e) => updateStepStatus(step.id, e.target.value)}
 className=" border-none text-[10px] font-black uppercase tracking-widest rounded-lg px-2 py-1 outline-none"
 >
 <option value="pending">{t('Pending')}</option>
 <option value="in_progress">{t('In Progress')}</option>
 <option value="skipped">{t('Skipped')}</option>
 <option value="done">{t('Completed')}</option>
 </select>
 </div>
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Left Sidebar Extra Info */}
 <div className="space-y-6">
 {/* Overall Progress */}
 <div className=" border p-6 rounded-3xl space-y-6 shadow-sm">
 <h2 className="text-sm font-black uppercase tracking-widest text-white border-b pb-3">{t('Treatment Velocity')}</h2>
 
 <div className="space-y-4">
 <div className="space-y-2">
 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
 <span>{t('Execution Progress')}</span>
 <span>{Math.round(progress)}%</span>
 </div>
 <div className="w-full h-3 rounded-full overflow-hidden border ">
 <div 
 className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-700" 
 style={{ width: `${progress}%` }} 
 />
 </div>
 </div>

 <div className="grid grid-cols-1 gap-3 pt-2">
 <div className=" p-4 rounded-3xl border ">
 <div className="text-[10px] font-bold uppercase mb-1 tracking-widest">{t('Estimated Cost')}</div>
 <div className="text-2xl font-black text-white">{formatCur(plan.estimated_cost)}</div>
 </div>
 <div className=" p-4 rounded-3xl border ">
 <div className="text-[10px] font-bold uppercase mb-1 tracking-widest">{t('Case Owner')}</div>
 <div className="text-sm font-black text-white flex items-center gap-2">
 <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{plan.creator.name.charAt(0)}</div>
 {plan.creator.name}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Description */}
 <div className=" border p-6 rounded-3xl space-y-4">
 <div className="flex items-center gap-2">
 <MessageSquare className="" size={16} />
 <h3 className="text-[10px] font-black uppercase tracking-widest">{t('Case Narrative')}</h3>
 </div>
 <p className="text-xs leading-relaxed italic border-l-2 pl-4 py-1">
 "{plan.description || t('No narrative provided.')}"
 </p>
 </div>
 </div>
 </div>
 </div>
 </ClinicLayout>
 );
}

const XCircle = ({ size, className }: { size: number, className: string }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
 <circle cx="12" cy="12" r="10" />
 <line x1="15" y1="9" x2="9" y2="15" />
 <line x1="9" y1="9" x2="15" y2="15" />
 </svg>
);
