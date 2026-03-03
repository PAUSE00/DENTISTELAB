import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
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
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    Package,
    ArrowUpRight,
    Clock,
    TrendingUp,
    Calendar,
    ClipboardList,
    Sparkles,
    ArrowRight,
    Zap,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';
import DateRangeFilter from '@/Components/DateRangeFilter';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { router } from '@inertiajs/react';
import CustomTooltip from '@/Components/CustomTooltip';

interface Stats {
    statusCounts: Record<string, number>;
    totalRevenue: number;
    monthlyRevenue: number;
    chartData: { name: string; orders: number; revenue: number }[];
    pendingOrders: number;
}

interface Props extends PageProps {
    stats: Stats;
    filters: {
        start_date: string;
        end_date: string;
    };
}

const StatCard = ({ icon: Icon, label, value, color, delay, trend }: any) => {
    return (
        <div className={`glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 animate-fade-in ${delay}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none`}></div>
            <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-xl shadow-${color}-500/20 flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</h3>
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] mb-1">
                            <TrendingUp className="w-3 h-3" />
                            {trend}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats, filters }: Props) {
    const { t } = useTranslation();

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`lab.${auth.user.lab_id}`)
                .listen('.order.submitted', (e: any) => {
                    router.reload({ only: ['stats'] });
                });
        }
        return () => {
            if (window.Echo) {
                window.Echo.leave(`lab.${auth.user.lab_id}`);
            }
        };
    }, [auth.user.lab_id]);

    const statusColors: Record<string, string> = {
        completed: 'bg-emerald-500',
        delivered: 'bg-emerald-500',
        in_progress: 'bg-blue-500',
        fitting: 'bg-blue-500',
        sent: 'bg-amber-500',
        shipped: 'bg-amber-500',
        default: 'bg-slate-400'
    };

    return (
        <LabLayout>
            <Head title={t('Lab Dashboard')} />

            <div id="lab-dashboard" className="space-y-8 pb-10">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t('Precision Laboratory Management')}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                                {t('Laboratory')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                                    {t('Command Center')}
                                </span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-xl">
                                {t('Orchestrate your production workflows, track technical precision, and maintain peak operational efficiency.')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={route('lab.orders.index')}
                                className="group relative overflow-hidden flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all duration-500"
                            >
                                <ClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <span className="block font-black tracking-tight leading-none mb-1">{t('Production Queue')}</span>
                                    <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">{t('Active Workflows')}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-10 translate-y-1/2 flex items-center gap-4">
                        <DateRangeFilter startDate={filters.start_date} endDate={filters.end_date} />
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                    {auth.user.role === 'lab_owner' && (
                        <StatCard
                            icon={DollarSign}
                            label={t('Period Revenue')}
                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(stats.monthlyRevenue)}
                            color="emerald"
                            delay="animate-delay-100"
                            trend="12.5%"
                        />
                    )}
                    <StatCard
                        icon={Clock}
                        label={t('Active Tasks')}
                        value={stats.pendingOrders}
                        color="amber"
                        delay="animate-delay-200"
                    />
                    {auth.user.role === 'lab_owner' && (
                        <StatCard
                            icon={CreditCard}
                            label={t('Financial Volume')}
                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(stats.totalRevenue)}
                            color="blue"
                            delay="animate-delay-300"
                        />
                    )}
                    <StatCard
                        icon={Users}
                        label={t('Partner Network')}
                        value="3"
                        color="indigo"
                        delay="animate-delay-400"
                        trend="Active"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Volume Visualization */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card rounded-[2rem] p-8 border-none overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <Activity className="w-64 h-64 text-emerald-500" />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Operational Performance')}</h3>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t('Throughput & Logistics')}</p>
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
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                            tickFormatter={(value) => `${value} DH`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="orders"
                                            name={t('Order Volume')}
                                            fill="#3b82f6"
                                            radius={[8, 8, 0, 0]}
                                            barSize={32}
                                            animationDuration={1500}
                                        />
                                        {auth.user.role === 'lab_owner' && (
                                            <Area
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="revenue"
                                                name={t('Revenue')}
                                                stroke="#10b981"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                animationDuration={2000}
                                            />
                                        )}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity or Status Grid could go here, but focusing on consistency with previous dashboards */}
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Status Matrix */}
                        <div className="glass-card rounded-[2rem] p-8 border-none relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">{t('Operational Status')}</h3>
                                    <p className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight mt-1">{t('Protocol Breakdown')}</p>
                                </div>
                                <Activity className="w-5 h-5 text-emerald-500 opacity-50" />
                            </div>

                            <div className="space-y-6">
                                {Object.entries(stats.statusCounts).map(([status, count]) => {
                                    const totalOrders = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);
                                    const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                                    const bgColorClass = statusColors[status] || statusColors.default;

                                    return (
                                        <div key={status} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                    {t(status.replace('_', ' '))}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                    {count}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${bgColorClass} shadow-sm transition-all duration-1000 ease-out`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                                {Object.keys(stats.statusCounts).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                        <Package className="w-12 h-12 mb-3" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">{t('No active processes')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Direct Command Matrix */}
                        <div className="glass-card rounded-[2rem] p-8 border-none relative overflow-hidden">
                            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">{t('Command Matrix')}</h3>

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href={route('lab.orders.index')}
                                    className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                                        <ClipboardList className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('Registry')}</span>
                                </Link>

                                <Link
                                    href={route('lab.services.index')}
                                    className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('Services')}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Communication Channel */}
                        <div className="glass-card rounded-[2rem] p-8 border-none relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-transparent">
                            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4">{t('Technical Transmission')}</h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                {t('Need protocol clarification or administrative support? Sync with our support technicians instantly.')}
                            </p>
                            <button className="flex items-center gap-3 w-full p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all group">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                {t('Sync Support')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}
