import LabLayout from '@/Layouts/LabLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Bar,
} from 'recharts';
import {
    Package, DollarSign, TrendingUp, Clock, AlertTriangle,
    Users, Zap, ArrowUpRight, BarChart3, Activity,
} from 'lucide-react';
import DateRangeFilter from '@/Components/DateRangeFilter';
import useTranslation from '@/Hooks/useTranslation';

/* ════════════════════════════════════════════════════
   Types
════════════════════════════════════════════════════ */
interface TopService   { id: number; name: string; order_count: number; revenue: number; }
interface ClientBreakdown { id: number; name: string; order_count: number; revenue: number; }
interface MonthlyTrend { month: string; orders: number; revenue: number; }
interface Stats {
    statusCounts: Record<string, number>;
    totalRevenue: number; periodRevenue: number;
    chartData: { name: string; orders: number; revenue: number }[];
    topServices: TopService[];
    clientBreakdown: ClientBreakdown[];
    paymentBreakdown: Record<string, number>;
    paymentRevenueBreakdown: Record<string, number>;
    monthlyTrend: MonthlyTrend[];
    totalActive: number; overdueCount: number;
    avgTurnaroundDays: number; periodOrderCount: number;
}
interface Props extends PageProps { stats: Stats; filters: { start_date: string; end_date: string; }; }

/* ════════════════════════════════════════════════════
   Config
════════════════════════════════════════════════════ */
const STATUS_COLORS: Record<string, string> = {
    new: '#f59e0b', in_progress: '#60ddc6', fitting: '#818cf8',
    finished: '#34d399', shipped: '#6366f1', delivered: '#10b981',
    rejected: '#f87171', archived: '#94a3b8', cancelled: '#fca5a5',
};
const STATUS_LABELS: Record<string, string> = {
    new: 'New', in_progress: 'In Progress', fitting: 'Fitting',
    finished: 'Finished', shipped: 'Shipped', delivered: 'Delivered',
    rejected: 'Rejected', archived: 'Archived', cancelled: 'Cancelled',
};
const PAYMENT_COLORS: Record<string, string> = {
    paid: '#34d399', partial: '#f59e0b', unpaid: '#f87171',
};
const PAYMENT_LABELS: Record<string, string> = { paid: 'Paid', partial: 'Partial', unpaid: 'Unpaid' };

const BAR_COLORS = ['#60ddc6', '#818cf8', '#c084fc', '#34d399', '#f59e0b'];

/* ════════════════════════════════════════════════════
   Custom tooltip
════════════════════════════════════════════════════ */
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border px-4 py-3 shadow-xl text-[12px]"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', minWidth: 140 }}>
            <p className="font-bold mb-2" style={{ color: 'var(--txt-2)' }}>{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span style={{ color: 'var(--txt-3)' }}>{p.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: 'var(--txt-1)' }}>
                        {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue')
                            ? `+${p.value.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD`
                            : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* ════════════════════════════════════════════════════
   Card wrapper
════════════════════════════════════════════════════ */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`card p-6 ${className}`}>
            {children}
        </div>
    );
}

function CardHeader({ title, sub, icon, iconColor = 'var(--txt-accent)' }: {
    title: string; sub?: string; icon: React.ReactNode; iconColor?: string;
}) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--txt-1)' }}>{title}</h3>
                {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-accent)' }}>{sub}</p>}
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${iconColor}14`, color: iconColor }}>
                {icon}
            </div>
        </div>
    );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ opacity: 0.3 }}>
            {icon}
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                {label}
            </p>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   Main page
════════════════════════════════════════════════════ */
export default function Analytics({ stats, filters }: Props) {
    const { t } = useTranslation();

    const fmt = (v: number) =>
        v.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalOrders = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);

    const statusPieData = Object.entries(stats.statusCounts).map(([s, c]) => ({
        name: STATUS_LABELS[s] ?? s, value: c, color: STATUS_COLORS[s] ?? '#94a3b8',
    }));
    const paymentPieData = Object.entries(stats.paymentBreakdown).map(([s, c]) => ({
        name: PAYMENT_LABELS[s] ?? s, value: c, color: PAYMENT_COLORS[s] ?? '#94a3b8',
    }));
    const trendData = stats.monthlyTrend.map(m => ({
        ...m,
        label: new Date(m.month + '-01').toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
    }));

    /* KPI cards */
    const kpis = [
        {
            icon: <Package size={16} />,
            label: t('Period Orders'),
            value: stats.periodOrderCount,
            sub: `${totalOrders} ${t('total')}`,
            color: '#60ddc6',
        },
        {
            icon: <DollarSign size={16} />,
            label: t('Period Revenue'),
            value: `${fmt(stats.periodRevenue)} MAD`,
            sub: `${fmt(stats.totalRevenue)} MAD ${t('total')}`,
            color: '#34d399',
        },
        {
            icon: <Clock size={16} />,
            label: t('Avg. Turnaround'),
            value: `${stats.avgTurnaroundDays}d`,
            sub: t('days to deliver'),
            color: '#f59e0b',
        },
        {
            icon: <AlertTriangle size={16} />,
            label: t('Overdue'),
            value: stats.overdueCount,
            sub: `${stats.totalActive} ${t('active')}`,
            color: stats.overdueCount > 0 ? '#f87171' : '#34d399',
        },
    ];

    const gridStroke = 'var(--border)';
    const tickStyle = { fill: 'var(--txt-3)', fontSize: 10, fontWeight: 600 };

    return (
        <LabLayout>
            <Head title={t('Analytics')} />

            <div className="flex flex-col gap-6 pb-10">

                {/* ── Header ────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-widest mb-2"
                            style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)', border: '1px solid var(--teal-20)' }}>
                            <BarChart3 size={11} />
                            {t('Detailed Insights')}
                        </div>
                        <h1 className="text-[24px] font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('Analytics')}
                        </h1>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {t('Deep dive into your lab performance and metrics')}
                        </p>
                    </div>
                    <DateRangeFilter startDate={filters.start_date} endDate={filters.end_date} />
                </div>

                {/* ── KPI row ───────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((k, i) => (
                        <div key={i} className="card p-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200"
                            style={{ borderColor: `${k.color}30` }}>
                            {/* Glow blob */}
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.12] pointer-events-none"
                                style={{ background: k.color, filter: 'blur(20px)', transform: 'translate(30%,-30%)' }} />
                            {/* Icon */}
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: `${k.color}18`, color: k.color }}>
                                {k.icon}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>
                                {k.label}
                            </p>
                            <p className="text-[22px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>
                                {k.value}
                            </p>
                            <p className="text-[11px] mt-1.5" style={{ color: 'var(--txt-3)' }}>{k.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Main chart + Status pie ───────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Volume & Revenue */}
                    <Card className="lg:col-span-2">
                        <CardHeader title={t('Order Volume & Revenue')} sub={t('Daily Breakdown')}
                            icon={<TrendingUp size={15} />} />
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={stats.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#34d399" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60ddc6" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#60ddc6" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} strokeOpacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={tickStyle} dy={8} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={tickStyle} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false}
                                        tick={tickStyle} tickFormatter={v => `${v} DH`} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar yAxisId="left" dataKey="orders" name={t('Orders')}
                                        fill="url(#gradBar)" radius={[6, 6, 0, 0]} barSize={28} animationDuration={1200} />
                                    <Area yAxisId="right" type="monotone" dataKey="revenue" name={t('Revenue')}
                                        stroke="#34d399" strokeWidth={3} fill="url(#gradRev)" animationDuration={1600} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Status Pie */}
                    <Card>
                        <CardHeader title={t('Status Breakdown')} sub={t('Current Period')}
                            icon={<Activity size={15} />} />
                        {statusPieData.length > 0 ? (
                            <>
                                <div style={{ height: 180 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusPieData} cx="50%" cy="50%"
                                                outerRadius={80} innerRadius={38}
                                                dataKey="value" animationDuration={1000}
                                                labelLine={false}
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                    if ((percent ?? 0) < 0.06) return null;
                                                    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                                                    const rad = Math.PI / 180;
                                                    const x = cx + r * Math.cos(-midAngle! * rad);
                                                    const y = cy + r * Math.sin(-midAngle! * rad);
                                                    return (
                                                        <text x={x} y={y} fill="white" textAnchor="middle"
                                                            dominantBaseline="central" fontSize={9} fontWeight={800}>
                                                            {`${((percent ?? 0) * 100).toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}>
                                                {statusPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col gap-2 mt-2 max-h-44 overflow-y-auto">
                                    {statusPieData.map(s => (
                                        <div key={s.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                                                <span className="text-[11px] font-medium" style={{ color: 'var(--txt-2)' }}>{s.name}</span>
                                            </div>
                                            <span className="text-[12px] font-bold" style={{ color: 'var(--txt-1)' }}>{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState icon={<Package size={32} />} label={t('No data')} />
                        )}
                    </Card>
                </div>

                {/* ── Top Services + Client Breakdown ──────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Top Services */}
                    <Card>
                        <CardHeader title={t('Top Services')} sub={t('By order volume')}
                            icon={<Zap size={15} />} iconColor="#f59e0b" />
                        {stats.topServices.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.topServices.map((svc, idx) => {
                                    const maxCount = Math.max(...stats.topServices.map(s => s.order_count), 1);
                                    const pct = (svc.order_count / maxCount) * 100;
                                    const color = BAR_COLORS[idx % BAR_COLORS.length];
                                    return (
                                        <div key={svc.id}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black"
                                                        style={{ background: `${color}18`, color }}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-[12px] font-semibold truncate"
                                                        style={{ color: 'var(--txt-1)' }}>{svc.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                                        {svc.order_count} {t('orders')}
                                                    </span>
                                                    <span className="text-[11px] font-bold" style={{ color }}>
                                                        {fmt(svc.revenue)} MAD
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full overflow-hidden"
                                                style={{ background: 'var(--surface)' }}>
                                                <div className="h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${pct}%`, background: color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyState icon={<Zap size={32} />} label={t('No services data')} />
                        )}
                    </Card>

                    {/* Client Breakdown */}
                    <Card>
                        <CardHeader title={t('Client Breakdown')} sub={t('Orders by clinic')}
                            icon={<Users size={15} />} iconColor="#818cf8" />
                        {stats.clientBreakdown.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                                            {[t('Clinic'), t('Orders'), t('Revenue')].map((th, i) => (
                                                <th key={i} className={`pb-3 text-[10.5px] font-bold uppercase tracking-wider ${i > 0 ? 'text-right' : ''}`}
                                                    style={{ color: 'var(--txt-3)' }}>{th}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.clientBreakdown.map(client => (
                                            <tr key={client.id} className="border-b last:border-0 transition-colors"
                                                style={{ borderColor: 'var(--border)' }}>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-black text-white"
                                                            style={{ background: 'linear-gradient(135deg,#818cf8,#60ddc6)' }}>
                                                            {client.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-[12px] font-semibold truncate max-w-[150px]"
                                                            style={{ color: 'var(--txt-1)' }}>
                                                            {client.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                                        {client.order_count}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-[12px] font-bold" style={{ color: '#34d399' }}>
                                                        {fmt(client.revenue)} MAD
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState icon={<Users size={32} />} label={t('No client data')} />
                        )}
                    </Card>
                </div>

                {/* ── Payment Status + 6-Month Trend ───────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Payment Status */}
                    <Card>
                        <CardHeader title={t('Payment Status')} sub={t('Collection overview')}
                            icon={<DollarSign size={15} />} iconColor="#34d399" />
                        {paymentPieData.length > 0 ? (
                            <div className="flex items-center gap-6">
                                <div style={{ width: 160, height: 160, flexShrink: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={paymentPieData} cx="50%" cy="50%" outerRadius={72} innerRadius={36}
                                                dataKey="value" animationDuration={1000} labelLine={false}
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                    if ((percent ?? 0) < 0.08) return null;
                                                    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                                                    const rad = Math.PI / 180;
                                                    const x = cx + r * Math.cos(-midAngle! * rad);
                                                    const y = cy + r * Math.sin(-midAngle! * rad);
                                                    return (
                                                        <text x={x} y={y} fill="white" textAnchor="middle"
                                                            dominantBaseline="central" fontSize={9} fontWeight={800}>
                                                            {`${((percent ?? 0) * 100).toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}>
                                                {paymentPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 flex flex-col gap-4">
                                    {paymentPieData.map(p => (
                                        <div key={p.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                                                    <span className="text-[12px] font-semibold" style={{ color: 'var(--txt-2)' }}>
                                                        {p.name}
                                                    </span>
                                                </div>
                                                <span className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                                    {p.value}
                                                </span>
                                            </div>
                                            <p className="text-[11px] pl-4" style={{ color: 'var(--txt-3)' }}>
                                                {fmt(stats.paymentRevenueBreakdown[p.name.toLowerCase()] ?? 0)} MAD
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <EmptyState icon={<DollarSign size={32} />} label={t('No payment data')} />
                        )}
                    </Card>

                    {/* Monthly Trend */}
                    <Card>
                        <CardHeader title={t('6-Month Trend')} sub={t('Growth trajectory')}
                            icon={<ArrowUpRight size={15} />} iconColor="#c084fc" />
                        {trendData.length > 0 ? (
                            <div style={{ height: 210 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradOrders" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#60ddc6" />
                                                <stop offset="100%" stopColor="#818cf8" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} strokeOpacity={0.5} />
                                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tickStyle} />
                                        <YAxis axisLine={false} tickLine={false} tick={tickStyle} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Line type="monotone" dataKey="orders" name={t('Orders')} stroke="#60ddc6"
                                            strokeWidth={3} dot={{ r: 4, fill: '#60ddc6', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }} animationDuration={1500} />
                                        <Line type="monotone" dataKey="revenue" name={t('Revenue')} stroke="#c084fc"
                                            strokeWidth={3} dot={{ r: 4, fill: '#c084fc', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }} animationDuration={1800} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState icon={<TrendingUp size={32} />} label={t('No trend data')} />
                        )}
                    </Card>
                </div>

            </div>
        </LabLayout>
    );
}
