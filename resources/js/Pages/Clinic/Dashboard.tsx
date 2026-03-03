import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Package, Clock, CheckCircle2, ArrowRight, Users, MessageSquare, DollarSign, Activity, Zap, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import DateRangeFilter from '@/Components/DateRangeFilter';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { router } from '@inertiajs/react';
import CustomTooltip from '@/Components/CustomTooltip';

interface DashboardProps extends PageProps {
    stats: {
        total_orders: number;
        pending_orders: number;
        completed_orders: number;
        total_spend: number;
    };
    chartData: Array<{
        name: string;
        orders: number;
        spend: number;
    }>;
    recent_orders: Array<{
        id: number;
        patient_name: string;
        service_name: string;
        status: string;
        created_at: string;
        due_date: string;
    }>;
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

export default function Dashboard({ auth, stats, chartData, recent_orders, filters }: DashboardProps) {
    const { t } = useTranslation();

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`clinic.${auth.user.clinic_id}`)
                .listen('.order.updated', (e: any) => {
                    router.reload({ only: ['stats', 'chartData', 'recent_orders'] });
                });
        }
        return () => {
            if (window.Echo) {
                window.Echo.leave(`clinic.${auth.user.clinic_id}`);
            }
        };
    }, [auth.user.clinic_id]);

    const statusBadges: Record<string, string> = {
        new: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
        in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
        fitting: 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
        finished: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
        delivered: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
        rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
        archived: 'bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-[0_0_15px_rgba(100,116,139,0.1)]',
    };

    return (
        <ClinicLayout>
            <Head title={t('Clinic Dashboard')} />

            <div id="clinic-dashboard" className="space-y-8 pb-10">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-black text-[10px] uppercase tracking-widest mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t('Operational Excellence')}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                                {t('Welcome to Your')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                    {t('Digital Clinic')}
                                </span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-xl">
                                {t('Monitor your cases, track laboratory progress, and manage clinic operations from a single unified workspace.')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={route('clinic.orders.create')}
                                className="group relative overflow-hidden flex items-center gap-3 px-8 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(59,130,246,0.3)] transition-all duration-500"
                            >
                                <Package className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <span className="block font-black tracking-tight leading-none mb-1">{t('Dispatch Order')}</span>
                                    <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">{t('Instant Lab Request')}</span>
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
                    <StatCard
                        icon={Package}
                        label={t('Total Requests')}
                        value={stats.total_orders}
                        color="blue"
                        delay="animate-delay-100"
                        trend="14%"
                    />
                    <StatCard
                        icon={Clock}
                        label={t('In Production')}
                        value={stats.pending_orders}
                        color="amber"
                        delay="animate-delay-200"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label={t('Successfully Delivered')}
                        value={stats.completed_orders}
                        color="emerald"
                        delay="animate-delay-300"
                        trend="22%"
                    />
                    <StatCard
                        icon={DollarSign}
                        label={t('Financial Volume')}
                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(stats.total_spend)}
                        color="indigo"
                        delay="animate-delay-400"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Expenditure Visualization */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card rounded-[2rem] p-8 border-none overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <TrendingUp className="w-64 h-64 text-blue-500" />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Operational Insight')}</h3>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{t('Network Traffic & Expenditure')}</p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-500">
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="spend"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorSpend)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Order Management Table */}
                        <div className="glass-card rounded-[2rem] border-none overflow-hidden relative">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Active Operations')}</h3>
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{t('Real-time Tracking')}</p>
                                </div>
                                <Link
                                    href={route('clinic.orders.index')}
                                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    {t('Network Registry')}
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ID')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Registry Name')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Service Type')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Due Date')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('State')}</th>
                                            <th className="px-8 py-5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {recent_orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                                        <Activity className="w-12 h-12" />
                                                        <span className="font-black text-sm uppercase tracking-widest">{t('No active processes')}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            recent_orders.map((order) => (
                                                <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-5 font-black text-sm text-slate-400 tracking-tighter">#{order.id}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20">
                                                                {order.patient_name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-slate-900 dark:text-white tracking-tight">{order.patient_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2 font-black text-xs text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                                            <Zap className="w-4 h-4 text-blue-500" />
                                                            {order.service_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 font-bold text-xs text-slate-500 dark:text-slate-500 tracking-tight">
                                                        {new Date(order.due_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusBadges[order.status] || 'bg-slate-100 text-slate-800'}`}>
                                                            {t(order.status.replace('_', ' '))}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <Link
                                                            href={route('clinic.orders.show', order.id)}
                                                            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all border border-transparent hover:border-blue-500/20"
                                                        >
                                                            <ArrowRight className="w-5 h-5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Quick Action Matrix */}
                        <div className="glass-card rounded-[2rem] p-8 border-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                <Zap className="w-24 h-24 text-blue-500" />
                            </div>

                            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">{t('Command Matrix')}</h3>

                            <div className="space-y-3">
                                <Link
                                    href={route('clinic.orders.create')}
                                    className="flex items-center gap-4 w-full p-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-2xl hover:shadow-blue-500/30 text-white rounded-[1.5rem] transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white ring-8 ring-white/5">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-black tracking-tight text-sm">{t('New Protocol')}</span>
                                        <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest mt-0.5">{t('Initialize Order')}</span>
                                    </div>
                                </Link>

                                <Link
                                    href={route('clinic.patients.create')}
                                    className="flex items-center gap-4 w-full p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-black tracking-tight text-sm text-slate-900 dark:text-white">{t('Patient Intake')}</span>
                                        <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mt-0.5">{t('Registry Entry')}</span>
                                    </div>
                                </Link>

                                <Link
                                    href={route('clinic.orders.index')}
                                    className="flex items-center gap-4 w-full p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-black tracking-tight text-sm text-slate-900 dark:text-white">{t('Operational Log')}</span>
                                        <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mt-0.5">{t('Full Audit')}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Support Channel */}
                        <div className="glass-card rounded-[2rem] p-8 border-none relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-transparent">
                            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4">{t('Direct Transmission')}</h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                {t('Need technical intervention or have protocol queries? Connect directly with our lab technocrats.')}
                            </p>
                            <button className="flex items-center gap-3 w-full p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all group">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                {t('Open Support Channel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
