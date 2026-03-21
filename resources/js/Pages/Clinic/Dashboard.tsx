import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
 Package, Clock, CheckCircle2, ArrowRight, Users, DollarSign,
 Activity, Plus, AlertTriangle, ChevronRight, Stethoscope,
 MessageSquare, FileText, Calendar, Archive, ExternalLink,
 FlaskConical, TrendingUp, AlertCircle, UserPlus, Inbox
} from 'lucide-react';
import {
 AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
 ResponsiveContainer, LineChart, Line, BarChart, Bar
} from 'recharts';
import DateRangeFilter from '@/Components/DateRangeFilter';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Appointment {
 id: number;
 patient_name: string;
 doctor_name: string;
 start_time: string;
 status: string;
}

interface Order {
 id: number;
 patient_name: string;
 lab_name: string;
 service_name: string;
 status: string;
 payment_status: string;
 created_at: string;
 due_date: string | null;
}

interface DashboardProps extends PageProps {
 stats: {
 active_orders: number;
 new_orders: number;
 overdue: number;
 outstanding: number;
 patient_count: number;
 new_patients_month: number;
 completed_this_month: number;
 // legacy
 total_orders: number;
 pending_orders: number;
 completed_orders: number;
 total_spend: number;
 };
 chartData: Array<{ name: string; orders: number; spend: number }>;
 recent_orders: Order[];
 today_appointments: Appointment[];
 status_breakdown: Record<string, number>;
 filters: { start_date: string; end_date: string };
}

// ── Lookup tables ─────────────────────────────────────────────
const ORDER_STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
 new: { label: 'New', dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.12)' },
 in_progress: { label: 'In Progress', dot: '#818cf8', text: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
 fitting: { label: 'Fitting', dot: '#c084fc', text: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
 finished: { label: 'Finished', dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.12)' },
 shipped: { label: 'Shipped', dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.12)' },
 delivered: { label: 'Delivered', dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.12)' },
 rejected: { label: 'Rejected', dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.12)' },
 archived: { label: 'Archived', dot: '#94a3b8', text: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
 cancelled: { label: 'Cancelled', dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
 paid: { label: 'Paid', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
 partial: { label: 'Partial', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
 unpaid: { label: 'Unpaid', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

const APPT_STATUS: Record<string, { dot: string; text: string }> = {
 pending: { dot: '#f59e0b', text: '#f59e0b' },
 confirmed: { dot: '#818cf8', text: '#818cf8' },
 completed: { dot: '#34d399', text: '#34d399' },
 cancelled: { dot: '#f87171', text: '#f87171' },
};

// ── Helpers ───────────────────────────────────────────────────
const fmtDate = (d: string) =>
 new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

const fmtTime = (iso: string) =>
 new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const fmtCurrency = (v: number) =>
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

const getDuePriority = (order: Order) => {
 if (!order.due_date) return { label: 'low', color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
 const diff = (new Date(order.due_date).getTime() - Date.now()) / 86400000;
 if (diff < 3) return { label: 'high', color: '#f87171', bg: 'rgba(248,113,113,0.12)' };
 if (diff < 7) return { label: 'med', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
 return { label: 'low', color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
};

const StatusPill = ({ status }: { status: string }) => {
 const { t } = useTranslation();
 const s = ORDER_STATUS[status] ?? ORDER_STATUS.new;
 return (
 <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
 style={{ background: s.bg, color: s.text }}>
 <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: s.dot }} />
 {t(s.label)}
 </span>
 );
};

// ── Chart tooltip ─────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
 if (!active || !payload?.length) return null;
 return (
 <div className="card px-3 py-2 text-[11px] shadow-xl" style={{ border: '1px solid var(--border-strong)' }}>
 <p className="font-bold mb-1" style={{ color: 'var(--txt-2)' }}>{label}</p>
 {payload.map((p: any) => (
 <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
 {p.dataKey === 'spend' ? fmtCurrency(p.value) : `${p.value} cases`}
 </p>
 ))}
 </div>
 );
};

// ─────────────────────────────────────────────────────────────
export default function Dashboard({ auth, stats, chartData, recent_orders, today_appointments, status_breakdown, filters }: DashboardProps) {
 const { t } = useTranslation();

 useEffect(() => {
 if (window.Echo) {
 window.Echo.private(`clinic.${auth.user.clinic_id}`)
 .listen('.order.updated', () => router.reload({ only: ['stats', 'chartData', 'recent_orders', 'today_appointments'] }));
 }
 return () => { if (window.Echo) window.Echo.leave(`clinic.${auth.user.clinic_id}`); };
 }, [auth.user.clinic_id]);

 const hour = new Date().getHours();
 const greeting = hour < 12 ? t('Good morning') : hour < 18 ? t('Good afternoon') : t('Good evening');

 // Quick actions — all pointing to real routes
 const actions = [
 { label: 'New Lab Order', sub: 'Submit a case', icon: FlaskConical, color: '#60ddc6', bg: 'rgba(96,221,198,0.08)', href: 'clinic.orders.create' },
 { label: 'Add Patient', sub: 'Patient registry', icon: UserPlus, color: '#818cf8', bg: 'rgba(129,140,248,0.08)', href: 'clinic.patients.create' },
 { label: 'Appointments', sub: 'View calendar', icon: Calendar, color: '#c084fc', bg: 'rgba(192,132,252,0.08)', href: 'clinic.appointments.index' },
 { label: 'Messages', sub: 'Lab communications', icon: MessageSquare, color: '#34d399', bg: 'rgba(52,211,153,0.08)', href: 'clinic.inbox.index' },
 { label: 'Billing', sub: 'Invoices & payments', icon: DollarSign, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', href: 'clinic.billing.index' },
 { label: 'Analytics', sub: 'Charts & insights', icon: TrendingUp, color: '#f87171', bg: 'rgba(248,113,113,0.08)', href: 'clinic.analytics.index' },
 ];

 const totalStatusOrders = Object.values(status_breakdown).reduce((a, b) => a + b, 0);

 return (
 <ClinicLayout>
 <Head title={t('Clinic Dashboard')} />

 <div className="flex flex-col gap-5 pb-10">

 {/* ── Welcome Banner ─────────────────────────────────────── */}
 <div className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
 style={{ background: 'linear-gradient(135deg,rgba(96,221,198,0.06) 0%,rgba(129,140,248,0.05) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
 <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-10 pointer-events-none"
 style={{ background: 'radial-gradient(circle,#60ddc6,transparent)', filter: 'blur(40px)' }} />

 <div className="relative z-10">
 <h2 className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t(greeting)}, <span style={{ color: '#60ddc6' }}>{t('Dr.')} {auth.user.name.split(' ').pop()}</span> 👋
 </h2>
 <p className="text-[12px] mt-1 font-medium" style={{ color: 'var(--txt-3)' }}>
 {auth.user.clinic?.name} · {t('Clinic Portal')}
 </p>
 </div>

 <div className="flex items-center gap-3 relative z-10 flex-wrap justify-end">
 <DateRangeFilter startDate={filters.start_date} endDate={filters.end_date} />
 <Link href={route('clinic.orders.create')} className="btn-primary shrink-0">
 <Plus size={13} /> {t('New Order')}
 </Link>
 </div>
 </div>

 {/* ── KPI Cards ─────────────────────────────────────────── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

 {/* Active Lab Cases */}
 <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between">
 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Active Lab Cases')}</p>
 <FlaskConical size={13} style={{ color: '#818cf8' }} />
 </div>
 <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>
 {stats.active_orders}
 </p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }}>
 {stats.new_orders} {t('Awaiting Lab')}
 </span>
 {stats.overdue > 0 && (
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
 {stats.overdue} {t('Overdue')}
 </span>
 )}
 </div>
 </div>

 {/* Outstanding Debt */}
 <div className="card p-4 flex flex-col gap-2"
 style={{ background: stats.outstanding > 0 ? 'rgba(245,158,11,0.04)' : 'var(--bg-raised)', borderColor: stats.outstanding > 0 ? 'rgba(245,158,11,0.2)' : 'var(--border)' }}>
 <div className="flex items-center justify-between">
 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Outstanding Balance')}</p>
 <DollarSign size={13} style={{ color: '#f59e0b' }} />
 </div>
 <p className="text-[26px] font-black leading-none tabular-nums" style={{ color: stats.outstanding > 0 ? '#f59e0b' : 'var(--txt-1)' }}>
 {fmtCurrency(stats.outstanding)}
 </p>
 <p className="text-[10px] font-semibold opacity-40">
 {t('Unpaid / partially paid orders')}
 </p>
 </div>

 {/* Patients */}
 <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between">
 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Patients')}</p>
 <Users size={13} style={{ color: '#c084fc' }} />
 </div>
 <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>
 {stats.patient_count}
 </p>
 <p className="text-[10px] font-bold" style={{ color: '#c084fc' }}>
 +{stats.new_patients_month} {t('this month')}
 </p>
 </div>

 {/* Completed This Month */}
 <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between">
 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Delivered (month)')}</p>
 <CheckCircle2 size={13} style={{ color: '#34d399' }} />
 </div>
 <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>
 {stats.completed_this_month}
 </p>
 <div style={{ height: 28 }}>
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={chartData}>
 <Line type="monotone" dataKey="orders" stroke="#34d399" strokeWidth={1.5} dot={false} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* ── Middle Row: Chart + Today's Appointments ─────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

 {/* 6-month activity chart */}
 <div className="card lg:col-span-7 p-5 flex flex-col gap-3" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-start justify-between">
 <div>
 <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Lab Case Volume — Last 6 Months')}</p>
 <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{t('Order count and total spend trend')}</p>
 </div>
 <div className="flex items-center gap-3 text-[11px]">
 <span className="flex items-center gap-1.5" style={{ color: '#818cf8' }}>
 <span className="w-4 h-0.5 rounded inline-block" style={{ background: '#818cf8' }} />
 {t('Cases')}
 </span>
 <span className="flex items-center gap-1.5" style={{ color: '#60ddc6' }}>
 <span className="w-4 h-0.5 rounded inline-block" style={{ background: '#60ddc6' }} />
 {t('Spend')}
 </span>
 </div>
 </div>

 <div style={{ height: 180 }}>
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
 <defs>
 <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
 <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
 </linearGradient>
 <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#60ddc6" stopOpacity={0.25} />
 <stop offset="100%" stopColor="#60ddc6" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--txt-3)', fontSize: 10 }} dy={8} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--txt-3)', fontSize: 10 }} />
 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
 <Area type="monotone" dataKey="orders" stroke="#818cf8" strokeWidth={1.5} fillOpacity={1} fill="url(#gOrders)" dot={false} activeDot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }} />
 <Area type="monotone" dataKey="spend" stroke="#60ddc6" strokeWidth={1.5} fillOpacity={1} fill="url(#gSpend)" dot={false} activeDot={{ r: 3, fill: '#60ddc6', strokeWidth: 0 }} />
 </AreaChart>
 </ResponsiveContainer>
 </div>

 {/* Status pills */}
 <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
 {Object.entries(status_breakdown).map(([status, count]) => (
 <span key={status} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
 style={{ background: ORDER_STATUS[status]?.bg ?? 'var(--surface)', color: ORDER_STATUS[status]?.text ?? 'var(--txt-2)', borderColor: 'transparent' }}>
 <span className="w-1.5 h-1.5 rounded-full" style={{ background: ORDER_STATUS[status]?.dot ?? '#888' }} />
 {t(ORDER_STATUS[status]?.label ?? status)}
 <span className="opacity-60 ml-0.5">{count}</span>
 </span>
 ))}
 </div>
 </div>

 {/* Today's Schedule */}
 <div className="card lg:col-span-5 p-5 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between">
 <div>
 <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t("Today's Schedule")}</p>
 <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
 </p>
 </div>
 <Link href={route('clinic.appointments.index')} className="text-[11px] font-bold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: '#818cf8' }}>
 {t('Full Calendar')} <ExternalLink size={10} />
 </Link>
 </div>

 <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[220px] pr-1">
 {today_appointments.length === 0 ? (
 <div className="flex-1 flex flex-col items-center justify-center py-8 text-center opacity-30">
 <Calendar size={28} className="mb-2" />
 <p className="text-xs">{t('No appointments scheduled today')}</p>
 </div>
 ) : today_appointments.map(appt => {
 const s = APPT_STATUS[appt.status] ?? APPT_STATUS.pending;
 return (
 <div key={appt.id} className="flex items-center gap-3 p-2.5 rounded-xl border transition-all hover:border-[#818cf8]/30"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold text-[10px]"
 style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
 {fmtTime(appt.start_time)}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[12px] font-bold truncate" style={{ color: 'var(--txt-1)' }}>{appt.patient_name}</p>
 <p className="text-[10px] truncate" style={{ color: 'var(--txt-3)' }}>
 {t('With')} {appt.doctor_name}
 </p>
 </div>
 <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
 </div>
 );
 })}
 </div>

 {/* Quick actions grid */}
 <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-3">{t('Quick Actions')}</p>
 <div className="grid grid-cols-3 gap-2">
 {actions.map(({ label, sub, icon: Icon, color, bg, href }) => (
 <Link key={label} href={route(href as any)}
 className="flex flex-col items-start gap-2 p-2.5 rounded-xl border transition-all duration-200 group"
 style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
 onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.background = bg; }}
 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
 <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: bg, color }}>
 <Icon size={13} />
 </div>
 <div>
 <p className="text-[10px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>{t(label)}</p>
 <p className="text-[8.5px] uppercase tracking-widest font-bold mt-0.5 opacity-40">{t(sub)}</p>
 </div>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* ── Alerts ────────────────────────────────────────────── */}
 {(stats.overdue > 0 || stats.outstanding > 0 || stats.new_orders > 0) && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {stats.new_orders > 0 && (
 <Link href={route('clinic.orders.index', { status: 'new' })}
 className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-80"
 style={{ background: 'rgba(96,221,198,0.06)', border: '1px solid rgba(96,221,198,0.2)' }}>
 <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(96,221,198,0.12)', color: '#60ddc6' }}>
 <Package size={15} />
 </div>
 <div className="min-w-0">
 <p className="text-[12px] font-bold" style={{ color: '#60ddc6' }}>{t('Awaiting Lab Pickup')}</p>
 <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
 {stats.new_orders} {t('new orders sent to lab')}
 </p>
 </div>
 <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: '#60ddc6' }} />
 </Link>
 )}
 {stats.overdue > 0 && (
 <Link href={route('clinic.orders.index')}
 className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-80"
 style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
 <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
 <AlertCircle size={15} />
 </div>
 <div className="min-w-0">
 <p className="text-[12px] font-bold" style={{ color: '#f87171' }}>{t('Overdue Cases')}</p>
 <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
 {stats.overdue} {t('cases past their due date')}
 </p>
 </div>
 <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: '#f87171' }} />
 </Link>
 )}
 {stats.outstanding > 0 && (
 <Link href={route('clinic.billing.index')}
 className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-80"
 style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
 <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
 <DollarSign size={15} />
 </div>
 <div className="min-w-0">
 <p className="text-[12px] font-bold" style={{ color: '#f59e0b' }}>{t('Outstanding Balance')}</p>
 <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
 {fmtCurrency(stats.outstanding)} {t('unpaid to labs')}
 </p>
 </div>
 <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: '#f59e0b' }} />
 </Link>
 )}
 </div>
 )}

 {/* ── Recent Lab Orders ─────────────────────────────────── */}
 <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Recent Lab Orders')}</p>
 <Link href={route('clinic.orders.index')}
 className="flex items-center gap-1.5 text-[11.5px] font-semibold hover:opacity-70 transition-opacity"
 style={{ color: '#60ddc6' }}>
 {t('View All')} <ExternalLink size={11} />
 </Link>
 </div>

 <div className="table-responsive hide-scrollbar">
 <table className="data-table">
 <thead>
 <tr>
 <th>{t('Order')}</th>
 <th>{t('Priority')}</th>
 <th>{t('Patient')}</th>
 <th className="hidden md:table-cell">{t('Lab')}</th>
 <th className="hidden md:table-cell">{t('Service')}</th>
 <th>{t('Status')}</th>
 <th>{t('Payment')}</th>
 <th className="w-10" />
 </tr>
 </thead>
 <tbody>
 {recent_orders.length === 0 ? (
 <tr>
 <td colSpan={8} className="text-center py-12" style={{ color: 'var(--txt-3)' }}>
 {t('No orders yet — submit your first lab case!')}
 </td>
 </tr>
 ) : recent_orders.map(order => {
 const pri = getDuePriority(order);
 const pay = PAYMENT_STATUS[order.payment_status] ?? PAYMENT_STATUS.unpaid;
 return (
 <tr key={order.id}
 onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
 <td>
 <span className="font-bold tabular-nums" style={{ color: '#60ddc6' }}>#{order.id}</span>
 </td>
 <td>
 <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md"
 style={{ background: pri.bg, color: pri.color }}>
 {t(pri.label)}
 </span>
 </td>
 <td>
 <span className="font-semibold text-[12.5px]" style={{ color: 'var(--txt-1)' }}>{order.patient_name}</span>
 </td>
 <td className="hidden md:table-cell">
 <span className="text-[12px]" style={{ color: 'var(--txt-2)' }}>{order.lab_name}</span>
 </td>
 <td className="hidden md:table-cell">
 <span className="text-[12px]" style={{ color: 'var(--txt-2)' }}>{order.service_name}</span>
 </td>
 <td><StatusPill status={order.status} /></td>
 <td>
 <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold w-max"
 style={{ background: pay.bg, color: pay.color }}>
 {t(pay.label)}
 </span>
 </td>
 <td className="text-right">
 <Link href={route('clinic.orders.show', order.id)}
 className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all hover:scale-110"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = '#60ddc6'; }}
 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-3)'; }}>
 <ChevronRight size={13} />
 </Link>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 </ClinicLayout>
 );
}
