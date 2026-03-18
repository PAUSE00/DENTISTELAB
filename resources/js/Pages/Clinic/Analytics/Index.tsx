import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    TrendingUp, TrendingDown, Users, Package, 
    DollarSign, Activity, Calendar, Award,
    ChevronUp, ChevronDown, Filter, Download
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import useTranslation from '@/Hooks/useTranslation';

interface ChartData {
    spendingTrend: { name: string; total: number }[];
    labDistribution: { name: string; value: number }[];
    orderVolumeTrend: { month: string; orders: number }[];
}

interface Props extends PageProps {
    stats: {
        total_spending: number;
        active_orders: number;
        patient_count: number;
        avg_order_value: number;
    };
    chartData: ChartData;
}

const COLORS = ['#818cf8', '#60ddc6', '#f59e0b', '#ef4444', '#10b981'];

export default function Index({ auth, stats, chartData }: Props) {
    const { t } = useTranslation();

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <ClinicLayout>
            <Head title={t('Practice Intelligence')} />
            
            <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Practice Insights')}</h2>
                        <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{t('Business Performance & Clinical Analytics')}</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold hover:bg-white/5 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                            <Filter size={14} /> {t('Filters')}
                        </button>
                        <button className="btn-primary flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold">
                            <Download size={14} /> {t('Export Report')}
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#818cf8]/10 flex items-center justify-center text-[#818cf8]">
                                <DollarSign size={20} />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ChevronUp size={10} /> 12.5%
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Total Expenditure')}</span>
                            <h3 className="text-2xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{formatCurrency(stats.total_spending)}</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#60ddc6]/10 flex items-center justify-center text-[#60ddc6]">
                                <Activity size={20} />
                            </div>
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{t('Live Orders')}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Active Workflow')}</span>
                            <h3 className="text-2xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{stats.active_orders}</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Users size={20} />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ChevronUp size={10} /> 5.2%
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Total Patients')}</span>
                            <h3 className="text-2xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{stats.patient_count}</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Award size={20} />
                            </div>
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{t('Avg / Order')}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Unit Efficiency')}</span>
                            <h3 className="text-2xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{formatCurrency(stats.avg_order_value)}</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Spending Trend (Area Chart) */}
                    <div className="lg:col-span-2 card p-8 flex flex-col gap-6" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                                <TrendingUp size={18} className="text-[#818cf8]" /> {t('Spending Momentum')}
                            </h3>
                            <div className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">{t('Last 6 Months')}</div>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.spendingTrend}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip 
                                        contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lab Distribution (Pie Chart) */}
                    <div className="card p-8 flex flex-col gap-6" style={{ background: 'var(--bg-raised)' }}>
                        <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                            <Package size={18} className="text-[#60ddc6]" /> {t('Lab Distribution')}
                        </h3>
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.labDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.labDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {chartData.labDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--txt-3)' }}>
                                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                                        {entry.name}
                                    </div>
                                    <span style={{ color: 'var(--txt-2)' }}>{entry.value} {t('Orders')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Volume Trend */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="card p-8 flex flex-col gap-6" style={{ background: 'var(--bg-raised)' }}>
                         <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                                <Calendar size={18} className="text-orange-500" /> {t('Volume Flux')}
                            </h3>
                            <div className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">{t('Order Volume by Month')}</div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.orderVolumeTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="orders" fill="#60ddc6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
