import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Order } from '@/types';
import {
 Package, Clock, AlertTriangle, CalendarClock, DollarSign,
 CreditCard, CheckCircle2, XCircle, TrendingUp, TrendingDown,
 ArrowRight, MoreHorizontal, ExternalLink, CalendarDays, MessageSquare, Kanban
} from 'lucide-react';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { router } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
 totalActive: number;
 pendingNew: number;
 overdueCount: number;
 dueTodayCount: number;
 monthRevenue: number;
 lastMonthRevenue?: number;
 unpaidCount?: number;
}
interface InboxOrder {
 id: number; priority: string; created_at: string; due_date: string | null;
 patient: { first_name: string; last_name: string } | null;
 clinic: { name: string } | null;
 service: { name: string } | null;
}
interface WeeklyDay { day: string; date: string; orders: number; }
interface TopService { name: string; count: number; }
interface ActivityEntry { order_id: number; status: string; clinic: string; at: string; }
interface Props extends PageProps {
 stats: Stats;
 recentOrders: Order[];
 newOrdersInbox?: InboxOrder[];
 weeklyVolume?: WeeklyDay[];
 topServices?: TopService[];
 activityFeed?: ActivityEntry[];
}

// ── Status config (restrained — no opacity theatrics) ──────────────────────
const STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
 new: { label: 'New', dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.1)' },
 in_progress: { label: 'In Progress', dot: '#818cf8', text: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
 fitting: { label: 'Fitting', dot: '#c084fc', text: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
 finished: { label: 'Finished', dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.1)' },
 shipped: { label: 'Shipped', dot: '#60ddc6', text: '#60ddc6', bg: 'rgba(96,221,198,0.1)' },
 delivered: { label: 'Delivered', dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.1)' },
 rejected: { label: 'Rejected', dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)' },
 archived: { label: 'Archived', dot: '#94a3b8', text: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
 cancelled: { label: 'Cancelled', dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

const StatusPill = ({ status }: { status: string }) => {
 const { t } = useTranslation();
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
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

// ── Tooltip for chart ──────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
 if (!active || !payload?.length) return null;
 return (
 <div className="card px-3 py-2 text-[12px]">
 <p style={{ color: 'var(--txt-2)' }}>{label}</p>
 <p className="font-semibold mt-0.5" style={{ color: 'var(--txt-accent)' }}>
 {payload[0].value} orders
 </p>
 </div>
 );
};

// ── Component ──────────────────────────────────────────────────────────────
export default function Dashboard({
 auth, stats, recentOrders,
 newOrdersInbox = [], weeklyVolume = [],
 topServices = [], activityFeed = [],
}: Props) {
 const { t } = useTranslation();

 useEffect(() => {
 if (window.Echo) {
 window.Echo.private(`lab.${auth.user.lab_id}`)
 .listen('.order.submitted', () => {
 router.reload({ only: ['stats', 'recentOrders', 'newOrdersInbox'] });
 });
 }
 return () => { if (window.Echo) window.Echo.leave(`lab.${auth.user.lab_id}`); };
 }, [auth.user.lab_id]);

 const updateStatus = (orderId: number, status: string) => {
 router.patch(route('lab.orders.update-status', orderId), { status }, { preserveScroll: true });
 };

 const hour = new Date().getHours();
 const greeting = hour < 12 ? t('Good morning') : hour < 18 ? t('Good afternoon') : t('Good evening');

 const revChange = (stats.lastMonthRevenue ?? 0) > 0
 ? Math.round(((stats.monthRevenue - (stats.lastMonthRevenue ?? 0)) / (stats.lastMonthRevenue ?? 1)) * 100)
 : null;

 const maxService = topServices[0]?.count || 1;

 return (
 <LabLayout>
 <Head title="Lab Dashboard" />

 <div className="flex flex-col gap-5">

 {/* ── Greeting ──────────────────────────────────────────── */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {greeting}, <span style={{ color: 'var(--txt-accent)' }}>{auth.user.name}</span> 👋
 </h2>
 <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--txt-2)' }}>
 {t('Laboratory')} · {t('Command Center')}
 {stats.overdueCount > 0 && (
 <> · <span style={{ color: '#f87171' }}>{stats.overdueCount} {t('overdue')}</span></>
 )}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Link href={route('lab.orders.index')} className="btn-ghost text-[12px]">
 {t('All Orders')} <ArrowRight size={13} />
 </Link>
 {stats.overdueCount > 0 && (
 <Link href={route('lab.orders.index')} className="btn-primary text-[12px]">
 {stats.overdueCount} {t('overdue')}
 </Link>
 )}
 </div>
 </div>

 {/* ── Stat row ──────────────────────────────────────────── */}
 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
 {([
 { Icon: Package, label: t('Active'), value: stats.totalActive, accent: undefined },
 { Icon: Clock, label: t('Pending'), value: stats.pendingNew, accent: undefined },
 { Icon: AlertTriangle, label: t('Overdue'), value: stats.overdueCount, accent: '#f87171' },
 { Icon: CalendarClock, label: t('Due Today'), value: stats.dueTodayCount, accent: undefined },
 ] as { Icon: React.ElementType; label: string; value: number; accent?: string }[]).map((s, i) => (
 <div key={i} className="card p-4 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{s.label}</p>
 <s.Icon size={14} style={{ color: s.accent ?? 'var(--txt-3)' }} />
 </div>
 <p className="stat-value" style={{ color: s.accent ?? 'var(--txt-1)' }}>
 {s.value}
 </p>
 </div>
 ))}

 {/* Revenue */}
 <div className="card p-4 flex flex-col gap-3 xl:col-span-2">
 <div className="flex items-center justify-between">
 <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Month Revenue')}</p>
 <DollarSign size={14} style={{ color: 'var(--txt-3)' }} />
 </div>
 <div className="flex items-end justify-between gap-2">
 <p className="stat-value text-[22px]">{fmtCurrency(stats.monthRevenue)}</p>
 {revChange !== null && (
 <div className="flex items-center gap-1 text-[11px] font-semibold mb-0.5"
 style={{ color: revChange >= 0 ? '#60ddc6' : '#f87171' }}>
 {revChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
 {Math.abs(revChange)}%
 </div>
 )}
 </div>
 {stats.unpaidCount !== undefined && (
 <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
 <span style={{ color: '#f59e0b' }}>{stats.unpaidCount}</span> {t('unpaid orders')}
 </p>
 )}
 </div>
 </div>

 {/* ── Middle row ────────────────────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

 {/* Chart */}
 <div className="card lg:col-span-5 p-4 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('Weekly Order Volume')}
 </p>
 <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {t('Orders received per day')}
 </p>
 </div>
 </div>
 <div style={{ height: 160 }}>
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={weeklyVolume} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
 <defs>
 <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#60ddc6" stopOpacity={0.25} />
 <stop offset="100%" stopColor="#60ddc6" stopOpacity={0.01} />
 </linearGradient>
 </defs>
 <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
 <XAxis dataKey="day" axisLine={false} tickLine={false}
 tick={{ fill: 'var(--txt-3)', fontSize: 11 }} />
 <YAxis axisLine={false} tickLine={false}
 tick={{ fill: 'var(--txt-3)', fontSize: 11 }} />
 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
 <Area type="monotone" dataKey="orders"
 stroke="#60ddc6" strokeWidth={1.5}
 fillOpacity={1} fill="url(#g1)"
 dot={false} activeDot={{ r: 3, fill: '#60ddc6', strokeWidth: 0 }} />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* New Orders Inbox */}
 <div className="card lg:col-span-4 flex flex-col overflow-hidden">
 <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('New Orders')}
 </p>
 <span className="status-pill" style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)', fontSize: '11px' }}>
 {newOrdersInbox.length} {t('pending')}
 </span>
 </div>
 <div className="flex-1 overflow-y-auto no-scrollbar" style={{ maxHeight: 220 }}>
 {newOrdersInbox.length === 0 ? (
 <div className="flex items-center justify-center h-full text-[12px] py-8"
 style={{ color: 'var(--txt-3)' }}>
 {t('All caught up')} ✓
 </div>
 ) : newOrdersInbox.map(o => (
 <div key={o.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-[var(--surface)] transition-colors"
 style={{ borderColor: 'var(--border)' }}>
 <div className="flex-1 min-w-0">
 <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--txt-1)' }}>
 <span style={{ color: 'var(--txt-accent)' }}>#{o.id}</span>&nbsp;
 {o.patient ? `${o.patient.first_name} ${o.patient.last_name}` : '—'}
 </p>
 <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {o.clinic?.name} · {o.due_date ? fmtDate(o.due_date) : '—'}
 </p>
 </div>
 <div className="flex gap-1.5 shrink-0">
 <button onClick={() => updateStatus(o.id, 'in_progress')}
 className="p-1.5 rounded-md transition-colors"
 style={{ background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }}
 title="Accept">
 <CheckCircle2 size={13} />
 </button>
 <button onClick={() => updateStatus(o.id, 'rejected')}
 className="p-1.5 rounded-md transition-colors"
 style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}
 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--txt-3)'; }}
 title="Reject">
 <XCircle size={13} />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Activity feed */}
 <div className="card lg:col-span-3 flex flex-col overflow-hidden">
 <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Activity')}</p>
 </div>
 <div className="flex-1 overflow-y-auto no-scrollbar" style={{ maxHeight: 220 }}>
 {activityFeed.length === 0 ? (
 <div className="flex items-center justify-center h-full text-[12px] py-8"
 style={{ color: 'var(--txt-3)' }}>{t('No recent activity')}</div>
 ) : activityFeed.slice(0, 8).map((a, i) => (
 <div key={i} className="flex gap-3 px-4 py-2.5 border-b last:border-0"
 style={{ borderColor: 'var(--border)' }}>
 <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
 style={{ background: STATUS[a.status]?.dot ?? '#60ddc6' }} />
 <div className="min-w-0">
 <p className="text-[12.5px] font-medium" style={{ color: 'var(--txt-1)' }}>
 #{a.order_id}
 <span className="ml-1.5 font-normal" style={{ color: 'var(--txt-2)' }}>
 {t(STATUS[a.status]?.label)}
 </span>
 </p>
 <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {a.clinic} · {a.at}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ── Bottom row ────────────────────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

 {/* Quick Actions */}
 <div className="card lg:col-span-4 p-5 flex flex-col gap-4">
 <div className="flex flex-col gap-1">
 <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('Quick Actions')}
 </p>
 <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
 {t('Frequently used tools and shortcuts')}
 </p>
 </div>
 
 <div className="grid grid-cols-2 gap-3 mt-1">
 {/* Schedule */}
 <Link href={route('lab.calendar.index')} className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-dashed transition-all hover:border-solid group" style={{ borderColor: 'var(--border-strong)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
 <div className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>
 <CalendarDays size={15} />
 </div>
 <div className="mt-1">
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Schedule')}</p>
 <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>{t('View daily tasks')}</p>
 </div>
 </Link>

 {/* Messages */}
 <Link href={route('lab.inbox.index')} className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-dashed transition-all hover:border-solid group" style={{ borderColor: 'var(--border-strong)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
 <div className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>
 <MessageSquare size={15} />
 </div>
 <div className="mt-1">
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Messages')}</p>
 <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>{t('Reply to clinics')}</p>
 </div>
 </Link>

 {/* Kanban Board */}
 <Link href={route('lab.kanban.index')} className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-dashed transition-all hover:border-solid group" style={{ borderColor: 'var(--border-strong)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
 <div className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }}>
 <Kanban size={15} />
 </div>
 <div className="mt-1">
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Production')}</p>
 <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>{t('Manage board')}</p>
 </div>
 </Link>

 {/* Service Catalog */}
 <Link href={route('lab.services.index')} className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-dashed transition-all hover:border-solid group" style={{ borderColor: 'var(--border-strong)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
 <div className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
 <Package size={15} />
 </div>
 <div className="mt-1">
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Catalog')}</p>
 <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>{t('Update services')}</p>
 </div>
 </Link>
 </div>
 </div>

 {/* Orders table */}
 <div className="card lg:col-span-8 overflow-hidden">
 <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Recent Orders')}</p>
 <Link href={route('lab.orders.index')}
 className="flex items-center gap-1.5 text-[11.5px] font-medium transition-colors hover:opacity-80"
 style={{ color: 'var(--txt-accent)' }}>
 {t('View all')} <ExternalLink size={11} />
 </Link>
 </div>
 <div className="table-responsive hide-scrollbar">
 <table className="data-table">
 <thead>
 <tr>
 <th>#</th>
 <th>{t('Patient')}</th>
 <th className="hidden md:table-cell">{t('Service')}</th>
 <th className="hidden lg:table-cell">{t('Clinic')}</th>
 <th>{t('Status')}</th>
 <th className="hidden sm:table-cell">{t('Due')}</th>
 <th>{t('Priority')}</th>
 </tr>
 </thead>
 <tbody>
 {recentOrders.map(o => (
 <tr key={o.id}>
 <td>
 <span className="font-semibold tabular-nums" style={{ color: 'var(--txt-accent)' }}>
 #{o.id}
 </span>
 </td>
 <td>
 <span className="font-medium">
 {o.patient ? `${o.patient.first_name} ${o.patient.last_name}` : '—'}
 </span>
 </td>
 <td className="hidden md:table-cell">
 <span style={{ color: 'var(--txt-2)' }}>{o.service?.name || '—'}</span>
 </td>
 <td className="hidden lg:table-cell">
 <span style={{ color: 'var(--txt-2)' }}>{o.clinic?.name || '—'}</span>
 </td>
 <td>
 <StatusPill status={o.status as string} />
 </td>
 <td className="hidden sm:table-cell">
 <span style={{ color: (o as any).is_overdue ? '#f87171' : 'var(--txt-2)' }}>
 {o.due_date ? fmtDate(o.due_date as string) : '—'}
 </span>
 </td>
 <td>
 <span className="priority-chip"
 style={o.priority === 'urgent'
 ? { background: 'rgba(249,115,22,0.12)', color: '#f97316' }
 : { background: 'var(--surface)', color: 'var(--txt-3)' }}>
 {t(o.priority || 'normal')}
 </span>
 </td>
 </tr>
 ))}
 {recentOrders.length === 0 && (
 <tr>
 <td colSpan={7} className="text-center py-10" style={{ color: 'var(--txt-3)' }}>
 {t('No orders yet')}
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 </LabLayout>
 );
}
