import { Link } from '@inertiajs/react';
import LabLayout from '@/Layouts/LabLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight, AlertTriangle, Clock, User, ArrowRight } from 'lucide-react';
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

const COLS: Record<string, { accent: string; bg: string; dot: string; border: string }> = {
    new:         { accent: '#60ddc6', bg: 'rgba(96,221,198,0.04)',  dot: '#60ddc6', border: 'rgba(96,221,198,0.15)' },
    in_progress: { accent: '#818cf8', bg: 'rgba(129,140,248,0.04)', dot: '#818cf8', border: 'rgba(129,140,248,0.15)' },
    fitting:     { accent: '#c084fc', bg: 'rgba(192,132,252,0.04)', dot: '#c084fc', border: 'rgba(192,132,252,0.15)' },
    finished:    { accent: '#34d399', bg: 'rgba(52,211,153,0.04)',  dot: '#34d399', border: 'rgba(52,211,153,0.15)' },
    shipped:     { accent: '#818cf8', bg: 'rgba(129,140,248,0.04)', dot: '#818cf8', border: 'rgba(129,140,248,0.15)' },
};

const AVATAR_COLORS = ['#4f6272','#5c5f7a','#4a6a5c','#6b5060','#4d6b6b','#5f5070'];
function avatarColor(s: string) {
    let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function OrderCard({ order }: { order: KanbanOrder }) {
    const initials = order.patient
        ? `${order.patient.first_name[0] || '?'}${order.patient.last_name[0] || '?'}`
        : '??';
    const bg = avatarColor(initials);

    return (
        <Link href={route('lab.orders.show', order.id)}
            className="group block rounded-xl p-3.5 transition-all"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>

            {/* Top: order id + badges */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold tabular-nums"
                        style={{ color: 'var(--txt-accent)' }}>#{order.id}</span>
                    {order.priority === 'urgent' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                            URGENT
                        </span>
                    )}
                    {order.is_overdue && (
                        <AlertTriangle size={11} color="#f87171" />
                    )}
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--txt-3)' }} />
            </div>

            {/* Patient row */}
            {order.patient && (
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: bg }}>
                        {initials}
                    </div>
                    <p className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--txt-1)' }}>
                        {order.patient.first_name} {order.patient.last_name}
                    </p>
                </div>
            )}

            {/* Service */}
            {order.service && (
                <p className="text-[11px] mb-1 truncate" style={{ color: 'var(--txt-3)' }}>
                    {order.service.name}
                </p>
            )}

            {/* Clinic */}
            {order.clinic && (
                <p className="text-[10.5px] truncate" style={{ color: 'var(--txt-3)' }}>
                    {order.clinic.name}
                </p>
            )}

            {/* Due date */}
            {order.due_date && (
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Clock size={10} style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-3)', flexShrink: 0 }} />
                    <span className="text-[10.5px] font-medium"
                        style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-3)' }}>
                        {new Date(order.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                    {order.is_overdue && (
                        <span className="text-[9px] font-bold ml-auto"
                            style={{ color: '#f87171' }}>OVERDUE</span>
                    )}
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

            <div className="flex flex-col gap-5 h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[17px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                            {t('Production Board')}
                        </h2>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {totalActive} {t('active orders')}
                        </p>
                    </div>
                    <Link href={route('lab.orders.index')}
                        className="flex items-center gap-1 text-[12px] font-medium transition-colors px-3 py-1.5 rounded-lg"
                        style={{ color: 'var(--txt-2)', border: '1px solid var(--border)', background: 'var(--surface)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-20)'; e.currentTarget.style.color = 'var(--txt-accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--txt-2)'; }}>
                        {t('All Orders')} <ChevronRight size={13} />
                    </Link>
                </div>

                {/* Board */}
                <div className="flex gap-3.5 overflow-x-auto pb-4 no-scrollbar flex-1" style={{ minHeight: '70vh', alignItems: 'flex-start' }}>
                    {columns.map(col => {
                        const c = COLS[col.status] ?? COLS.new;
                        return (
                            <div key={col.status}
                                className="flex-shrink-0 flex flex-col rounded-xl"
                                style={{
                                    width: '264px',
                                    background: c.bg,
                                    border: `1px solid ${c.border}`,
                                }}>

                                {/* Column header */}
                                <div className="flex items-center justify-between px-3.5 py-3 border-b"
                                    style={{ borderColor: c.border }}>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full shrink-0"
                                            style={{ background: c.dot, boxShadow: `0 0 6px ${c.dot}80` }} />
                                        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                            {t(col.label)}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: c.bg,
                                            color: c.accent,
                                            border: `1px solid ${c.border}`,
                                        }}>
                                        {col.count}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="flex flex-col gap-2 p-2.5 flex-1 overflow-y-auto no-scrollbar">
                                    {col.orders.length > 0 ? (
                                        col.orders.map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-20"
                                                style={{ background: c.dot }}>
                                                <User size={14} color="white" />
                                            </div>
                                            <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
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
