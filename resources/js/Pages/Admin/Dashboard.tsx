import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Users,
    Building2,
    Activity,
    Search,
    DollarSign,
    Package,
    BarChart3,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useTranslation from '@/Hooks/useTranslation';

interface Stats {
    total_users: number;
    total_clinics: number;
    total_labs: number;
    total_orders: number;
    total_revenue: number;
    mrr: number;
    growths: {
        revenue: number;
        mrr: number;
        labs_clinics: number;
        orders: number;
    };
}

interface OrderTrend {
    date: string;
    orders: number;
}

interface MiniUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    clinic?: { name: string };
    lab?: { name: string };
}

interface MiniOrder {
    id: number;
    status: string;
    price: number;
    created_at: string;
    clinic: { name: string };
    lab: { name: string };
    patient: { first_name: string, last_name: string };
}

interface Props extends PageProps {
    stats: Stats;
    orderVolumeTrend: OrderTrend[];
    recentUsers: MiniUser[];
    recentOrders: MiniOrder[];
}

// ── Helpers ───────────────────────────────────────────────────
const formatValue = (v: number) => new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(v);

// ── Chart tooltip ─────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-3 py-2 text-[12px]">
            <p style={{ color: 'var(--txt-2)' }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} className="font-semibold mt-0.5" style={{ color: 'var(--txt-accent)' }}>
                    {p.value} orders
                </p>
            ))}
        </div>
    );
};

export default function Dashboard({ auth, stats, orderVolumeTrend, recentUsers, recentOrders }: Props) {
    const { t } = useTranslation();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const renderUserRole = (role: string) => {
        const getRoleColors = (r: string) => {
            switch(r) {
                case 'super_admin': return { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', text: '#c084fc' };
                case 'dentist': return { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)', text: '#38bdf8' };
                case 'lab_owner': return { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', text: '#34d399' };
                case 'lab_tech': return { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24' };
                case 'clinic_staff': return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8' };
                default: return { bg: 'var(--surface)', border: 'var(--border)', text: 'var(--txt-1)' };
            }
        };
        const colors = getRoleColors(role);
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
                {t(role.replace('_', ' '))}
            </span>
        );
    };

    return (
        <AdminLayout header={t('Dashboard')}>
            <Head title={t('Admin Dashboard')} />

            <div className="flex flex-col gap-6 pb-12">

                {/* ── Welcome Banner ─────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t(greeting)}, <span style={{ color: 'var(--txt-accent)' }}>{auth.user.name.split(' ')[0]}</span> 👋
                        </h2>
                        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--txt-2)' }}>
                            {t('Platform control center active.')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('admin.system-logs.index')} className="btn-ghost text-[12px]">
                            {t('System Status')} <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* ── KPI Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Revenue */}
                    <div className="card p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Total Revenue')}</p>
                            <DollarSign size={14} style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <div className="flex items-end justify-between gap-2 mt-1">
                            <p className="text-[24px] font-semibold tabular-nums" style={{ color: 'var(--txt-1)' }}>
                                {formatValue(stats.total_revenue)}<span className="text-[12px] opacity-40 ml-1">MAD</span>
                            </p>
                            <div className="flex items-center gap-1 text-[11px] font-semibold mb-1"
                                style={{ color: stats.growths.revenue >= 0 ? '#60ddc6' : '#f87171' }}>
                                {stats.growths.revenue >= 0 ? '+' : ''}{stats.growths.revenue}%
                            </div>
                        </div>
                    </div>

                    {/* Monthly Active (MRR) */}
                    <div className="card p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Monthly Active')}</p>
                            <BarChart3 size={14} style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <div className="flex items-end justify-between gap-2 mt-1">
                            <p className="text-[24px] font-semibold tabular-nums" style={{ color: 'var(--txt-1)' }}>
                                {formatValue(stats.mrr)}<span className="text-[12px] opacity-40 ml-1">MAD</span>
                            </p>
                            <div className="flex items-center gap-1 text-[11px] font-semibold mb-1"
                                style={{ color: stats.growths.mrr >= 0 ? '#60ddc6' : '#f87171' }}>
                                {stats.growths.mrr >= 0 ? '+' : ''}{stats.growths.mrr}%
                            </div>
                        </div>
                    </div>

                    {/* Labs / Clinics */}
                    <div className="card p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Labs / Clinics')}</p>
                            <Building2 size={14} style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <div className="flex items-end justify-between gap-2 mt-1">
                            <p className="text-[24px] font-semibold tabular-nums" style={{ color: 'var(--txt-1)' }}>
                                {stats.total_labs} <span className="opacity-40 text-lg mx-1">/</span> {stats.total_clinics}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] font-semibold mb-1"
                                style={{ color: stats.growths.labs_clinics >= 0 ? '#60ddc6' : '#f87171' }}>
                                {stats.growths.labs_clinics >= 0 ? '+' : ''}{stats.growths.labs_clinics}
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="card p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Total Orders')}</p>
                            <Package size={14} style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <div className="flex items-end justify-between gap-2 mt-1">
                            <p className="text-[24px] font-semibold tabular-nums" style={{ color: 'var(--txt-1)' }}>
                                {stats.total_orders}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] font-semibold mb-1"
                                style={{ color: stats.growths.orders >= 0 ? '#60ddc6' : '#f87171' }}>
                                {stats.growths.orders >= 0 ? '+' : ''}{stats.growths.orders}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Charts & Lists ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* Trend Chart */}
                    <div className="card lg:col-span-8 p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                    {t('Order Volume Trend')}
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                    {t('30 Day Activity Analytics')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: '#60ddc6', color: '#0d1f1a' }}>DAILY</button>
                                <button className="px-3 py-1 text-[10px] font-bold text-[var(--txt-3)] hover:text-[var(--txt-1)] transition-colors">WEEKLY</button>
                            </div>
                        </div>

                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={orderVolumeTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60ddc6" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="#60ddc6" stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={1} strokeDasharray="0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--txt-3)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--txt-3)', fontSize: 11 }} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(96,221,198,0.05)', strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="orders" stroke="#60ddc6" strokeWidth={1.5} fillOpacity={1} fill="url(#g1)"
                                          dot={false} activeDot={{ r: 3, fill: '#60ddc6', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card lg:col-span-4 p-5 flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Activity size={16} />
                                <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                    {t('Quick Actions')}
                                </p>
                            </div>
                            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                                {t('Instantly jump to the most common actions across the administration panel.')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 mt-auto">
                            <Link href={route('admin.tickets.index')} className="group flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-[var(--surface-hover)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <Activity size={14} style={{ color: 'var(--txt-3)' }} />
                                    <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--txt-1)]" style={{ color: 'var(--txt-2)' }}>{t('Resolve Tickets')}</span>
                                </div>
                            </Link>
                            <Link href={route('admin.announcements.index')} className="group flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-[var(--surface-hover)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <Activity size={14} style={{ color: 'var(--txt-3)' }} />
                                    <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--txt-1)]" style={{ color: 'var(--txt-2)' }}>{t('Global Broadcast')}</span>
                                </div>
                            </Link>
                            <Link href={route('admin.system-logs.index')} className="group flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-[var(--surface-hover)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <Activity size={14} style={{ color: 'var(--txt-3)' }} />
                                    <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--txt-1)]" style={{ color: 'var(--txt-2)' }}>{t('View Audit Logs')}</span>
                                </div>
                            </Link>
                            <Link href={route('admin.users.index')} className="group flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-[var(--surface-hover)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <Users size={14} style={{ color: 'var(--txt-3)' }} />
                                    <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--txt-1)]" style={{ color: 'var(--txt-2)' }}>{t('Manage Users')}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New Registrations */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('New Registrations')}</p>
                        <Link href={route('admin.users.index')} className="text-[11px] hover:underline" style={{ color: 'var(--txt-3)' }}>
                            {t('View All')}
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('User')}</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Role')}</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Organization')}</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60 text-right" style={{ color: 'var(--txt-2)' }}>{t('Status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.slice(0, 5).map((u) => (
                                    <tr key={u.id} className="group border-b last:border-0 transition-colors hover:bg-[var(--surface-hover)]" style={{ borderColor: 'var(--border)' }}>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-3 items-center">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-[11px] shrink-0 text-white" style={{ background: '#34d399', color: '#0d1f1a' }}>
                                                    {u.name.substring(0,2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-semibold leading-tight mb-0.5" style={{ color: 'var(--txt-1)' }}>{u.name}</p>
                                                    <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {renderUserRole(u.role)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-[12px] font-medium truncate max-w-[180px]" style={{ color: 'var(--txt-2)' }}>
                                                {u.clinic?.name || u.lab?.name || '—'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                                                style={{
                                                    background: u.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(244,63,94,0.1)',
                                                    borderColor: u.is_active ? 'rgba(52,211,153,0.25)' : 'rgba(244,63,94,0.25)',
                                                    color: u.is_active ? '#34d399' : '#f43f5e',
                                                }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                                                {u.is_active ? t('Active') : t('Suspended')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
