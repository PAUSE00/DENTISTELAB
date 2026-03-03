import LabLayout from '@/Layouts/LabLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle, Search, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Stats {
    total_revenue: number;
    pending_amount: number;
    monthly_revenue: number;
    unpaid_count: number;
    partial_count: number;
    paid_count: number;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    price: number;
    final_price: number | null;
    created_at: string;
    patient?: { first_name: string; last_name: string };
    clinic?: { name: string };
    service?: { name: string };
}

interface ClinicBalance {
    clinic_id: number;
    clinic_name: string;
    open_balance: number;
    orders_count: number;
}

interface Props extends PageProps {
    stats: Stats;
    clinic_balances: ClinicBalance[];
    orders: {
        data: Order[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { payment_status?: string; search?: string };
}

export default function FinanceIndex({ auth, stats, clinic_balances, orders, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
    const [processingClinicPay, setProcessingClinicPay] = useState<number | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
    };

    const applyFilters = (overridePayment?: string) => {
        const ps = overridePayment !== undefined ? overridePayment : paymentFilter;
        router.get(route('lab.finance.index'), {
            search: search || undefined,
            payment_status: ps || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const paymentBadges: Record<string, string> = {
        unpaid: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        partial: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        paid: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    };

    const paymentLabels: Record<string, string> = {
        unpaid: t('Unpaid'),
        partial: t('Partial'),
        paid: t('Paid'),
    };

    const handlePaymentUpdate = (orderId: number, status: string) => {
        router.patch(route('lab.orders.update-payment', orderId), { payment_status: status });
    };

    const handleClinicPay = (clinicId: number) => {
        if (!confirm(t('Are you sure you want to mark this balance as paid?'))) return;
        setProcessingClinicPay(clinicId);
        router.patch(route('lab.finance.clinic.pay', clinicId), {}, {
            preserveScroll: true,
            onFinish: () => setProcessingClinicPay(null)
        });
    };

    return (
        <LabLayout>
            <Head title={t('Finance')} />
            <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="animate-fade-in animate-delay-100">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {t('Finance & Payments')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Track billing and payments')}</p>
                    </div>
                    <a
                        href={route('lab.export.finance')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-colors text-sm font-medium shadow-sm animate-fade-in animate-delay-100 group"
                    >
                        <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        {t('Export CSV')}
                    </a>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animate-delay-200">
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-125"></div>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-md shadow-emerald-500/10">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Total Revenue')}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(stats.total_revenue)}</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform animate-delay-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-125"></div>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3 shadow-md shadow-primary-500/10">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Monthly Revenue')}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(stats.monthly_revenue)}</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform animate-delay-400">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-125"></div>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 shadow-md shadow-amber-500/10">
                                <Clock className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('Pending Amount')}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(stats.pending_amount)}</p>
                        </div>
                    </div>
                </div>

                {/* Clinic Balances Section */}
                {clinic_balances && clinic_balances.length > 0 && (
                    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
                            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                {t('Clinic Balances (Unpaid / Partial)')}
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-slate-700">
                                        <th className="text-left py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">{t('Clinic')}</th>
                                        <th className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">{t('Unpaid Orders')}</th>
                                        <th className="text-right py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">{t('Open Balance')}</th>
                                        <th className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">{t('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                    {clinic_balances.map(balance => (
                                        <tr key={balance.clinic_id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="py-3 px-6 font-medium">{balance.clinic_name}</td>
                                            <td className="py-3 px-6 text-center text-gray-600 dark:text-gray-300">
                                                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    {balance.orders_count}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-right font-bold text-gray-800 dark:text-white">{formatCurrency(balance.open_balance)}</td>
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => handleClinicPay(balance.clinic_id)}
                                                    disabled={processingClinicPay === balance.clinic_id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {t('Mark as Paid')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Payment Status Pills */}
                <div className="flex flex-wrap gap-3 animate-fade-in animate-delay-400">
                    <button
                        onClick={() => { setPaymentFilter(''); applyFilters(''); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${!paymentFilter ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800 border-gray-800 dark:border-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-gray-400 hover:shadow-sm'}`}
                    >
                        {t('All')} ({stats.unpaid_count + stats.partial_count + stats.paid_count})
                    </button>
                    <button
                        onClick={() => { setPaymentFilter('unpaid'); applyFilters('unpaid'); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${paymentFilter === 'unpaid' ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-red-400 hover:text-red-600 hover:shadow-sm'}`}
                    >
                        <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{t('Unpaid')} ({stats.unpaid_count})</span>
                    </button>
                    <button
                        onClick={() => { setPaymentFilter('partial'); applyFilters('partial'); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${paymentFilter === 'partial' ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 hover:shadow-sm'}`}
                    >
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{t('Partial')} ({stats.partial_count})</span>
                    </button>
                    <button
                        onClick={() => { setPaymentFilter('paid'); applyFilters('paid'); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${paymentFilter === 'paid' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 hover:shadow-sm'}`}
                    >
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />{t('Paid')} ({stats.paid_count})</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md animate-fade-in animate-delay-400">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('Search by Order ID, clinic, patient...')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>

                {/* Orders Table */}
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-400">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
                                    <th className="text-left py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('No.')}</th>
                                    <th className="text-left py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Clinic')}</th>
                                    <th className="text-left py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Patient')}</th>
                                    <th className="text-left py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Service')}</th>
                                    <th className="text-right py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Price')}</th>
                                    <th className="text-center py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Payment')}</th>
                                    <th className="text-center py-3 px-5 font-semibold text-gray-700 dark:text-gray-300">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                {orders.data.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="py-3 px-5 font-mono text-xs text-gray-500">#{order.id}</td>
                                        <td className="py-3 px-5 font-medium">{order.clinic?.name || '—'}</td>
                                        <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                                            {order.patient ? `${order.patient.first_name} ${order.patient.last_name}` : '—'}
                                        </td>
                                        <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{order.service?.name || '—'}</td>
                                        <td className="py-3 px-5 text-right font-semibold">{formatCurrency(order.final_price || order.price)}</td>
                                        <td className="py-3 px-5 text-center">
                                            <span className={`status-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadges[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                                                {paymentLabels[order.payment_status] || order.payment_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-center">
                                            <select
                                                value={order.payment_status}
                                                onChange={e => handlePaymentUpdate(order.id, e.target.value)}
                                                className="text-xs border border-gray-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="unpaid">{t('Unpaid')}</option>
                                                <option value="partial">{t('Partial')}</option>
                                                <option value="paid">{t('Paid')}</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="flex justify-center gap-1 p-4 border-t border-gray-100 dark:border-slate-700">
                            {orders.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${link.active
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                        : link.url
                                            ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </LabLayout>
    );
}
