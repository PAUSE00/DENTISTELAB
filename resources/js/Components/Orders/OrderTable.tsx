import { Link, router } from '@inertiajs/react';
import { ChevronRight, Package, X, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';
import { OrderListItem } from '@/types/order';

const STATUS: Record<string, { dot: string; text: string; bg: string; label: string }> = {
    new:         { dot: '#60ddc6', text: 'var(--txt-accent)', bg: 'rgba(96,221,198,0.1)',  label: 'New' },
    in_progress: { dot: '#818cf8', text: '#818cf8',           bg: 'rgba(129,140,248,0.1)', label: 'In Progress' },
    fitting:     { dot: '#c084fc', text: '#c084fc',           bg: 'rgba(192,132,252,0.1)', label: 'Fitting' },
    finished:    { dot: '#34d399', text: '#34d399',           bg: 'rgba(52,211,153,0.1)',  label: 'Finished' },
    shipped:     { dot: '#60ddc6', text: 'var(--txt-accent)', bg: 'rgba(96,221,198,0.1)',  label: 'Shipped' },
    delivered:   { dot: '#34d399', text: '#34d399',           bg: 'rgba(52,211,153,0.1)',  label: 'Delivered' },
    rejected:    { dot: '#f87171', text: '#f87171',           bg: 'rgba(248,113,113,0.1)', label: 'Rejected' },
    cancelled:   { dot: '#f87171', text: '#f87171',           bg: 'rgba(248,113,113,0.1)', label: 'Cancelled' },
    archived:    { dot: '#94a3b8', text: '#94a3b8',           bg: 'rgba(148,163,184,0.1)', label: 'Archived' },
};

// Next logical status transitions per current status
const NEXT_STATUSES: Record<string, { value: string; label: string; color: string }[]> = {
    new:         [{ value: 'in_progress', label: 'Start Production', color: '#818cf8' }, { value: 'rejected', label: 'Reject', color: '#f87171' }],
    in_progress: [{ value: 'fitting',     label: 'Send for Fitting', color: '#c084fc' }, { value: 'finished', label: 'Mark Finished', color: '#34d399' }],
    fitting:     [{ value: 'finished',    label: 'Mark Finished',    color: '#34d399' }],
    finished:    [{ value: 'shipped',     label: 'Mark Shipped',     color: '#60ddc6' }],
    shipped:     [{ value: 'delivered',   label: 'Mark Delivered',   color: '#34d399' }],
};

interface QuickStatusProps {
    orderId: number;
    currentStatus: string;
    variant: 'lab' | 'clinic';
}

function QuickStatus({ orderId, currentStatus, variant }: QuickStatusProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const nexts = NEXT_STATUSES[currentStatus] ?? [];

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    if (nexts.length === 0 || variant !== 'lab') return null;

    const updateStatus = (status: string) => {
        setOpen(false);
        router.patch(route('lab.orders.update-status', orderId), { status }, { preserveScroll: true });
    };

    return (
        <div ref={ref} className="relative" onClick={e => e.stopPropagation()}>
            <button
                onClick={() => setOpen(!open)}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: open ? 'var(--txt-accent)' : 'var(--txt-3)' }}
                title={t('Quick status update')}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--txt-accent)')}
                onMouseLeave={e => !open && (e.currentTarget.style.color = 'var(--txt-3)')}>
                <Zap size={13} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[170px] rounded-lg shadow-2xl overflow-hidden"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}>
                    <p className="px-3 py-1.5 text-[10.5px] font-semibold border-b"
                        style={{ color: 'var(--txt-3)', borderColor: 'var(--border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {t('Move to')}
                    </p>
                    {nexts.map(n => (
                        <button key={n.value}
                            onClick={() => updateStatus(n.value)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[12.5px] font-medium transition-colors"
                            style={{ color: 'var(--txt-2)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = n.color; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-2)'; }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n.color }} />
                            {t(n.label)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface OrderTableProps {
    orders: { data: OrderListItem[]; links: any[]; total?: number; };
    selectedOrders: number[];
    variant: 'lab' | 'clinic';
    showRoute: (id: number) => string;
    onToggleSelectAll: () => void;
    onToggleSelect: (id: number) => void;
    bulkActions: React.ReactNode;
}

export default function OrderTable({ orders, selectedOrders, variant, showRoute, onToggleSelectAll, onToggleSelect, bulkActions }: OrderTableProps) {
    const { t } = useTranslation();

    return (
        <>
            {selectedOrders.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border"
                    style={{ background: 'var(--teal-10)', borderColor: 'var(--teal-20)' }}>
                    <span className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-accent)' }}>
                        {selectedOrders.length} {t('orders selected')}
                    </span>
                    <div className="flex items-center gap-2">
                        {bulkActions}
                        <button onClick={onToggleSelectAll} className="p-1.5 rounded"
                            style={{ color: 'var(--txt-3)' }}>
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="w-10">
                                    <input type="checkbox"
                                        checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
                                        onChange={onToggleSelectAll}
                                        style={{ accentColor: 'var(--txt-accent)' }} />
                                </th>
                                <th>#</th>
                                <th>{t('Patient')}</th>
                                <th>{variant === 'lab' ? t('Clinic') : t('Lab')} / {t('Service')}</th>
                                <th>{t('Status')}</th>
                                <th>{t('Due Date')}</th>
                                <th>{t('Priority')}</th>
                                <th className="w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length > 0 ? orders.data.map((order) => {
                                const s = STATUS[order.status] ?? STATUS.new;
                                const counterpartyName = variant === 'lab' ? order.clinic?.name : order.lab?.name;
                                const isSelected = selectedOrders.includes(order.id);

                                return (
                                    <tr key={order.id} style={isSelected ? { background: 'var(--teal-10)' } : {}}>
                                        <td>
                                            <input type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleSelect(order.id)}
                                                style={{ accentColor: 'var(--txt-accent)' }} />
                                        </td>
                                        <td>
                                            <span className="font-semibold tabular-nums" style={{ color: 'var(--txt-accent)' }}>
                                                #{order.id}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                                                    {order.patient.first_name[0]}{order.patient.last_name[0]}
                                                </div>
                                                <span className="font-medium text-[12.5px]" style={{ color: 'var(--txt-1)' }}>
                                                    {order.patient.first_name} {order.patient.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-[12.5px] font-medium" style={{ color: 'var(--txt-1)' }}>
                                                {counterpartyName || '—'}
                                            </p>
                                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                                {order.service.name}
                                            </p>
                                        </td>
                                        <td>
                                            <span className="status-pill" style={{ background: s.bg, color: s.text, borderColor: 'transparent' }}>
                                                <span className="dot" style={{ background: s.dot }} />
                                                {t(s.label)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-[12.5px]"
                                                style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-2)' }}>
                                                {order.due_date ? new Date(order.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </span>
                                            {order.is_overdue && (
                                                <p className="text-[10px] font-semibold" style={{ color: '#f87171' }}>Overdue</p>
                                            )}
                                        </td>
                                        <td>
                                            {order.priority === 'urgent' ? (
                                                <span className="priority-chip" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>urgent</span>
                                            ) : (
                                                <span className="priority-chip" style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}>normal</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-0.5">
                                                {/* Quick status — lab only */}
                                                <QuickStatus orderId={order.id} currentStatus={order.status} variant={variant} />

                                                <Link href={showRoute(order.id)}
                                                    className="p-1.5 rounded-md transition-colors inline-flex"
                                                    style={{ color: 'var(--txt-3)' }}
                                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--txt-accent)')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
                                                    <ChevronRight size={15} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center" style={{ color: 'var(--txt-3)' }}>
                                        <Package size={32} className="mx-auto mb-3 opacity-40" />
                                        <p className="text-[13px] font-medium">{t('No Orders Found')}</p>
                                        <p className="text-[11px] mt-1">{t('Adjust your filters or create a new order.')}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {orders.links && orders.links.length > 3 && (
                    <div className="px-4 py-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                            {orders.total} {t('total orders')}
                        </p>
                        <Pagination links={orders.links} />
                    </div>
                )}
            </div>
        </>
    );
}
