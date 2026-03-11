import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface CalendarOrder {
    id: number; status: string; priority: string;
    due_date: string; is_overdue: boolean;
    patient: { first_name: string; last_name: string } | null;
    clinic: { name: string } | null;
    service: { name: string } | null;
}

interface Props {
    overdue: CalendarOrder[];
    dueToday: CalendarOrder[];
    dueThisWeek: CalendarOrder[];
    dueThisMonth: CalendarOrder[];
    upcoming: CalendarOrder[];
    calendarOrders: Record<string, { id: number; status: string; priority: string; patient: string; service: string | null }[]>;
    todayDate: string;
    currentMonth: number;
    currentYear: number;
}

const STATUS_DOT: Record<string, string> = {
    new: '#60ddc6', in_progress: '#818cf8', fitting: '#c084fc',
    finished: '#34d399', shipped: '#60ddc6',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function OrderRow({ order, showDate }: { order: CalendarOrder; showDate?: boolean }) {
    const dot = STATUS_DOT[order.status] ?? '#60ddc6';
    return (
        <Link href={route('lab.orders.show', order.id)}
            className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors group"
            style={{ borderColor: 'var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                        {order.patient ? `${order.patient.first_name} ${order.patient.last_name}` : `#${order.id}`}
                    </span>
                    {order.priority === 'urgent' && (
                        <span className="text-[10px] px-1.5 py-px rounded font-semibold"
                            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>urgent</span>
                    )}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                    {order.service?.name || '—'} · {order.clinic?.name || '—'}
                </p>
            </div>
            {showDate && (
                <span className="text-[11px] tabular-nums shrink-0"
                    style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-3)' }}>
                    {new Date(order.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
            )}
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--txt-3)' }} />
        </Link>
    );
}

function Section({
    title, count, orders, color, showDate = false, icon: Icon
}: {
    title: string; count: number; orders: CalendarOrder[];
    color: string; showDate?: boolean; icon: typeof Clock
}) {
    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color }} />
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{title}</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                    style={{ background: `${color}18`, color }}>
                    {count}
                </span>
            </div>
            {orders.length > 0 ? (
                orders.map(o => <OrderRow key={o.id} order={o} showDate={showDate} />)
            ) : (
                <p className="px-4 py-5 text-[12px] text-center" style={{ color: 'var(--txt-3)' }}>Nothing here</p>
            )}
        </div>
    );
}

export default function CalendarPage({
    overdue, dueToday, dueThisWeek, dueThisMonth, upcoming,
    calendarOrders, todayDate, currentMonth, currentYear
}: Props) {
    const { t } = useTranslation();

    // Build calendar grid
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    // Pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null);

    const todayDay = new Date(todayDate).getDate();

    const totalActive = overdue.length + dueToday.length + dueThisWeek.length + dueThisMonth.length;

    return (
        <LabLayout>
            <Head title={t('Schedule')} />
            <div className="flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Schedule')}</h2>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {totalActive} {t('orders require attention')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {overdue.length > 0 && (
                            <span className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                                style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                                <AlertTriangle size={13} /> {overdue.length} {t('overdue')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                    {/* ── Calendar grid (left) ── */}
                    <div className="xl:col-span-1 card p-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                {MONTHS[currentMonth - 1]} {currentYear}
                            </p>
                            <Calendar size={14} style={{ color: 'var(--txt-3)' }} />
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 mb-1">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[10px] font-semibold py-1"
                                    style={{ color: 'var(--txt-3)' }}>{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-y-1">
                            {cells.map((day, i) => {
                                if (!day) return <div key={i} />;
                                const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayOrders = calendarOrders[dateKey] || [];
                                const isToday = day === todayDay;
                                const hasOverdue = dayOrders.some(o => ['new','in_progress','fitting','finished','shipped'].includes(o.status) && new Date(dateKey) < new Date(todayDate));
                                return (
                                    <div key={i} className="relative flex flex-col items-center py-1 rounded-lg"
                                        style={isToday ? { background: 'var(--teal-10)' } : {}}>
                                        <span className="text-[11.5px] font-semibold"
                                            style={{ color: isToday ? 'var(--txt-accent)' : 'var(--txt-2)' }}>
                                            {day}
                                        </span>
                                        {dayOrders.length > 0 && (
                                            <div className="flex gap-px mt-0.5 flex-wrap justify-center max-w-full">
                                                {dayOrders.slice(0, 3).map((o, j) => (
                                                    <span key={j} className="w-1.5 h-1.5 rounded-full"
                                                        style={{ background: hasOverdue && new Date(dateKey) < new Date(todayDate) ? '#f87171' : STATUS_DOT[o.status] ?? '#60ddc6' }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                            {Object.entries({ 'New': '#60ddc6', 'In Progress': '#818cf8', 'Fitting': '#c084fc', 'Finished': '#34d399' }).map(([l, c]) => (
                                <div key={l} className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                    <span className="text-[10px]" style={{ color: 'var(--txt-3)' }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Lists (right) ── */}
                    <div className="xl:col-span-2 flex flex-col gap-3">
                        <Section title={t('Overdue')} count={overdue.length} orders={overdue}
                            color="#f87171" showDate icon={AlertTriangle} />
                        <Section title={t('Due Today')} count={dueToday.length} orders={dueToday}
                            color="var(--txt-accent)" icon={CheckCircle2} />
                        <Section title={t('This Week')} count={dueThisWeek.length} orders={dueThisWeek}
                            color="#818cf8" showDate icon={Calendar} />
                        <Section title={t('This Month')} count={dueThisMonth.length} orders={dueThisMonth}
                            color="#c084fc" showDate icon={Clock} />
                        {upcoming.length > 0 && (
                            <Section title={t('Upcoming')} count={upcoming.length} orders={upcoming}
                                color="#94a3b8" showDate icon={Clock} />
                        )}
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}
