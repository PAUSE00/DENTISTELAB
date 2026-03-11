import LabLayout from '@/Layouts/LabLayout';
import { Head } from '@inertiajs/react';
import { TrendingUp, DollarSign, Package, Users, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface KPI {
    totalOrders: number; totalRevenue: number;
    thisMonth: number;   thisMonthRev: number;
    overdueCount: number; avgTurnaround: number;
}

interface Props {
    monthlyRevenue: { month: string; orders: number; revenue: number }[];
    topServices: { name: string; order_count: number; revenue: number; avg_price: number }[];
    topClients: { name: string; order_count: number; revenue: number }[];
    turnaround: { month: string; avg_days: number; count: number }[];
    statusDist: Record<string, number>;
    kpi: KPI;
}

const fmt = (n: number) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(n);

const CHART_COLORS = ['#60ddc6', '#818cf8', '#c084fc', '#f59e0b', '#34d399', '#f87171', '#94a3b8', '#38bdf8'];

function KpiCard({ icon: Icon, label, value, sub, color }: { icon: typeof TrendingUp; label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}18`, color }}>
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{label}</p>
                <p className="text-[16px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>{value}</p>
                {sub && <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{sub}</p>}
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-[12px] shadow-lg"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--txt-1)' }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }}>
                    {p.name}: {p.name === 'revenue' ? fmt(p.value) : p.value}
                </p>
            ))}
        </div>
    );
};

export default function Reports({ monthlyRevenue, topServices, topClients, turnaround, statusDist, kpi }: Props) {
    const { t } = useTranslation();

    const kpiCards = [
        { icon: DollarSign,    label: t('Total Revenue'),    value: fmt(kpi.totalRevenue),  color: '#34d399' },
        { icon: TrendingUp,    label: t('This Month Rev.'),  value: fmt(kpi.thisMonthRev),  color: 'var(--txt-accent)', sub: `${kpi.thisMonth} orders` },
        { icon: Package,       label: t('Total Orders'),     value: kpi.totalOrders,        color: '#818cf8' },
        { icon: Clock,         label: t('Avg Turnaround'),   value: `${kpi.avgTurnaround}d`, color: '#c084fc', sub: t('to delivery') },
        { icon: AlertTriangle, label: t('Overdue'),          value: kpi.overdueCount,       color: '#f87171' },
        { icon: Users,         label: t('Clients'),          value: topClients.length,      color: '#f59e0b' },
    ];

    const maxService = Math.max(...topServices.map(s => s.order_count), 1);
    const maxClient = Math.max(...topClients.map(c => c.order_count), 1);

    return (
        <LabLayout>
            <Head title={t('Reports')} />
            <div className="flex flex-col gap-5">

                {/* Header */}
                <div>
                    <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Reports')}</h2>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{t('All-time business insights')}</p>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {kpiCards.map(c => <KpiCard key={c.label} {...c} />)}
                </div>

                {/* Revenue + Orders chart */}
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} style={{ color: 'var(--txt-accent)' }} />
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Revenue & Orders — Last 12 Months')}</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60ddc6" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#60ddc6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fill: 'var(--txt-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="rev" orientation="right" tick={{ fill: 'var(--txt-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <YAxis yAxisId="ord" tick={{ fill: 'var(--txt-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="revenue" stroke="#60ddc6" strokeWidth={2} fill="url(#gRev)" dot={false} />
                            <Area yAxisId="ord" type="monotone" dataKey="orders" name="orders" stroke="#818cf8" strokeWidth={2} fill="url(#gOrd)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-1">
                        {[{ c: '#60ddc6', l: t('Revenue (MAD)') }, { c: '#818cf8', l: t('Orders') }].map(x => (
                            <div key={x.l} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-0.5 rounded-full" style={{ background: x.c }} />
                                <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{x.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Top services */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Package size={14} style={{ color: '#818cf8' }} />
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Top Services')}</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {topServices.map((s, i) => (
                                <div key={s.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{s.name}</span>
                                        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                            <span>{s.order_count} orders</span>
                                            <span style={{ color: 'var(--txt-accent)' }}>{fmt(s.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface)' }}>
                                        <div className="h-full rounded-full transition-all"
                                            style={{ width: `${(s.order_count / maxService) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top clients */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={14} style={{ color: '#f59e0b' }} />
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Top Clients')}</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {topClients.map((c, i) => (
                                <div key={c.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{c.name}</span>
                                        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                            <span>{c.order_count} orders</span>
                                            <span style={{ color: '#f59e0b' }}>{fmt(c.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface)' }}>
                                        <div className="h-full rounded-full transition-all"
                                            style={{ width: `${(c.order_count / maxClient) * 100}%`, background: CHART_COLORS[(i + 3) % CHART_COLORS.length] }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Avg Turnaround */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={14} style={{ color: '#c084fc' }} />
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Avg Turnaround (days)')}</p>
                        </div>
                        {turnaround.length > 0 ? (
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={turnaround} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: 'var(--txt-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'var(--txt-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="avg_days" name="avg days" radius={[4, 4, 0, 0]}>
                                        {turnaround.map((_, i) => <Cell key={i} fill="#c084fc" />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center py-8 text-[12px]" style={{ color: 'var(--txt-3)' }}>No delivered orders yet</p>
                        )}
                    </div>

                    {/* Status distribution */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 size={14} style={{ color: '#34d399' }} />
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Status Distribution')}</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {Object.entries(statusDist).sort((a, b) => b[1] - a[1]).map(([status, count], i) => {
                                const total = Object.values(statusDist).reduce((a, b) => a + b, 0) || 1;
                                return (
                                    <div key={status}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[12px] capitalize font-medium" style={{ color: 'var(--txt-2)' }}>
                                                {status.replace('_', ' ')}
                                            </span>
                                            <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                                <span>{count}</span>
                                                <span>{((count / total) * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full" style={{ background: 'var(--surface)' }}>
                                            <div className="h-full rounded-full"
                                                style={{ width: `${(count / total) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}
