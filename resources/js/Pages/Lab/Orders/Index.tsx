import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, ChevronRight, CheckCircle2, Clock, AlertCircle, Package, Building, User, FileText, XCircle, Download, FilterX, Zap } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';

interface Order {
    id: number;
    patient: { first_name: string; last_name: string };
    clinic: { name: string };
    service: { name: string };
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    is_overdue: boolean;
    days_remaining: number;
}

interface Props extends PageProps {
    orders: {
        data: Order[];
        links: any[];
    };
}

export default function Index({ auth, orders }: Props) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const statusStyles: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        in_progress: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        completed: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'accepted': return <CheckCircle2 className="w-3 h-3" />;
            case 'in_progress': return <Package className="w-3 h-3" />;
            case 'shipped': return <Package className="w-3 h-3" />;
            case 'completed': return <CheckCircle2 className="w-3 h-3" />;
            case 'rejected': return <XCircle className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    return (
        <LabLayout>
            <Head title={t('Orders')} />

            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Incoming')} <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">{t('Orders')}</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">{t('Manage and track orders from clinics.')}</p>
                    </div>
                    <a
                        href={route('lab.export.orders')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">{t('Export CSV')}</span>
                    </a>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('Search by patient, clinic, or ID...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500/20 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-[1.5rem] transition-colors"
                        title={t('Clear')}
                    >
                        <FilterX className="w-6 h-6" />
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-8 py-6">{t('Order')}</th>
                                    <th className="px-6 py-6">{t('Clinic & Patient')}</th>
                                    <th className="px-6 py-6">{t('Service')}</th>
                                    <th className="px-6 py-6">{t('Status')}</th>
                                    <th className="px-6 py-6">{t('Due Date')}</th>
                                    <th className="px-8 py-6 text-right">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <span className="font-black text-slate-900 dark:text-white text-sm tracking-tighter">#{order.id}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Building className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="font-bold text-xs text-slate-900 dark:text-white">{order.clinic.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.patient.first_name} {order.patient.last_name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{order.service.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[order.status] || 'bg-slate-100 text-slate-800'}`}>
                                                        <StatusIcon status={order.status} />
                                                        {t(order.status.replace('_', ' '))}
                                                    </span>
                                                    {order.priority === 'urgent' && (
                                                        <div className="flex items-center gap-1 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                                                            <AlertCircle className="w-3 h-3" /> {t('Urgent')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5">
                                                    <span className={`text-xs font-bold ${order.is_overdue ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {new Date(order.due_date).toLocaleDateString()}
                                                    </span>
                                                    {order.is_overdue && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest w-fit">
                                                            <AlertCircle className="w-3 h-3" /> {t('Overdue')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                    <Link
                                                        href={route('lab.orders.show', order.id)}
                                                        className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 transition-all shadow-sm inline-flex"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                    <Package className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('No Orders Found')}</h3>
                                                <p className="text-slate-400 font-medium text-xs mt-1">{t('Awaiting clinic submissions.')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {orders.links && orders.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Order Registry')}</p>
                            <Pagination links={orders.links} />
                        </div>
                    )}
                </div>
            </div>
        </LabLayout>
    );
}
