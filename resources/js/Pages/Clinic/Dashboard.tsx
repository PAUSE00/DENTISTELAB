import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Package, Clock, CheckCircle2, ArrowRight, Users, DollarSign,
    Activity, Zap, TrendingUp, Calendar, ExternalLink,
    Plus, AlertTriangle, Bell, ChevronRight, Stethoscope,
    BarChart2, MessageSquare, FileText, Shield, Settings
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line
} from 'recharts';
import DateRangeFilter from '@/Components/DateRangeFilter';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface DashboardProps extends PageProps {
    stats: {
        total_orders: number;
        pending_orders: number;
        completed_orders: number;
        total_spend: number;
    };
    chartData: Array<{ name: string; orders: number; spend: number }>;
    recent_orders: Array<{
        id: number; patient_name: string; service_name: string;
        status: string; created_at: string; due_date: string;
    }>;
    filters: { start_date: string; end_date: string };
}

const STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    new:         { label: 'New',         dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.1)'  },
    in_progress: { label: 'In Progress', dot: '#818cf8', text: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
    fitting:     { label: 'Fitting',     dot: '#c084fc', text: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
    finished:    { label: 'Finished',    dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
    shipped:     { label: 'Shipped',     dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.1)'  },
    delivered:   { label: 'Delivered',   dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
    rejected:    { label: 'Rejected',    dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    archived:    { label: 'Archived',    dot: '#94a3b8', text: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    cancelled:   { label: 'Cancelled',   dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

const PRIORITY: Record<string, { label: string; color: string; bg: string }> = {
    high:   { label: 'high',   color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    medium: { label: 'med',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
    low:    { label: 'low',    color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
};

const getPriority = (order: DashboardProps['recent_orders'][0]) => {
    if (!order.due_date) return PRIORITY.low;
    const diff = (new Date(order.due_date).getTime() - Date.now()) / 86400000;
    if (diff < 3) return PRIORITY.high;
    if (diff < 7) return PRIORITY.medium;
    return PRIORITY.low;
};

const StatusPill = ({ status, t }: { status: string; t: any }) => {
    const s = STATUS[status] ?? STATUS.new;
    return (
        <span className="status-pill" style={{ background: s.bg, color: s.text }}>
            <span className="dot" style={{ background: s.dot }} />
            {t(s.label)}
        </span>
    );
};

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-3 py-2 text-[11.5px] shadow-xl" style={{ border: '1px solid var(--border-strong)' }}>
            <p style={{ color: 'var(--txt-3)' }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} className="font-semibold mt-0.5" style={{ color: p.color }}>
                    {p.dataKey === 'spend' ? fmtCurrency(p.value) : `${p.value} orders`}
                </p>
            ))}
        </div>
    );
};

export default function Dashboard({ auth, stats, chartData, recent_orders, filters }: DashboardProps) {
    const { t } = useTranslation();

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`clinic.${auth.user.clinic_id}`)
                .listen('.order.updated', () => {
                    router.reload({ only: ['stats', 'chartData', 'recent_orders'] });
                });
        }
        return () => { if (window.Echo) window.Echo.leave(`clinic.${auth.user.clinic_id}`); };
    }, [auth.user.clinic_id]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const pendingNew = Math.round(stats.pending_orders * 0.7);
    const pendingCritical = stats.pending_orders - pendingNew;
    const pendingPct = stats.total_orders > 0 ? (stats.pending_orders / stats.total_orders) * 100 : 0;

    const actions = [
        { label: 'New Protocol',    sub: 'Initialize Order',         icon: Plus,           color: '#60ddc6', bg: 'rgba(96,221,198,0.08)',   href: 'clinic.orders.create'   },
        { label: 'Patient Intake',  sub: 'Patient Entry',            icon: Users,          color: '#818cf8', bg: 'rgba(129,140,248,0.08)',  href: 'clinic.patients.create' },
        { label: 'Teleconsultation',sub: 'Full Audit',               icon: Stethoscope,    color: '#c084fc', bg: 'rgba(192,132,252,0.08)',  href: 'clinic.orders.index'    },
        { label: 'Inventory Mgmt', sub: 'Stock & materials',         icon: Package,        color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   href: 'clinic.orders.index'    },
        { label: 'Team Comms',      sub: 'Coordination Hub',         icon: MessageSquare,  color: '#34d399', bg: 'rgba(52,211,153,0.08)',   href: 'clinic.team.index'      },
        { label: 'Billing',         sub: 'Billing overview',         icon: FileText,       color: '#f87171', bg: 'rgba(248,113,113,0.08)',  href: 'clinic.orders.index'    },
    ];

    return (
        <ClinicLayout>
            <Head title={t('Clinic Dashboard')} />

            <div className="flex flex-col gap-5 pb-10">

                {/* ── Welcome Banner ─────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
                    style={{ background: 'linear-gradient(135deg, rgba(96,221,198,0.06) 0%, rgba(129,140,248,0.05) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-10 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #60ddc6, transparent)', filter: 'blur(40px)' }} />

                    <div className="relative z-10">
                        <h2 className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t(greeting)}, <span style={{ color: '#60ddc6' }}>{t('Dr.')} {auth.user.name.split(' ').pop()}</span> 👋
                        </h2>
                        <p className="text-[12px] mt-1 font-medium" style={{ color: 'var(--txt-3)' }}>
                            {auth.user.clinic?.name} · {t('Digital Workspace')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 flex-wrap justify-end">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[12px] font-semibold" style={{ color: 'var(--txt-2)' }}>{dateStr}</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--txt-3)' }}>{timeStr}</span>
                        </div>
                        <div style={{ width: 1, height: 28, background: 'var(--border-strong)' }} />
                        <DateRangeFilter startDate={filters.start_date} endDate={filters.end_date} />
                        <Link href={route('clinic.orders.create')} className="btn-primary shrink-0">
                            <Plus size={13} /> {t('New Order')}
                        </Link>
                    </div>
                </div>

                {/* ── KPI Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Pending */}
                    <div className="card p-4 flex flex-col gap-2 group" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Pending Requests')}</p>
                            <Package size={13} style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>{stats.pending_orders}</p>
                        <div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pendingPct, 100)}%`, background: 'linear-gradient(90deg, #60ddc6, #818cf8)' }} />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[10.5px] font-semibold" style={{ color: '#60ddc6' }}>{pendingNew} {t('New')}</span>
                                <span className="text-[10.5px] font-semibold" style={{ color: '#f87171' }}>{pendingCritical} {t('Critical')}</span>
                            </div>
                        </div>
                    </div>

                    {/* In Production */}
                    <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('In Production')}</p>
                            <Clock size={13} style={{ color: '#f59e0b' }} />
                        </div>
                        <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>{stats.total_orders}</p>
                        <div className="flex items-center gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex-1 h-1.5 rounded-full"
                                    style={{ background: i < Math.min(stats.total_orders, 8) ? '#f59e0b' : 'var(--surface)' }} />
                            ))}
                        </div>
                        <p className="text-[10.5px] font-semibold" style={{ color: 'var(--txt-3)' }}>
                            · {t('Status')} · {t('Active')}
                        </p>
                    </div>

                    {/* Delivered */}
                    <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Delivered (30d)')}</p>
                            <CheckCircle2 size={13} style={{ color: '#34d399' }} />
                        </div>
                        <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>{stats.completed_orders}</p>
                        <div style={{ height: 32 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.slice(-8)}>
                                    <Line type="monotone" dataKey="orders" stroke="#34d399" strokeWidth={1.5} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Revenue (MAD)')}</p>
                            <DollarSign size={13} style={{ color: '#60ddc6' }} />
                        </div>
                        <p className="text-[28px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>{fmtCurrency(stats.total_spend)}</p>
                        <div style={{ height: 32 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.slice(-8)}>
                                    <Line type="monotone" dataKey="spend" stroke="#60ddc6" strokeWidth={1.5} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Middle Row: Chart + Action Center ─────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                    {/* Dual-axis chart */}
                    <div className="card lg:col-span-7 p-5 flex flex-col gap-3" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Clinic Activity & Financial Trend')}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                    {new Date(filters.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —&nbsp;
                                    {new Date(filters.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-[11px]">
                                <span className="flex items-center gap-1.5" style={{ color: '#818cf8' }}>
                                    <span className="w-4 h-0.5 rounded" style={{ background: '#818cf8', display: 'inline-block' }} />
                                    {t('Order Count')}
                                </span>
                                <span className="flex items-center gap-1.5" style={{ color: '#60ddc6' }}>
                                    <span className="w-4 h-0.5 rounded" style={{ background: '#60ddc6', display: 'inline-block' }} />
                                    {t('Revenue')}
                                </span>
                            </div>
                        </div>

                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60ddc6" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#60ddc6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                                        tick={{ fill: 'var(--txt-3)', fontSize: 10 }} dy={8} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--txt-3)', fontSize: 10 }} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                                    <Area type="monotone" dataKey="orders" stroke="#818cf8" strokeWidth={1.5}
                                        fillOpacity={1} fill="url(#gOrders)" dot={false}
                                        activeDot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="spend" stroke="#60ddc6" strokeWidth={1.5}
                                        fillOpacity={1} fill="url(#gSpend)" dot={false}
                                        activeDot={{ r: 3, fill: '#60ddc6', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Action Center */}
                    <div className="card lg:col-span-5 p-5 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div>
                            <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Clinic Action Center')}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{t('Quick actions & initialization tools')}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            {actions.map(({ label, sub, icon: Icon, color, bg, href }) => (
                                <Link key={label} href={route(href as any)}
                                    className="flex flex-col items-start gap-2 p-3 rounded-xl border transition-all duration-200 group"
                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = `${color}40`;
                                        e.currentTarget.style.background = bg;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.background = 'var(--surface)';
                                    }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                        style={{ background: bg, color }}>
                                        <Icon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[11.5px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>{t(label)}</p>
                                        <p className="text-[9.5px] uppercase tracking-widest font-bold mt-0.5" style={{ color: 'var(--txt-3)' }}>{t(sub)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Alerts Row ────────────────────────────────────────── */}
                {stats.pending_orders > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                                <AlertTriangle size={15} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12px] font-bold truncate" style={{ color: '#f59e0b' }}>{t('Pending Orders')}</p>
                                <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
                                    {stats.pending_orders} {t('orders awaiting action')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
                                <Clock size={15} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12px] font-bold truncate" style={{ color: '#f87171' }}>{t('Due Soon')}</p>
                                <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
                                    {t('Review needed')} ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.2)' }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8' }}>
                                <Bell size={15} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12px] font-bold truncate" style={{ color: '#818cf8' }}>{t('Notifications')}</p>
                                <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>{t('Check your messages')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Active Operations Registry ─────────────────────────── */}
                <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div>
                            <p className="text-[13.5px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Active Operations Registry')}</p>
                        </div>
                        <Link href={route('clinic.orders.index')}
                            className="flex items-center gap-1.5 text-[11.5px] font-semibold transition-opacity hover:opacity-70"
                            style={{ color: '#60ddc6' }}>
                            {t('Network Registry')} <ExternalLink size={11} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('Order ID')}</th>
                                    <th>{t('Priority')}</th>
                                    <th>{t('Patient Name')}</th>
                                    <th className="hidden md:table-cell">{t('Service Type')}</th>
                                    <th className="hidden lg:table-cell">{t('Estimated Finish')}</th>
                                    <th>{t('Status')}</th>
                                    <th className="w-16" />
                                </tr>
                            </thead>
                            <tbody>
                                {recent_orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12" style={{ color: 'var(--txt-3)' }}>
                                            {t('No active processes')}
                                        </td>
                                    </tr>
                                ) : (
                                    recent_orders.map(order => {
                                        const pri = getPriority(order);
                                        return (
                                            <tr key={order.id}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                                <td>
                                                    <span className="font-bold tabular-nums" style={{ color: '#60ddc6' }}>
                                                        #{order.id}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-[10.5px] font-black uppercase px-2 py-0.5 rounded-md"
                                                        style={{ background: pri.bg, color: pri.color }}>
                                                        {pri.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-semibold text-[12.5px]" style={{ color: 'var(--txt-1)' }}>
                                                        {order.patient_name}
                                                    </span>
                                                </td>
                                                <td className="hidden md:table-cell">
                                                    <span className="text-[12px]" style={{ color: 'var(--txt-2)' }}>
                                                        {order.service_name}
                                                    </span>
                                                </td>
                                                <td className="hidden lg:table-cell">
                                                    <span className="text-[12px]" style={{ color: 'var(--txt-2)' }}>
                                                        {order.due_date ? fmtDate(order.due_date) : '—'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <StatusPill status={order.status} t={t} />
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
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
