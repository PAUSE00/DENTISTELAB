import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, User, MoreHorizontal, X, Check, AlertCircle, CalendarDays } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import Modal from '@/Components/Modal';

interface Appointment {
 id: number;
 patient_id: number;
 doctor_id: number;
 start_time: string;
 end_time: string;
 status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
 notes: string | null;
 patient: { id: number; first_name: string; last_name: string };
 doctor: { id: number; name: string };
}

interface Props extends PageProps {
 appointments: Appointment[];
 patients: { id: number; first_name: string; last_name: string }[];
 doctors: { id: number; name: string }[];
}

export default function Index({ auth, appointments, patients, doctors }: Props) {
 const { t } = useTranslation();
 const [viewDate, setViewDate] = useState(new Date());
 const [isCreateOpen, setIsCreateOpen] = useState(false);
 const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

 const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
 patient_id: '',
 doctor_id: doctors[0]?.id || '',
 start_time: '',
 end_time: '',
 status: 'pending',
 notes: '',
 });

 const currentMonthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

 // Calendar logic
 const daysInMonth = useMemo(() => {
 const year = viewDate.getFullYear();
 const month = viewDate.getMonth();
 const firstDay = new Date(year, month, 1).getDay();
 const lastDate = new Date(year, month + 1, 0).getDate();
 
 const days = [];
 // Pad start
 for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
 // Days
 for (let d = 1; d <= lastDate; d++) days.push(new Date(year, month, d));
 
 return days;
 }, [viewDate]);

 const appointmentsByDay = useMemo(() => {
 const map: Record<string, Appointment[]> = {};
 appointments.forEach(app => {
 const dateStr = new Date(app.start_time).toDateString();
 if (!map[dateStr]) map[dateStr] = [];
 map[dateStr].push(app);
 });
 return map;
 }, [appointments]);

 const changeMonth = (offset: number) => {
 const next = new Date(viewDate);
 next.setMonth(next.getMonth() + offset);
 setViewDate(next);
 };

 const handleCreate = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('clinic.appointments.store'), {
 onSuccess: () => {
 setIsCreateOpen(false);
 reset();
 }
 });
 };

 const handleUpdateStatus = (app: Appointment, newStatus: string) => {
 router.patch(route('clinic.appointments.update', app.id), { status: newStatus });
 setSelectedAppointment(null);
 };

 const statusColors = {
 pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', dot: '#f59e0b' },
 confirmed: { bg: 'rgba(129,140,248,0.1)', text: '#818cf8', dot: '#818cf8' },
 completed: { bg: 'rgba(52,211,153,0.1)', text: '#34d399', dot: '#34d399' },
 cancelled: { bg: 'rgba(248,113,113,0.1)', text: '#f87171', dot: '#f87171' },
 };

 const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

 return (
 <ClinicLayout>
 <Head title={t('Appointments')} />
 <div className="flex flex-col gap-6 pb-10 h-full">

 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
 style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
 <CalendarDays size={20} />
 </div>
 <div>
 <h1 className="text-[18px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Clinic Scheduler')}
 </h1>
 <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {t('Manage patient visits and doctor availability.')}
 </p>
 </div>
 </div>
 <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
 <Plus size={14} /> {t('Book Appointment')}
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 
 {/* Calendar Main View */}
 <div className="lg:col-span-3 flex flex-col gap-4">
 <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
 {/* Calendar Header */}
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-[16px] font-bold" style={{ color: 'var(--txt-1)' }}>{currentMonthName}</h2>
 <div className="flex items-center gap-2">
 <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--txt-3)' }}>
 <ChevronLeft size={18} />
 </button>
 <button onClick={() => setViewDate(new Date())} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-white/5" style={{ border: '1px solid var(--border)', color: 'var(--txt-2)' }}>
 {t('Today')}
 </button>
 <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--txt-3)' }}>
 <ChevronRight size={18} />
 </button>
 </div>
 </div>

 {/* Calendar Grid */}
 <div className="grid grid-cols-7 gap-px" style={{ background: 'var(--border)' }}>
 {/* Week Days */}
 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
 <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest" style={{ background: 'var(--bg-raised)', color: 'var(--txt-3)' }}>
 {t(day)}
 </div>
 ))}
 
 {daysInMonth.map((day, idx) => {
 const dateStr = day?.toDateString();
 const dayApps = dateStr ? appointmentsByDay[dateStr] || [] : [];
 const isToday = dateStr === new Date().toDateString();
 const isSelectedMonth = day && day.getMonth() === viewDate.getMonth();

 return (
 <div key={idx} className="min-h-[100px] p-2 flex flex-col gap-1 transition-colors group"
 style={{ background: isToday ? 'rgba(129,140,248,0.03)' : 'var(--bg-raised)' }}>
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[12px] font-bold ${isToday ? 'w-6 h-6 rounded-full flex items-center justify-center bg-[#818cf8] text-white' : ''}`}
 style={{ color: isToday ? '#fff' : (isSelectedMonth ? 'var(--txt-2)' : 'var(--txt-4)') }}>
 {day?.getDate()}
 </span>
 {day && (
 <button onClick={() => { setData('start_time', day.toISOString().slice(0, 16)); setIsCreateOpen(true); }}
 className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/5" style={{ color: '#60ddc6' }}>
 <Plus size={12} />
 </button>
 )}
 </div>
 
 <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
 {dayApps.slice(0, 3).map(app => (
 <button key={app.id}
 onClick={() => setSelectedAppointment(app)}
 className="text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate hover:brightness-110 transition-all border border-black/10"
 style={{ background: statusColors[app.status].bg, color: statusColors[app.status].text }}>
 {formatTime(app.start_time)} {app.patient.last_name}
 </button>
 ))}
 {dayApps.length > 3 && (
 <span className="text-[9px] font-bold px-1" style={{ color: 'var(--txt-3)' }}>
 + {dayApps.length - 3} {t('more')}
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Sidebar: Upcoming/Selected Info */}
 <div className="flex flex-col gap-5">
 <div className="card p-5 h-full flex flex-col" style={{ background: 'var(--bg-raised)' }}>
 <h3 className="text-[13px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
 <Clock size={14} style={{ color: '#818cf8' }} /> {t('Upcoming Today')}
 </h3>
 
 <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
 {appointmentsByDay[new Date().toDateString()]?.length ? (
 appointmentsByDay[new Date().toDateString()].map(app => (
 <div key={app.id} onClick={() => setSelectedAppointment(app)}
 className="p-3 rounded-xl border cursor-pointer hover:border-[#818cf8]/50 transition-all group"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex justify-between items-start mb-2">
 <span className="text-[11px] font-bold" style={{ color: statusColors[app.status].text }}>
 {formatTime(app.start_time)}
 </span>
 <div className="w-2 h-2 rounded-full" style={{ background: statusColors[app.status].dot }} />
 </div>
 <p className="text-[13px] font-bold truncate" style={{ color: 'var(--txt-1)' }}>
 {app.patient.first_name} {app.patient.last_name}
 </p>
 <p className="text-[10px] mt-1" style={{ color: 'var(--txt-3)' }}>
 {t('With')} <span className="font-semibold" style={{ color: 'var(--txt-2)' }}>{app.doctor.name}</span>
 </p>
 </div>
 ))
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 px-4">
 <CalendarIcon size={24} className="mb-2" />
 <p className="text-[11px]">{t('No appointments for today.')}</p>
 </div>
 )}
 </div>

 <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="p-3 rounded-xl bg-gradient-to-br from-[#818cf8]/20 to-transparent border border-[#818cf8]/20">
 <p className="text-[11px] font-bold" style={{ color: '#818cf8' }}>{t('Quick Tip')}</p>
 <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--txt-3)' }}>
 {t('Click on any empty cell in the calendar to quickly book a slot.')}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Create Appointment Modal */}
 <Modal show={isCreateOpen} onClose={() => { setIsCreateOpen(false); reset(); clearErrors(); }}>
 <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-[17px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('New Appointment')}</h2>
 <button onClick={() => setIsCreateOpen(false)} style={{ color: 'var(--txt-3)' }}><X size={18} /></button>
 </div>

 <form onSubmit={handleCreate} className="flex flex-col gap-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block opacity-50">{t('Select Patient')}</label>
 <select className="app-input" value={data.patient_id} onChange={e => setData('patient_id', e.target.value)} required>
 <option value="">{t('Choose patient...')}</option>
 {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
 </select>
 {errors.patient_id && <p className="text-[11px] mt-1 text-red-500">{errors.patient_id}</p>}
 </div>
 <div>
 <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block opacity-50">{t('Treating Doctor')}</label>
 <select className="app-input" value={data.doctor_id} onChange={e => setData('doctor_id', e.target.value)} required>
 {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
 </select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block opacity-50">{t('Start Time')}</label>
 <input type="datetime-local" className="app-input" value={data.start_time} onChange={e => setData('start_time', e.target.value)} required />
 </div>
 <div>
 <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block opacity-50">{t('Expected End')}</label>
 <input type="datetime-local" className="app-input" value={data.end_time} onChange={e => setData('end_time', e.target.value)} required />
 </div>
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block opacity-50">{t('Clinical Notes')}</label>
 <textarea className="app-input h-20 resize-none" value={data.notes} onChange={e => setData('notes', e.target.value)} placeholder={t('Reason for visit, symptoms...')} />
 </div>

 <button type="submit" disabled={processing} className="btn-primary w-full mt-2 py-3">
 {processing ? t('Saving...') : t('Confirm Booking')}
 </button>
 </form>
 </div>
 </Modal>

 {/* Appointment Detail Modal */}
 <Modal show={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
 {selectedAppointment && (
 <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex justify-between items-center mb-6">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-6 rounded-full" style={{ background: statusColors[selectedAppointment.status].dot }} />
 <h2 className="text-[17px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Appointment Details')}</h2>
 </div>
 <button onClick={() => setSelectedAppointment(null)} style={{ color: 'var(--txt-3)' }}><X size={18} /></button>
 </div>

 <div className="flex flex-col gap-5">
 <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
 <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
 style={{ background: 'linear-gradient(135deg, #818cf8, #6638b4)' }}>
 {selectedAppointment.patient.first_name[0]}{selectedAppointment.patient.last_name[0]}
 </div>
 <div className="flex-1">
 <p className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {selectedAppointment.patient.first_name} {selectedAppointment.patient.last_name}
 </p>
 <div className="flex items-center gap-3 mt-1">
 <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--txt-3)' }}>
 <User size={10} /> {selectedAppointment.doctor.name}
 </span>
 <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--txt-3)' }}>
 <Clock size={10} /> {formatTime(selectedAppointment.start_time)} - {formatTime(selectedAppointment.end_time)}
 </span>
 </div>
 </div>
 </div>

 {selectedAppointment.notes && (
 <div className="p-4 rounded-xl italic text-[13px] border" style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
 "{selectedAppointment.notes}"
 </div>
 )}

 <div className="grid grid-cols-2 gap-2 mt-2">
 {selectedAppointment.status !== 'confirmed' && (
 <button onClick={() => handleUpdateStatus(selectedAppointment, 'confirmed')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold border border-[#818cf8]/20 text-[#818cf8] hover:bg-[#818cf8]/5 transition-all">
 <Check size={14} /> {t('Confirm Visit')}
 </button>
 )}
 {selectedAppointment.status !== 'completed' && (
 <button onClick={() => handleUpdateStatus(selectedAppointment, 'completed')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold border border-[#34d399]/20 text-[#34d399] hover:bg-[#34d399]/5 transition-all">
 <Check size={14} /> {t('Mark Done')}
 </button>
 )}
 {selectedAppointment.status !== 'cancelled' && (
 <button onClick={() => handleUpdateStatus(selectedAppointment, 'cancelled')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold border border-[#f87171]/20 text-[#f87171] hover:bg-[#f87171]/5 transition-all">
 <X size={14} /> {t('Cancel')}
 </button>
 )}
 <button onClick={() => { router.delete(route('clinic.appointments.destroy', selectedAppointment.id)); setSelectedAppointment(null); }}
 className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
 <AlertCircle size={14} /> {t('Delete')}
 </button>
 </div>
 </div>
 </div>
 )}
 </Modal>
 </ClinicLayout>
 );
}
