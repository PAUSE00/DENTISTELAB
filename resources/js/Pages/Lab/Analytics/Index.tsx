import LabLayout from '@/Layouts/LabLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    BarChart,
    Bar,
    Area,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import {
    Activity,
    DollarSign,
    TrendingUp,
    Package,
    Clock,
    AlertTriangle,
    Users,
    Zap,
    ArrowUpRight,
    BarChart3,
} from 'lucide-react';
import DateRangeFilter from '@/Components/DateRangeFilter';
import CustomTooltip from '@/Components/CustomTooltip';
import useTranslation from '@/Hooks/useTranslation';

interface TopService {
    id: number;
    name: string;
    order_count: number;
    revenue: number;
}

interface ClientBreakdown {
    id: number;
    name: string;
    order_count: number;
    revenue: number;
}

interface MonthlyTrend {
    month: string;
    orders: number;
    revenue: number;
}

interface Stats {
    statusCounts: Record<string, number>;
    totalRevenue: number;
    periodRevenue: number;
    chartData: { name: string; orders: number; revenue: number }[];
    topServices: TopService[];
    clientBreakdown: ClientBreakdown[];
    paymentBreakdown: Record<string, number>;
    paymentRevenueBreakdown: Record<string, number>;
    monthlyTrend: MonthlyTrend[];
    totalActive: number;
    overdueCount: number;
    avgTurnaroundDays: number;
    periodOrderCount: number;
}

interface Props extends PageProps {
    stats: Stats;
    filters: {
        start_date: string;
        end_date: string;
    };
}

const statusColors: Record<string, string> = {
    new: '#F59E0B',
    in_progress: '#3B82F6',
    fitting: '#8B5CF6',
    finished: '#10B981',
    shipped: '#6366F1',
    delivered: '#22C55E',
    rejected: '#EF4444',
    archived: '#94A3B8',
    cancelled: '#F87171',
};

const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    fitting: 'Fitting',
    finished: 'Finished',
    shipped: 'Shipped',
    delivered: 'Delivered',
    rejected: 'Rejected',
    archived: 'Archived',
    cancelled: 'Cancelled',
};

const paymentColors: Record<string, string> = {
    paid: '#10B981',
    partial: '#F59E0B',
    unpaid: '#EF4444',
};

const paymentLabels: Record<string, string> = {
    paid: 'Paid',
    partial: 'Partial',
    unpaid: 'Unpaid',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function Analytics({ stats, filters }: Props) {
    const { t } = useTranslation();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(value);

    const totalOrders = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);

    // Prepare status pie data
    const statusPieData = Object.entries(stats.statusCounts).map(([status, count]) => ({
        name: statusLabels[status] || status,
        value: count,
        color: statusColors[status] || '#94A3B8',
    }));

    // Prepare payment pie data
    const paymentPieData = Object.entries(stats.paymentBreakdown).map(([status, count]) => ({
        name: paymentLabels[status] || status,
        value: count,
        color: paymentColors[status] || '#94A3B8',
    }));

    // Monthly trend with formatted months
    const trendData = stats.monthlyTrend.map((item) => ({
        ...item,
        label: new Date(item.month + '-01').toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
    }));

    return (
        <LabLayout>
            <Head title={t('Analytics')} />

            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3">
                            <BarChart3 className="w-3 h-3" />
                            {t('Detailed Insights')}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('Analytics')}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('Deep dive into your lab performance and metrics')}</p>
                    </div>
                    <DateRangeFilter startDate={filters.start_date} endDate={filters.end_date} />
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Package, label: t('Period Orders'), value: stats.periodOrderCount, color: 'blue', sub: `${totalOrders} total` },
                        { icon: DollarSign, label: t('Period Revenue'), value: formatCurrency(stats.periodRevenue), color: 'emerald', sub: `${formatCurrency(stats.totalRevenue)} total` },
                        { icon: Clock, label: t('Avg. Turnaround'), value: `${stats.avgTurnaroundDays}d`, color: 'amber', sub: t('days to deliver') },
                        { icon: AlertTriangle, label: t('Overdue'), value: stats.overdueCount, color: 'red', sub: `${stats.totalActive} active` },
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none`} />
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white shadow-lg shadow-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</h3>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Chart + Status Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Volume & Revenue Chart */}
                    <div className="lg:col-span-2 glass-card rounded-[2rem] p-8 border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Activity className="w-64 h-64 text-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Order Volume & Revenue')}</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t('Daily Breakdown')}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-500">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="h-80 w-full text-slate-900">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} tickFormatter={(v) => `${v} DH`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar yAxisId="left" dataKey="orders" name={t('Orders')} fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} animationDuration={1500} />
                                    <Area yAxisId="right" type="monotone" dataKey="revenue" name={t('Revenue')} stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={2000} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="glass-card rounded-[2rem] p-8 border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">{t('Status Breakdown')}</h3>
                                <p className="font-black text-[10px] text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('Current Period')}</p>
                            </div>
                            <Activity className="w-5 h-5 text-emerald-500 opacity-50" />
                        </div>

                        {statusPieData.length > 0 ? (
                            <>
                                <div className="h-48 mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusPieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                innerRadius={30}
                                                dataKey="value"
                                                animationDuration={1200}
                                            >
                                                {statusPieData.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3 max-h-52 overflow-y-auto no-scrollbar">
                                    {statusPieData.map((s) => (
                                        <div key={s.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t(s.name)}</span>
                                            </div>
                                            <span className="text-xs font-black text-slate-900 dark:text-white">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 opacity-20">
                                <Package className="w-12 h-12 mb-3" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t('No data')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Second Row: Top Services + Client Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Services */}
                    <div className="glass-card rounded-[2rem] p-8 border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{t('Top Services')}</h3>
                                <p className="font-black text-[10px] text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('By order volume')}</p>
                            </div>
                            <Zap className="w-5 h-5 text-amber-500 opacity-60" />
                        </div>

                        {stats.topServices.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topServices.map((service, idx) => {
                                    const maxCount = Math.max(...stats.topServices.map(s => s.order_count), 1);
                                    const pct = (service.order_count / maxCount) * 100;
                                    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-indigo-500'];
                                    return (
                                        <div key={service.id}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 w-4">{idx + 1}</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{service.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-400">{service.order_count} {t('orders')}</span>
                                                    <span className="text-[10px] font-black text-emerald-500">{formatCurrency(service.revenue)}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-full rounded-full ${colors[idx % colors.length]} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-20">
                                <Zap className="w-10 h-10 mb-2" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t('No services data')}</span>
                            </div>
                        )}
                    </div>

                    {/* Client Breakdown */}
                    <div className="glass-card rounded-[2rem] p-8 border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{t('Client Breakdown')}</h3>
                                <p className="font-black text-[10px] text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('Orders by clinic')}</p>
                            </div>
                            <Users className="w-5 h-5 text-blue-500 opacity-60" />
                        </div>

                        {stats.clientBreakdown.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Clinic')}</th>
                                            <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('Orders')}</th>
                                            <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('Revenue')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                        {stats.clientBreakdown.map((client) => (
                                            <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                                                            {client.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[160px]">{client.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{client.order_count}</span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(client.revenue)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-20">
                                <Users className="w-10 h-10 mb-2" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t('No client data')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Third Row: Payment Breakdown + Monthly Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Status */}
                    <div className="glass-card rounded-[2rem] p-8 border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{t('Payment Status')}</h3>
                                <p className="font-black text-[10px] text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('Collection overview')}</p>
                            </div>
                            <DollarSign className="w-5 h-5 text-emerald-500 opacity-60" />
                        </div>

                        {paymentPieData.length > 0 ? (
                            <div className="flex items-center gap-8">
                                <div className="w-40 h-40 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={paymentPieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={70}
                                                innerRadius={35}
                                                dataKey="value"
                                                animationDuration={1200}
                                            >
                                                {paymentPieData.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {paymentPieData.map((p) => (
                                        <div key={p.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t(p.name)}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{p.value}</span>
                                            </div>
                                            <p className="text-[10px] font-semibold text-slate-400 ml-5">
                                                {formatCurrency(stats.paymentRevenueBreakdown[p.name.toLowerCase()] || 0)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-20">
                                <DollarSign className="w-10 h-10 mb-2" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t('No payment data')}</span>
                            </div>
                        )}
                    </div>

                    {/* Monthly Trend */}
                    <div className="glass-card rounded-[2rem] p-8 border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{t('6-Month Trend')}</h3>
                                <p className="font-black text-[10px] text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('Growth trajectory')}</p>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-emerald-500 opacity-60" />
                        </div>

                        {trendData.length > 0 ? (
                            <div className="h-52 text-slate-900">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
                                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="orders" name={t('Orders')} stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} activeDot={{ r: 7 }} animationDuration={1500} />
                                        <Line type="monotone" dataKey="revenue" name={t('Revenue')} stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} animationDuration={1800} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 opacity-20">
                                <TrendingUp className="w-10 h-10 mb-2" />
                                <span className="font-black text-[10px] uppercase tracking-widest">{t('No trend data')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}
