import LabLayout from '@/Layouts/LabLayout';
import { Link, Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle, Search, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Stats {
    total_revenue: number; pending_amount: number; monthly_revenue: number;
    unpaid_count: number; partial_count: number; paid_count: number;
}
interface Order {
    id: number; status: string; payment_status: string; price: number;
    final_price: number | null; created_at: string; paid_amount: number;
    patient?: { first_name: string; last_name: string };
    clinic?: { name: string };
    service?: { name: string };
}
interface ClinicBalance { clinic_id: number; clinic_name: string; open_balance: number; orders_count: number; }
interface Props extends PageProps {
    stats: Stats;
    clinic_balances: ClinicBalance[];
    orders: { data: Order[]; links: Array<{ url: string | null; label: string; active: boolean }>; };
    filters: { payment_status?: string; search?: string };
}

const PAYMENT: Record<string, { dot: string; text: string; bg: string; label: string }> = {
    unpaid:  { dot: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)',  label: 'Unpaid' },
    partial: { dot: '#f59e0b', text: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'Partial' },
    paid:    { dot: '#34d399', text: '#34d399', bg: 'rgba(52,211,153,0.1)',   label: 'Paid' },
};

export default function FinanceIndex({ auth, stats, clinic_balances, orders, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
    const [processingClinicPay, setProcessingClinicPay] = useState<number | null>(null);

    const fmt = (n: number) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(n);

    const applyFilters = (ps?: string) => {
        router.get(route('lab.finance.index'), {
            search: search || undefined,
            payment_status: (ps !== undefined ? ps : paymentFilter) || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const handlePaymentUpdate = (orderId: number, status: string) =>
        router.patch(route('lab.orders.update-payment', orderId), { payment_status: status });

    const handleClinicPay = (clinicId: number) => {
        if (!confirm(t('Are you sure you want to mark this balance as paid?'))) return;
        setProcessingClinicPay(clinicId);
        router.patch(route('lab.finance.clinic.pay', clinicId), {}, {
            preserveScroll: true, onFinish: () => setProcessingClinicPay(null),
        });
    };

    const statCards = [
        { icon: DollarSign, label: t('Total Revenue'),   value: fmt(stats.total_revenue),   color: '#34d399' },
        { icon: TrendingUp, label: t('Monthly Revenue'),  value: fmt(stats.monthly_revenue),  color: 'var(--txt-accent)' },
        { icon: Clock,      label: t('Pending Amount'),   value: fmt(stats.pending_amount),   color: '#f59e0b' },
    ];

    const filterBtns = [
        { key: '', label: `${t('All')} (${stats.unpaid_count + stats.partial_count + stats.paid_count})` },
        { key: 'unpaid',  label: `${t('Unpaid')} (${stats.unpaid_count})` },
        { key: 'partial', label: `${t('Partial')} (${stats.partial_count})` },
        { key: 'paid',    label: `${t('Paid')} (${stats.paid_count})` },
    ];

    return (
        <LabLayout>
            <Head title={t('Finance')} />
            <div className="flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Finance & Payments')}</h2>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{t('Track billing and payments')}</p>
                    </div>
                    <a href={route('lab.export.finance')} className="btn-ghost">
                        <Download size={13} /> {t('Export CSV')}
                    </a>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {statCards.map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="card p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${color}18`, color }}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{label}</p>
                                <p className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clinic balances */}
                {clinic_balances && clinic_balances.length > 0 && (
                    <div className="card overflow-hidden">
                        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                            <DollarSign size={13} style={{ color: 'var(--txt-accent)' }} />
                            <p className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                {t('Clinic Balances')}
                            </p>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('Clinic')}</th>
                                    <th>{t('Open Orders')}</th>
                                    <th className="text-right">{t('Balance')}</th>
                                    <th>{t('Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clinic_balances.map(balance => (
                                    <tr key={balance.clinic_id}>
                                        <td><span className="font-medium text-[13px]" style={{ color: 'var(--txt-1)' }}>{balance.clinic_name}</span></td>
                                        <td>
                                            <span className="status-pill" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderColor: 'transparent' }}>
                                                <span className="dot" style={{ background: '#f59e0b' }} />
                                                {balance.orders_count}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <span className="font-semibold" style={{ color: 'var(--txt-1)' }}>{fmt(balance.open_balance)}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleClinicPay(balance.clinic_id)}
                                                disabled={processingClinicPay === balance.clinic_id}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold disabled:opacity-40 transition-colors"
                                                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                                                <CheckCircle2 size={12} /> {t('Mark Paid')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Payment filter pills + search */}
                <div className="flex flex-wrap items-center gap-2">
                    {filterBtns.map(({ key, label }) => (
                        <button key={key}
                            onClick={() => { setPaymentFilter(key); applyFilters(key); }}
                            className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
                            style={paymentFilter === key
                                ? { background: 'var(--teal-10)', border: '1px solid var(--teal-20)', color: 'var(--txt-accent)' }
                                : { background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-2)' }}>
                            {label}
                        </button>
                    ))}
                    <div className="relative ml-auto">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} />
                        <input type="text" placeholder={t('Search...')} value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            className="app-input pl-8" style={{ width: '220px' }} />
                    </div>
                </div>

                {/* Orders table */}
                <div className="card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{t('Clinic')}</th>
                                <th>{t('Patient')}</th>
                                <th className="text-right">{t('Total Price')}</th>
                                <th className="text-right text-emerald-500">{t('Paid')}</th>
                                <th className="text-right text-rose-500">{t('Balance')}</th>
                                <th>{t('Status')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map(order => {
                                const ps = PAYMENT[order.payment_status] ?? PAYMENT.unpaid;
                                const total = order.final_price ?? order.price;
                                const remaining = total - (order.paid_amount || 0);

                                return (
                                    <tr key={order.id}>
                                        <td><span className="tabular-nums font-bold" style={{ color: 'var(--txt-accent)' }}>#{order.id}</span></td>
                                        <td><span style={{ color: 'var(--txt-2)' }}>{order.clinic?.name || '—'}</span></td>
                                        <td><span style={{ color: 'var(--txt-2)' }}>{order.patient ? `${order.patient.first_name} ${order.patient.last_name}` : '—'}</span></td>
                                        <td className="text-right">
                                            <span style={{ color: 'var(--txt-1)' }}>{fmt(total)}</span>
                                        </td>
                                        <td className="text-right font-bold text-emerald-500">
                                            {fmt(order.paid_amount || 0)}
                                        </td>
                                        <td className="text-right font-black" style={{ color: remaining > 0 ? '#f87171' : 'var(--txt-3)' }}>
                                            {fmt(remaining)}
                                        </td>
                                        <td>
                                            <span className="status-pill" style={{ background: ps.bg, color: ps.text, borderColor: 'transparent' }}>
                                                <span className="dot" style={{ background: ps.dot }} />
                                                {t(ps.label)}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={route('lab.orders.show', order.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--txt-3)' }}>
                                                <ExternalLink size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {orders.links && orders.links.length > 3 && (
                        <div className="flex justify-center gap-1 p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                            {orders.links.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    className="px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors"
                                    style={link.active
                                        ? { background: 'var(--txt-accent)', color: 'var(--bg)' }
                                        : { color: 'var(--txt-3)', opacity: link.url ? 1 : 0.4 }}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </LabLayout>
    );
}
