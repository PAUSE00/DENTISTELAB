import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, ChevronRight, Package, Clock, CheckCircle2, AlertCircle, Building, Zap, DollarSign, TrendingUp, XCircle } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Order {
    id: number;
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    final_price: number;
    is_overdue: boolean;
    lab: { name: string };
    service: { name: string };
    history?: { id: number; from_status: string; to_status: string; created_at: string; user?: { name: string } }[];
}

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    external_id: string | null;
    medical_notes: string | null;
    orders: Order[];
}

interface Props extends PageProps {
    patient: Patient;
    stats: {
        total_orders: number;
        total_spent: number;
        completed: number;
        in_progress: number;
        pending: number;
        cancelled: number;
    };
}

export default function Show({ auth, patient, stats }: Props) {
    const { t } = useTranslation();

    const statusStyles: Record<string, string> = {
        new: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        fitting: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        finished: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        shipped: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
        delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
        rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        cancelled: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
        archived: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    };

    const statCards = [
        { label: t('Total Orders'), value: stats.total_orders, icon: Package, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
        { label: t('Total Spent'), value: `${stats.total_spent?.toLocaleString() || 0} DH`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        { label: t('Completed'), value: stats.completed, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/20' },
        { label: t('In Progress'), value: stats.in_progress, icon: TrendingUp, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    ];

    return (
        <ClinicLayout>
            <Head title={`${patient.first_name} ${patient.last_name}`} />

            <div className="space-y-6 animate-fade-in pb-12">
                {/* Back + Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('clinic.patients.index')}
                        className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-500 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {patient.first_name} {patient.last_name}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">{t('Patient Profile & Order History')}</p>
                    </div>
                </div>

                {/* Patient Info Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-500/20 shrink-0">
                            {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {patient.email && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl"><Mail className="w-4 h-4 text-blue-500" /></div>
                                    <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('Email')}</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 break-all">{patient.email}</p></div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl"><Phone className="w-4 h-4 text-emerald-500" /></div>
                                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('Phone')}</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{patient.phone}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl"><Calendar className="w-4 h-4 text-purple-500" /></div>
                                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('Date of Birth')}</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{new Date(patient.dob).toLocaleDateString()}</p></div>
                            </div>
                            {patient.external_id && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl"><FileText className="w-4 h-4 text-amber-500" /></div>
                                    <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('External ID')}</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{patient.external_id}</p></div>
                                </div>
                            )}
                        </div>
                    </div>
                    {patient.medical_notes && (
                        <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest mb-1.5">{t('Medical Notes')}</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{patient.medical_notes}</p>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow}`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Order History Timeline */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{t('Order History')}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{t('All past treatments and orders')}</p>
                    </div>

                    {patient.orders.length > 0 ? (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {patient.orders.map((order, index) => (
                                <div key={order.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                    <div className="flex items-start gap-4">
                                        {/* Timeline dot */}
                                        <div className="relative flex flex-col items-center shrink-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg ${['delivered', 'finished', 'archived'].includes(order.status)
                                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/20'
                                                    : ['cancelled', 'rejected'].includes(order.status)
                                                        ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20'
                                                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20'
                                                }`}>
                                                #{order.id}
                                            </div>
                                            {index < patient.orders.length - 1 && (
                                                <div className="w-0.5 h-full bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 absolute top-12 left-1/2 -translate-x-1/2" />
                                            )}
                                        </div>

                                        {/* Order Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                                            {order.status === 'new' || order.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                                ['delivered', 'finished'].includes(order.status) ? <CheckCircle2 className="w-3 h-3" /> :
                                                                    ['cancelled', 'rejected'].includes(order.status) ? <XCircle className="w-3 h-3" /> :
                                                                        <Package className="w-3 h-3" />}
                                                            {t(order.status.replace('_', ' '))}
                                                        </span>
                                                        {order.priority === 'urgent' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black text-rose-500 bg-rose-500/10 uppercase tracking-widest">
                                                                <AlertCircle className="w-3 h-3" /> {t('Urgent')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                        <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {order.lab?.name}</span>
                                                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-500" /> {order.service?.name}</span>
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                        {order.final_price > 0 && (
                                                            <span className="flex items-center gap-1.5 font-bold text-emerald-600"><DollarSign className="w-3.5 h-3.5" /> {order.final_price} DH</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route('clinic.orders.show', order.id)}
                                                    className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 transition-all shadow-sm opacity-0 group-hover:opacity-100 shrink-0"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white">{t('No Orders Yet')}</h3>
                            <p className="text-xs text-slate-400 mt-1">{t('No orders have been placed for this patient.')}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        href={route('clinic.patients.edit', patient.id)}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/25"
                    >
                        {t('Edit Patient')}
                    </Link>
                    <Link
                        href={route('clinic.orders.create')}
                        className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        {t('New Order')}
                    </Link>
                </div>
            </div>
        </ClinicLayout>
    );
}
