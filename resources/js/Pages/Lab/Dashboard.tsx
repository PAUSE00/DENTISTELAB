import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Order } from '@/types';
import {
    Package,
    Clock,
    AlertTriangle,
    CalendarClock,
    DollarSign,
    ArrowRight,
    ClipboardList,
    Sparkles,
    BarChart3,
    Eye,
    TrendingUp,
} from 'lucide-react';
import { useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { router } from '@inertiajs/react';

interface Stats {
    totalActive: number;
    pendingNew: number;
    overdueCount: number;
    dueTodayCount: number;
    monthRevenue: number;
}

interface Props extends PageProps {
    stats: Stats;
    recentOrders: Order[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    new: { label: 'New', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    fitting: { label: 'Fitting', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
    finished: { label: 'Finished', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
    shipped: { label: 'Shipped', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', dot: 'bg-indigo-500' },
    delivered: { label: 'Delivered', bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    rejected: { label: 'Rejected', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
    archived: { label: 'Archived', bg: 'bg-gray-50 dark:bg-gray-500/10', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-400' },
};

const priorityBadge: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    normal: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

export default function Dashboard({ auth, stats, recentOrders }: Props) {
    const { t } = useTranslation();

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`lab.${auth.user.lab_id}`)
                .listen('.order.submitted', () => {
                    router.reload({ only: ['stats', 'recentOrders'] });
                });
        }
        return () => {
            if (window.Echo) {
                window.Echo.leave(`lab.${auth.user.lab_id}`);
            }
        };
    }, [auth.user.lab_id]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(value);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
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
                                {t('Monitor incoming orders and keep your production workflow running smoothly.')}
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
                            {auth.user.role === 'lab_owner' && (
                                <Link
                                    href={route('lab.analytics.index')}
                                    className="group relative overflow-hidden flex items-center gap-3 px-8 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 transition-all duration-500"
                                >
                                    <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <span className="block font-black tracking-tight leading-none mb-1">{t('Analytics')}</span>
                                        <span className="block text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">{t('Detailed Insights')}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { icon: Package, label: t('Active Orders'), value: stats.totalActive, color: 'blue' },
                        { icon: Clock, label: t('Pending New'), value: stats.pendingNew, color: 'amber' },
                        { icon: AlertTriangle, label: t('Overdue'), value: stats.overdueCount, color: 'red' },
                        { icon: CalendarClock, label: t('Due Today'), value: stats.dueTodayCount, color: 'purple' },
                        ...(auth.user.role === 'lab_owner' ? [{ icon: DollarSign, label: t('Month Revenue'), value: formatCurrency(stats.monthRevenue), color: 'emerald' }] : []),
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 pointer-events-none`} />
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white shadow-lg shadow-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</h3>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div className="glass-card rounded-[2rem] overflow-hidden border-none">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t('Recent Orders')}</h2>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">{t('Latest incoming work')}</p>
                        </div>
                        <Link
                            href={route('lab.orders.index')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                            {t('View All')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-40">
                            <Package className="w-16 h-16 mb-4 text-slate-400" />
                            <p className="font-bold text-sm text-slate-500">{t('No orders received yet')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/60">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Order')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Patient')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">{t('Service')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">{t('Clinic')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Status')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">{t('Due Date')}</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('Priority')}</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {recentOrders.map((order) => {
                                        const sc = statusConfig[order.status] || statusConfig.new;
                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">#{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                                        {order.patient ? `${order.patient.first_name} ${order.patient.last_name}` : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className="text-sm text-slate-600 dark:text-slate-300">{order.service?.name || '—'}</span>
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">{order.clinic?.name || '—'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${sc.bg} ${sc.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                        {t(sc.label)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className={`text-sm font-medium ${order.is_overdue ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {order.due_date ? formatDate(order.due_date) : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${priorityBadge[order.priority] || priorityBadge.normal}`}>
                                                        {t(order.priority)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('lab.orders.show', order.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </LabLayout>
    );
}
