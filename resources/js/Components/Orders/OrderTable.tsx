import { Link } from '@inertiajs/react';
import { ChevronRight, CheckCircle2, Clock, AlertCircle, Package, Building, Zap, Trash2, Download, X } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';
import { OrderListItem } from '@/types/order';

const statusStyles: Record<string, string> = {
    new: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    fitting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    finished: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    cancelled: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    archived: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'pending': case 'new': return <Clock className="w-3 h-3" />;
        case 'completed': case 'delivered': case 'finished': return <CheckCircle2 className="w-3 h-3" />;
        case 'cancelled': case 'rejected': return <AlertCircle className="w-3 h-3" />;
        default: return <Package className="w-3 h-3" />;
    }
};

interface OrderTableProps {
    orders: {
        data: OrderListItem[];
        links: any[];
        total?: number;
    };
    selectedOrders: number[];
    /** 'lab' shows clinic column; 'clinic' shows lab column */
    variant: 'lab' | 'clinic';
    showRoute: (id: number) => string;
    onToggleSelectAll: () => void;
    onToggleSelect: (id: number) => void;
    bulkActions: React.ReactNode;
}

export default function OrderTable({
    orders,
    selectedOrders,
    variant,
    showRoute,
    onToggleSelectAll,
    onToggleSelect,
    bulkActions,
}: OrderTableProps) {
    const { t } = useTranslation();

    const counterpartyLabel = variant === 'lab' ? t('Clinic') : t('Lab');
    const serviceLabel = variant === 'lab' ? t('Clinic & Service') : t('Lab & Service');

    return (
        <>
            {/* Bulk Action Bar */}
            {selectedOrders.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {selectedOrders.length} {t('orders selected')}
                    </span>
                    <div className="flex items-center gap-2">
                        {bulkActions}
                        <button
                            onClick={() => onToggleSelectAll()}
                            className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-6 py-5 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
                                        onChange={onToggleSelectAll}
                                        className="rounded-md border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-5">{t('Order')}</th>
                                <th className="px-4 py-5">{t('Patient')}</th>
                                <th className="px-4 py-5">{serviceLabel}</th>
                                <th className="px-4 py-5">{t('Status')}</th>
                                <th className="px-4 py-5">{t('Due Date')}</th>
                                <th className="px-6 py-5 text-right">{t('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => {
                                    const counterpartyName = variant === 'lab'
                                        ? order.clinic?.name
                                        : order.lab?.name;
                                    return (
                                        <tr
                                            key={order.id}
                                            className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ${selectedOrders.includes(order.id) ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => onToggleSelect(order.id)}
                                                    className="rounded-md border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-black text-slate-900 dark:text-white text-sm tracking-tighter">#{order.id}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-500/20">
                                                        {order.patient.first_name[0]}{order.patient.last_name[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                                                        {order.patient.first_name} {order.patient.last_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Building className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{counterpartyName || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.service.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
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
                                            <td className="px-4 py-4">
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                    <Link
                                                        href={showRoute(order.id)}
                                                        className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 transition-all shadow-sm inline-flex"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <Package className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('No Orders Found')}</h3>
                                            <p className="text-slate-400 font-medium text-xs mt-1">{t('Create your first order to get started.')}</p>
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
        </>
    );
}
