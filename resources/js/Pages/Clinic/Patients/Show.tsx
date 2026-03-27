import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
 ArrowLeft, User, Mail, Phone, Calendar, FileText, 
 ChevronRight, Package, Clock, CheckCircle2, AlertCircle, 
 Building, Zap, DollarSign, TrendingUp, XCircle, 
 Activity, History, FilePlus, ShieldAlert, Heart, Plus, 
 CalendarCheck, ClipboardList, PenTool, Hash
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';
import Odontogram from '@/Components/Odontogram';

interface Patient {
 id: number;
 first_name: string;
 last_name: string;
 email: string;
 phone: string;
 dob: string;
 external_id: string | null;
 medical_notes: string | null;
 allergies: string | null;
 medical_history: string | null;
 blood_group: string | null;
 orders: any[];
}

interface TimelineItem {
 id: string;
 date: string;
 type: 'order' | 'appointment' | 'clinical_note';
 title: string;
 status?: string;
 lab?: string;
 price?: number;
 doctor?: string;
 notes?: string;
 content?: string;
 author?: string;
}

interface Props extends PageProps {
 patient: Patient;
 stats: {
 total_orders: number;
 total_spent: number;
 completed: number;
 in_progress: number;
 pending: number;
 cancelled: number;
 };
 timeline: TimelineItem[];
}

export default function Show({ auth, patient, stats, timeline }: Props) {
 const { t } = useTranslation();
 const [activeTab, setActiveTab] = useState<'timeline' | 'clinical' | 'analytics'>('timeline');

 const { data, setData, post, processing, reset } = useForm({
 type: 'general',
 content: '',
 });

 const submitNote = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('clinic.patients.store-note', patient.id), {
 onSuccess: () => {
 reset('content');
 }
 });
 };

 const tabStyles = (tab: string) => 
 `px-6 py-3 text-[13px] font-bold transition-all border-b-2 ${activeTab === tab 
 ? 'border-[#818cf8] text-[#818cf8]' 
 : 'border-transparent hover:'}`;

 return (
 <ClinicLayout>
 <Head title={`${patient.first_name} ${patient.last_name}`} />

 <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
 
 {/* Premium Banner Section */}
 <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
 style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.06) 0%, rgba(96,221,198,0.05) 100%)', border: '1px solid var(--border)' }}>
 
 {/* Background abstract blurs for premium feel */}
 <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20 pointer-events-none blur-[80px]" style={{ background: '#818cf8' }} />
 <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-20 pointer-events-none blur-[80px]" style={{ background: '#60ddc6' }} />

 <div className="relative z-10 flex items-center gap-5">
 <Link href={route('clinic.patients.index')} 
 className="p-2.5 rounded-2xl border transition-all hover:bg-white/10" 
 style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
 <ArrowLeft size={18} />
 </Link>

 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#818cf8] to-[#6638b4] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/40">
 {patient.first_name[0]}{patient.last_name[0]}
 </div>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2">
 <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {patient.first_name} {patient.last_name}
 </h1>
 <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider" 
 style={{ background: 'var(--surface)', color: 'var(--txt-3)', border: '1px solid var(--border)' }}>
 #{patient.id}
 </span>
 </div>
 <div className="flex items-center gap-3 text-[12.5px] font-medium" style={{ color: 'var(--txt-3)' }}>
 <span className="flex items-center gap-1.5"><Phone size={13} /> {patient.phone || 'N/A'}</span>
 <span style={{ color: 'var(--border-strong)' }}>|</span>
 <span className="flex items-center gap-1.5"><Mail size={13} /> {patient.email || 'N/A'}</span>
 {patient.blood_group && (
 <>
 <span style={{ color: 'var(--border-strong)' }}>|</span>
 <span className="flex items-center gap-1.5 uppercase font-bold tracking-tighter" style={{ color: '#f87171' }}>
 <Heart size={13} /> {patient.blood_group}
 </span>
 </>
 )}
 </div>
 </div>
 </div>
 </div>
 
 <div className="relative z-10 flex items-center gap-2.5">
 <Link href={route('clinic.patients.edit', patient.id)} 
 className="px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-all" 
 style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}
 onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--txt-1)'; }}
 onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--txt-2)'; }}>
 {t('Edit Profile')}
 </Link>
 <Link href={route('clinic.orders.create', { patient_id: patient.id })} className="btn-primary flex items-center gap-2 px-5 py-2.5 shadow-lg shadow-teal-500/20">
 <Plus size={15} /> {t('New Treatment')}
 </Link>
 </div>
 </div>

 {/* Tabs Navigation */}
 <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
 <button onClick={() => setActiveTab('timeline')} className={tabStyles('timeline')}>
 <div className="flex items-center gap-2"><History size={14} /> {t('Clinical Timeline')}</div>
 </button>
 <button onClick={() => setActiveTab('clinical')} className={tabStyles('clinical')}>
 <div className="flex items-center gap-2"><Heart size={14} /> {t('Medical Record')}</div>
 </button>
 <button onClick={() => setActiveTab('analytics')} className={tabStyles('analytics')}>
 <div className="flex items-center gap-2"><TrendingUp size={14} /> {t('Analytics')}</div>
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Left Column: Summary & Notes */}
 <div className="flex flex-col gap-6">
 
 {/* Quick Stats */}
 <div className="grid grid-cols-2 gap-3">
 <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-raised)' }}>
 <Package size={18} className="mb-2 text-[#818cf8]" />
 <span className="text-[20px] font-bold" style={{ color: 'var(--txt-1)' }}>{stats.total_orders}</span>
 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-4)' }}>{t('Total Orders')}</span>
 </div>
 <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-raised)' }}>
 <DollarSign size={18} className="mb-2 text-[#60ddc6]" />
 <span className="text-[20px] font-bold" style={{ color: 'var(--txt-1)' }}>{stats.total_spent}</span>
 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-4)' }}>{t('Spent (DH)')}</span>
 </div>
 </div>

 {/* Note Creator */}
 <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
 <h3 className="text-[13px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
 <PenTool size={14} style={{ color: '#818cf8' }} /> {t('Add Clinical Note')}
 </h3>
 <form onSubmit={submitNote} className="flex flex-col gap-3">
 <select className="app-input text-[12px] py-1.5" value={data.type} onChange={e => setData('type', e.target.value)}>
 <option value="general">{t('General Note')}</option>
 <option value="prescription">{t('Prescription')}</option>
 <option value="diagnostic">{t('Diagnostic Record')}</option>
 </select>
 <textarea 
 className="app-input text-[13px] min-h-[100px] resize-none" 
 placeholder={t('Write medical observations...')}
 value={data.content}
 onChange={e => setData('content', e.target.value)}
 required
 />
 <button type="submit" disabled={processing} className="btn-primary w-full text-[12px] py-2">
 {processing ? t('Saving...') : t('Save Entry')}
 </button>
 </form>
 </div>

 {/* Alert Badges */}
 <div className="card p-5 border-l-4 border-rose-500/50" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
 <h3 className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-2 flex items-center gap-2">
 <AlertCircle size={14} /> {t('Patient Alerts')}
 </h3>
 <div className="space-y-2">
 <div className="text-[12px] p-2 rounded-lg bg-rose-500/10 border border-rose-500/20" style={{ color: 'var(--txt-2)' }}>
 <span className="font-bold text-rose-500">{t('Allergies')}:</span> {patient.allergies || t('None reported')}
 </div>
 <div className="text-[12px] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20" style={{ color: 'var(--txt-2)' }}>
 <span className="font-bold text-amber-500">{t('History')}:</span> {patient.medical_history || t('Clean history')}
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Dynamic Content based on Active Tab */}
 <div className="lg:col-span-2">
 {activeTab === 'timeline' && (
 <div className="flex flex-col gap-4">
 {timeline.map((item, idx) => (
 <div key={item.id} className="relative pl-8 group">
 {/* Timeline Line */}
 <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-white/5 last:bg-transparent group-last:hidden" />
 
 {/* Timeline Dot/Icon */}
 <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110"
 style={{ 
 background: 'var(--bg-raised)', 
 borderColor: item.type === 'order' ? '#60ddc6' : item.type === 'appointment' ? '#818cf8' : '#f59e0b' 
 }}>
 {item.type === 'order' ? <Package size={10} style={{ color: '#60ddc6' }} /> :
 item.type === 'appointment' ? <CalendarCheck size={10} style={{ color: '#818cf8' }} /> :
 <FileText size={10} style={{ color: '#f59e0b' }} />}
 </div>

 {/* Timeline Content */}
 <div className="card p-5 mb-4 group-hover:border-white/10 transition-colors" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex justify-between items-start mb-2">
 <div>
 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-4)' }}>
 {new Date(item.date).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}
 </span>
 <h4 className="text-[15px] font-bold mt-1" style={{ color: 'var(--txt-1)' }}>{item.title}</h4>
 </div>
 {item.type === 'order' && (
 <Link href={route('clinic.orders.show', item.id.split('-')[1])} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color: 'var(--txt-3)' }}>
 <ChevronRight size={14} />
 </Link>
 )}
 </div>

 {item.type === 'clinical_note' && (
 <div className="text-[13px] leading-relaxed p-3 rounded-lg mt-2" style={{ background: 'var(--surface)', color: 'var(--txt-2)' }}>
 {item.content}
 <p className="text-[10px] mt-2 italic text-right opacity-50">BY: {item.author}</p>
 </div>
 )}

 {item.type === 'order' && (
 <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="flex flex-col">
 <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{t('Laboratory')}</span>
 <span className="text-[12px] font-bold" style={{ color: 'var(--txt-2)' }}>{item.lab}</span>
 </div>
 <div className="flex flex-col text-right">
 <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{t('Price')}</span>
 <span className="text-[12px] font-bold text-[#60ddc6]">{item.price} DH</span>
 </div>
 </div>
 )}

 {item.type === 'appointment' && (
 <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
 <span className="flex items-center gap-1" style={{ color: 'var(--txt-3)' }}>
 <User size={12} /> {item.doctor}
 </span>
 <span className="px-2 py-0.5 rounded bg-white/5" style={{ color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
 {item.status?.toUpperCase()}
 </span>
 </div>
 )}
 </div>
 </div>
 ))}
 {timeline.length === 0 && (
 <div className="h-64 flex flex-col items-center justify-center opacity-30 grayscale p-10 text-center">
 <History size={48} className="mb-4" />
 <p className="text-sm">{t('No medical history recorded for this patient.')}</p>
 </div>
 )}
 </div>
 )}

 {activeTab === 'clinical' && (
 <div className="flex flex-col gap-6">
 {/* Odontogram */}
 <div className="card p-6" style={{ background: 'var(--bg-raised)' }}>
 <h3 className="text-[14px] font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
 <Activity size={16} /> {t('Interactive Odontogram')}
 </h3>
 <div className="flex justify-center">
 <div className="max-w-[500px] w-full">
 <Odontogram 
 selectedTeeth={patient.orders?.flatMap((o: any) => o.teeth || [])} 
 readOnly={true} 
 />
 </div>
 </div>
 <div className="mt-6 flex items-center gap-4 justify-center">
 <div className="flex items-center gap-2 text-[11px] font-bold">
 <div className="w-3 h-3 rounded bg-[#60ddc6]" />
 <span>{t('Active Treatments')}</span>
 </div>
 <div className="flex items-center gap-2 text-[11px] font-bold opacity-30">
 <div className="w-3 h-3 rounded " />
 <span>{t('History Items')}</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
 <h4 className="text-[12px] font-bold uppercase tracking-widest mb-4 opacity-50">{t('Vitals')}</h4>
 <div className="space-y-4">
 <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
 <span className="text-[13px]" style={{ color: 'var(--txt-3)' }}>{t('Blood Group')}</span>
 <span className="text-[14px] font-black text-rose-500">{patient.blood_group || 'N/A'}</span>
 </div>
 <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
 <span className="text-[13px]" style={{ color: 'var(--txt-3)' }}>{t('Last Visit')}</span>
 <span className="text-[14px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {timeline[0]?.date ? new Date(timeline[0].date).toLocaleDateString() : 'Never'}
 </span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-[13px]" style={{ color: 'var(--txt-3)' }}>{t('Age')}</span>
 <span className="text-[14px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() + ' ' + t('years') : 'N/A'}
 </span>
 </div>
 </div>
 </div>
 <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
 <h4 className="text-[12px] font-bold uppercase tracking-widest mb-4 opacity-50">{t('File Storage')}</h4>
 <div className="flex flex-col items-center justify-center py-10 opacity-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
 <ClipboardList size={32} className="mb-2" />
 <p className="text-[11px] font-bold">{t('X-Rays & Documents (0)')}</p>
 </div>
 </div>
 </div>
 </div>
 )}

 {activeTab === 'analytics' && (
 <div className="card p-8 flex flex-col gap-8 animate-in fade-in" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center gap-4 mb-2">
 <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#818cf8]/10 text-[#818cf8]">
 <TrendingUp size={24} />
 </div>
 <div>
 <h3 className="text-xl font-bold">{t('Patient Analytics Overview')}</h3>
 <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('Insights based on order and treatment history')}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Order Status Breakdown */}
 <div className="space-y-4">
 <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-50">{t('Order Status Distribution')}</h4>
 <div className="space-y-3">
 <div className="flex flex-col gap-1">
 <div className="flex justify-between text-[12px] font-bold">
 <span style={{ color: 'var(--txt-2)' }}>{t('Completed')}</span>
 <span>{stats.completed}</span>
 </div>
 <div className="h-2 w-full rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.total_orders > 0 ? (stats.completed / (stats.total_orders || 1)) * 100 : 0}%` }}></div>
 </div>
 </div>

 <div className="flex flex-col gap-1">
 <div className="flex justify-between text-[12px] font-bold">
 <span style={{ color: 'var(--txt-2)' }}>{t('In Progress')}</span>
 <span>{stats.in_progress}</span>
 </div>
 <div className="h-2 w-full rounded-full overflow-hidden">
 <div className="h-full bg-[#818cf8] rounded-full" style={{ width: `${stats.total_orders > 0 ? (stats.in_progress / (stats.total_orders || 1)) * 100 : 0}%` }}></div>
 </div>
 </div>

 <div className="flex flex-col gap-1">
 <div className="flex justify-between text-[12px] font-bold">
 <span style={{ color: 'var(--txt-2)' }}>{t('Pending')}</span>
 <span>{stats.pending}</span>
 </div>
 <div className="h-2 w-full rounded-full overflow-hidden">
 <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.total_orders > 0 ? (stats.pending / (stats.total_orders || 1)) * 100 : 0}%` }}></div>
 </div>
 </div>
 
 <div className="flex flex-col gap-1">
 <div className="flex justify-between text-[12px] font-bold">
 <span style={{ color: 'var(--txt-2)' }}>{t('Cancelled / Rejected')}</span>
 <span>{stats.cancelled}</span>
 </div>
 <div className="h-2 w-full rounded-full overflow-hidden">
 <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stats.total_orders > 0 ? (stats.cancelled / (stats.total_orders || 1)) * 100 : 0}%` }}></div>
 </div>
 </div>
 </div>
 </div>

 {/* Financial & Activity Summary */}
 <div className="space-y-4">
 <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-50">{t('Key Metrics')}</h4>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-1">
 <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Avg Order Value')}</span>
 <span className="text-xl font-bold" style={{ color: '#60ddc6' }}>
 {stats.total_orders > 0 ? (stats.total_spent / stats.total_orders).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0} DH
 </span>
 </div>
 <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-1">
 <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Completion Rate')}</span>
 <span className="text-xl font-bold" style={{ color: '#818cf8' }}>
 {stats.total_orders > 0 ? Math.round((stats.completed / stats.total_orders) * 100) : 0}%
 </span>
 </div>
 </div>
 <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-1 w-full mt-4">
 <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Total Lifetime Value')}</span>
 <span className="text-3xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>
 {stats.total_spent.toLocaleString()} DH
 </span>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </ClinicLayout>
 );
}
