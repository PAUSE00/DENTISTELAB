import { Link } from '@inertiajs/react';
import LabLayout from '@/Layouts/LabLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight, AlertCircle, Clock } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface KanbanOrder {
    id: number; status: string; priority: string;
    due_date: string | null; is_overdue: boolean;
    patient: { first_name: string; last_name: string } | null;
    clinic: { name: string } | null;
    service: { name: string } | null;
}

interface Column {
    status: string; label: string;
    orders: KanbanOrder[]; count: number;
}

interface Props { columns: Column[]; }

const STATUS_COLORS: Record<string, { accent: string; bg: string; dot: string }> = {
    new:         { accent: '#60ddc6', bg: 'rgba(96,221,198,0.08)',  dot: '#60ddc6' },
    in_progress: { accent: '#818cf8', bg: 'rgba(129,140,248,0.08)', dot: '#818cf8' },
    fitting:     { accent: '#c084fc', bg: 'rgba(192,132,252,0.08)', dot: '#c084fc' },
    finished:    { accent: '#34d399', bg: 'rgba(52,211,153,0.08)',  dot: '#34d399' },
    shipped:     { accent: '#60ddc6', bg: 'rgba(96,221,198,0.08)',  dot: '#60ddc6' },
};

function OrderCard({ order }: { order: KanbanOrder }) {
    return (
        <Link href={route('lab.orders.show', order.id)}
            className="block rounded-lg p-3 border transition-colors group"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--txt-accent)' }}>#{order.id}</span>
                    {order.priority === 'urgent' && (
                        <span className="text-[10px] font-semibold px-1.5 py-px rounded"
                            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>
                            urgent
                        </span>
                    )}
                    {order.is_overdue && (
                        <AlertCircle size={11} style={{ color: '#f87171' }} />
                    )}
                </div>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--txt-3)' }} />
            </div>

            {/* Patient */}
            {order.patient && (
                <p className="text-[12.5px] font-semibold mb-1" style={{ color: 'var(--txt-1)' }}>
                    {order.patient.first_name} {order.patient.last_name}
                </p>
            )}

            {/* Service + Clinic */}
            <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                {order.service?.name || '—'}
                {order.clinic && <span> · {order.clinic.name}</span>}
            </p>

            {/* Due date */}
            {order.due_date && (
                <div className="flex items-center gap-1 mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Clock size={10} style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-3)' }} />
                    <span className="text-[10.5px]"
                        style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-3)' }}>
                        {new Date(order.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                </div>
            )}
        </Link>
    );
}

export default function Kanban({ columns }: Props) {
    const { t } = useTranslation();
    const totalActive = columns.reduce((s, c) => s + c.count, 0);

    return (
        <LabLayout>
            <Head title={t('Production Board')} />

            <div className="flex flex-col gap-4 h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                            {t('Production Board')}
                        </h2>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {totalActive} {t('active orders')}
                        </p>
                    </div>
                    <Link href={route('lab.orders.index')} className="btn-ghost text-[12px]">
                        {t('All Orders')} <ChevronRight size={13} />
                    </Link>
                </div>

                {/* Kanban board */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar" style={{ minHeight: '70vh' }}>
                    {columns.map(col => {
                        const colors = STATUS_COLORS[col.status] ?? STATUS_COLORS.new;
                        return (
                            <div key={col.status}
                                className="flex-shrink-0 flex flex-col rounded-xl"
                                style={{
                                    width: '260px',
                                    background: colors.bg,
                                    border: `1px solid ${colors.accent}22`,
                                }}>

                                {/* Column header */}
                                <div className="flex items-center justify-between px-3 py-2.5 border-b"
                                    style={{ borderColor: `${colors.accent}22` }}>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full"
                                            style={{ background: colors.dot }} />
                                        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                            {t(col.label)}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold px-1.5 py-px rounded-md"
                                        style={{ background: colors.bg, color: colors.accent, border: `1px solid ${colors.accent}30` }}>
                                        {col.count}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto no-scrollbar">
                                    {col.orders.length > 0 ? (
                                        col.orders.map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center py-8">
                                            <p className="text-[11px] text-center" style={{ color: 'var(--txt-3)' }}>
                                                {t('No orders')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </LabLayout>
    );
}
