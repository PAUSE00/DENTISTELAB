import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Users,
    Building2,
    Activity,
    ShieldCheck,
    CreditCard,
    DollarSign,
    Package,
    ArrowUpRight,
    Search,
    ExternalLink,
    Clock,
    UserPlus,
    BarChart3
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

export default function Dashboard({ auth, stats, orderVolumeTrend, recentUsers, recentOrders }: Props) {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            'in_progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            'cancelled': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
            'rejected': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    };

    const StatCard = ({ icon: Icon, label, value, unit, trend, color }: any) => {
        const colorMap: any = {
            indigo: 'from-indigo-500/10 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:border-indigo-500/30',
            purple: 'from-purple-500/10 text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:border-purple-500/30',
            pink: 'from-pink-500/10 text-pink-600 dark:text-pink-400 bg-pink-500/5 hover:border-pink-500/30',
            amber: 'from-amber-500/10 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:border-amber-500/30',
        };

        return (
            <div className={`card overflow-hidden p-6 relative group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-indigo-500/10 transition-all duration-500 ${colorMap[color]}`} style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between relative z-10">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-black py-1 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 uppercase tracking-widest`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div className="mt-6 relative z-10 text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--txt-3)' }}>{label}</p>
                    <h3 className="text-2xl font-black tracking-tighter italic" style={{ color: 'var(--txt-1)' }}>
                        {value} {unit && <span className="text-xs font-bold not-italic ml-1" style={{ color: 'var(--txt-3)' }}>{unit}</span>}
                    </h3>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-200/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full -mr-16 -mt-16 pointer-events-none" />
            </div>
        );
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-lg font-black text-white italic">
                        {payload[0].value} <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest not-italic ml-1">{t('Orders')}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminLayout header={t('Admin Dashboard')}>
            <Head title={t('Admin Dashboard')} />

            <div className="space-y-8 animate-fade-in pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20" />
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                                {t('Hello')}, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{auth.user.name.split(' ')[0]}</span> <span className="inline-block animate-bounce-subtle">👋</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                                {t('Platform control center active. All systems are performing optimally.')}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href={route('admin.users.index')} className="group px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Search className="w-5 h-5" />
                                </div>
                                <span className="text-white font-bold">{t('Find User')}</span>
                            </Link>
                            <button className="group px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center gap-3 transform active:scale-95">
                                <Activity className="w-5 h-5 group-hover:animate-pulse" />
                                <span className="font-bold whitespace-nowrap">{t('System Status')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        icon={DollarSign} 
                        label={t('Total Revenue')} 
                        value={stats.total_revenue.toLocaleString()} 
                        unit="MAD" 
                        trend="+12.5%" 
                        color="indigo" 
                    />
                    <StatCard 
                        icon={BarChart3} 
                        label={t('Monthly Active')} 
                        value={stats.mrr.toLocaleString()} 
                        unit="MAD" 
                        trend="+8.2%" 
                        color="purple" 
                    />
                    <StatCard 
                        icon={Building2} 
                        label={t('Labs / Clinics')} 
                        value={`${stats.total_labs} / ${stats.total_clinics}`} 
                        trend="+3" 
                        color="pink" 
                    />
                    <StatCard 
                        icon={Package} 
                        label={t('Total Orders')} 
                        value={stats.total_orders.toString()} 
                        trend="+156" 
                        color="amber" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Trend Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="card p-8 relative overflow-hidden group shadow-sm" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight italic underline decoration-indigo-500/30" style={{ color: 'var(--txt-1)' }}>{t('Order Volume Trend')}</h3>
                                    <p className="text-xs font-bold mt-2 uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('30 Day Activity Analytics')}</p>
                                </div>
                                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
                                    <button className="px-4 py-1.5 rounded-lg shadow-sm text-[10px] font-black uppercase tracking-wider text-indigo-500" style={{ background: 'var(--bg-raised)' }}>{t('Daily')}</button>
                                    <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--txt-3)' }}>{t('Weekly')}</button>
                                </div>
                            </div>

                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={orderVolumeTrend}>
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#94a3b8" 
                                            fontSize={10} 
                                            fontWeight="800"
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />
                                        <YAxis 
                                            stroke="#94a3b8" 
                                            fontSize={10} 
                                            fontWeight="800"
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="orders" 
                                            stroke="#6366f1" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#chartGradient)" 
                                            animationDuration={1500} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Recent Orders Table */}
                        <section className="card overflow-hidden" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="px-8 py-6 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
                                <h3 className="font-black flex items-center gap-3 italic uppercase tracking-tight underline decoration-indigo-500/30" style={{ color: 'var(--txt-1)' }}>
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    {t('Real-time Operations')}
                                </h3>
                                <button className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline">{t('View All Orders')}</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead style={{ background: 'var(--surface)' }}>
                                        <tr className="text-[10px] uppercase tracking-widest font-black" style={{ color: 'var(--txt-3)' }}>
                                            <th className="px-8 py-5 tracking-tighter">{t('Order Reference')}</th>
                                            <th className="px-6 py-5 tracking-tighter">{t('Involved Entities')}</th>
                                            <th className="px-6 py-5 tracking-tighter">{t('Financials')}</th>
                                            <th className="px-6 py-5 tracking-tighter">{t('Progress Status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: 'var(--surface)' }}>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
                                                <td className="px-8 py-5 group-hover:translate-x-1 transition-transform">
                                                    <p className="font-black tracking-tighter" style={{ color: 'var(--txt-1)' }}>ORD-{order.id.toString().padStart(4, '0')}</p>
                                                    <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--txt-3)' }}>{order.patient.first_name} {order.patient.last_name}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-3 h-3 text-indigo-400" />
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Activity className="w-3 h-3 text-purple-400" />
                                                        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--txt-3)' }}>{order.lab.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-black text-xs tracking-tight" style={{ color: 'var(--txt-1)' }}>{order.price.toLocaleString()} MAD</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                        {t(order.status.replace('_', ' '))}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="card p-8 shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <ShieldCheck className="w-10 h-10 text-indigo-500 mb-6" />
                            <h3 className="text-xl font-bold uppercase tracking-tight font-black leading-tight italic underline decoration-indigo-500/30" style={{ color: 'var(--txt-1)' }}>{t('System Overview')}</h3>
                            <p className="text-sm font-medium mt-3 leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                                {t('The platform is currently hosting')} <span className="text-indigo-500 font-bold">{stats.total_users} active users</span>.
                                {t('Average daily order volume is')} <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{(stats.total_orders / 30).toFixed(1)}</span>.
                            </p>
                            
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl shadow-sm" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Server Health')}</span>
                                    </div>
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">99.9%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl shadow-sm" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Queue Status')}</span>
                                    </div>
                                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{t('Idle')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users List */}
                        <div className="card overflow-hidden shadow-sm" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                <h3 className="font-bold uppercase font-black italic tracking-tighter underline decoration-indigo-500/30" style={{ color: 'var(--txt-1)' }}>
                                    {t('New Registrations')}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0 uppercase tracking-tight">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate text-sm uppercase tracking-tight leading-none mb-1" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black py-0.5 px-2 rounded-md uppercase tracking-widest shrink-0" style={{ background: 'var(--surface)', color: 'var(--txt-2)' }}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-medium truncate" style={{ color: 'var(--txt-3)' }}>{user.clinic?.name || user.lab?.name || user.email}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.users.index')} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href={route('admin.users.index')} className="block w-full py-4 text-center text-xs font-black uppercase tracking-widest transition-all border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
                                {t('View all users')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
