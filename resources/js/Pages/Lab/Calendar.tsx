import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalIcon, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState, useMemo } from 'react';

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

const SC: Record<string, { bg: string; solid: string; text: string; glow: string }> = {
    new:         { bg: 'rgba(96,221,198,0.12)',  solid: '#60ddc6', text: '#60ddc6', glow: 'rgba(96,221,198,0.3)' },
    in_progress: { bg: 'rgba(129,140,248,0.14)', solid: '#818cf8', text: '#818cf8', glow: 'rgba(129,140,248,0.3)' },
    fitting:     { bg: 'rgba(192,132,252,0.14)', solid: '#c084fc', text: '#c084fc', glow: 'rgba(192,132,252,0.3)' },
    finished:    { bg: 'rgba(52,211,153,0.12)',  solid: '#34d399', text: '#34d399', glow: 'rgba(52,211,153,0.3)' },
    shipped:     { bg: 'rgba(96,221,198,0.12)',  solid: '#60ddc6', text: '#60ddc6', glow: 'rgba(96,221,198,0.3)' },
};
const FB = SC.new;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmtKey(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function isSame(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getWeek(base: Date): Date[] {
    const dow = base.getDay();
    const mon = new Date(base); mon.setDate(base.getDate() - dow + 1);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
}

type ViewMode = 'week' | 'month' | 'agenda';
const VIEW_TABS: { key: ViewMode; label: string }[] = [
    { key: 'month',  label: 'Month'  },
    { key: 'week',   label: 'Week'   },
    { key: 'agenda', label: 'Agenda' },
];

function StatusBadge({ status }: { status: string }) {
    const c = SC[status] ?? FB;
    return (
        <span className="text-[9px] font-black uppercase px-1.5 py-[2px] rounded-[3px] tracking-wide leading-none"
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.solid}30` }}>
            {status.replace('_', ' ')}
        </span>
    );
}

function EventCard({ o, compact = false }: { o: { id: number; status: string; patient: string; service: string | null; priority: string }, compact?: boolean }) {
    const c = SC[o.status] ?? FB;
    return (
        <Link href={route('lab.orders.show', o.id)}
            className="block rounded-lg overflow-hidden transition-all group"
            style={{ background: c.bg, borderLeft: `3px solid ${c.solid}` }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${c.glow}`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            <div className={compact ? 'px-2 py-1' : 'px-2.5 py-2'}>
                <p className={`font-black truncate leading-tight ${compact ? 'text-[10px]' : 'text-[11px]'}`} style={{ color: c.text }}>
                    {o.patient || `#${o.id}`}
                </p>
                {!compact && o.service && (
                    <p className="text-[9.5px] truncate mt-0.5 font-semibold" style={{ color: c.text, opacity: 0.7 }}>{o.service}</p>
                )}
                {!compact && (
                    <div className="flex items-center gap-1 mt-1.5">
                        <StatusBadge status={o.status} />
                        {o.priority === 'urgent' && (
                            <span className="text-[9px] font-black px-1.5 py-[2px] rounded-[3px]"
                                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>!</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

function AgendaOrderRow({ o }: { o: CalendarOrder }) {
    const c = SC[o.status] ?? FB;
    return (
        <Link href={route('lab.orders.show', o.id)}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.solid; e.currentTarget.style.background = c.bg; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.solid, boxShadow: `0 0 8px ${c.glow}` }} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-black" style={{ color: 'var(--txt-1)' }}>
                        {o.patient ? `${o.patient.first_name} ${o.patient.last_name}` : `Order #${o.id}`}
                    </span>
                    {o.priority === 'urgent' && (
                        <span className="text-[9.5px] font-black px-2 py-[2px] rounded"
                            style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>URGENT</span>
                    )}
                </div>
                <p className="text-[11.5px] font-medium mt-0.5" style={{ color: 'var(--txt-3)' }}>
                    {o.service?.name || '—'} &middot; {o.clinic?.name || '—'}
                </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={o.status} />
                <span className="text-[11px] font-bold" style={{ color: o.is_overdue ? '#f87171' : 'var(--txt-3)' }}>
                    {new Date(o.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
            </div>
        </Link>
    );
}

export default function CalendarPage({
    overdue, dueToday, dueThisWeek, dueThisMonth, upcoming,
    calendarOrders, todayDate, currentMonth, currentYear
}: Props) {
    const { t } = useTranslation();
    const today = useMemo(() => new Date(todayDate), [todayDate]);

    const [view, setView]         = useState<ViewMode>('week');
    const [weekBase, setWeekBase] = useState<Date>(today);
    const [miniMonth, setMiniMonth] = useState({ m: today.getMonth(), y: today.getFullYear() });
    const [rightTab, setRightTab] = useState<'overdue'|'today'|'week'|'month'>('overdue');

    // Week navigation
    const weekDays = useMemo(() => getWeek(weekBase), [weekBase]);
    const prevWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d); };
    const nextWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d); };
    const prevMonth = () => miniMonth.m === 0 ? setMiniMonth({ m: 11, y: miniMonth.y - 1 }) : setMiniMonth({ m: miniMonth.m - 1, y: miniMonth.y });
    const nextMonth = () => miniMonth.m === 11 ? setMiniMonth({ m: 0, y: miniMonth.y + 1 }) : setMiniMonth({ m: miniMonth.m + 1, y: miniMonth.y });
    const goToday  = () => { setWeekBase(today); setMiniMonth({ m: today.getMonth(), y: today.getFullYear() }); };
    const prevNav  = () => view === 'month' ? prevMonth() : prevWeek();
    const nextNav  = () => view === 'month' ? nextMonth() : nextWeek();

    // Mini calendar
    const miniFirst = new Date(miniMonth.y, miniMonth.m, 1).getDay();
    const miniDays  = new Date(miniMonth.y, miniMonth.m + 1, 0).getDate();
    const miniCells: (number|null)[] = [
        ...Array(miniFirst).fill(null),
        ...Array.from({ length: miniDays }, (_, i) => i + 1)
    ];
    while (miniCells.length % 7 !== 0) miniCells.push(null);

    // Month view
    const monthFirst = new Date(miniMonth.y, miniMonth.m, 1).getDay();
    const monthDays  = new Date(miniMonth.y, miniMonth.m + 1, 0).getDate();
    const monthCells: (number|null)[] = [
        ...Array(monthFirst).fill(null),
        ...Array.from({ length: monthDays }, (_, i) => i + 1)
    ];
    while (monthCells.length % 7 !== 0) monthCells.push(null);

    // Agenda
    const allOrders = [...overdue, ...dueToday, ...dueThisWeek, ...dueThisMonth, ...upcoming];
    const agendaMap = useMemo(() => {
        const m: Record<string, CalendarOrder[]> = {};
        allOrders.forEach(o => { const k = o.due_date.split('T')[0]; (m[k] = m[k] || []).push(o); });
        return Object.entries(m).sort(([a],[b]) => a.localeCompare(b));
    }, [allOrders]);

    const ws = weekDays[0], we = weekDays[6];
    const weekLabel = view === 'month'
        ? `${MONTHS[miniMonth.m]} ${miniMonth.y}`
        : ws.getMonth() === we.getMonth()
            ? `${MONTHS[ws.getMonth()]} ${ws.getFullYear()}`
            : `${MONTHS_S[ws.getMonth()]} – ${MONTHS_S[we.getMonth()]} ${we.getFullYear()}`;

    return (
        <LabLayout fullBleed>
            <Head title={t('Schedule')} />

            <div className="flex h-full overflow-hidden" style={{ background: 'var(--bg)' }}>

                {/* ══════════════════════════════
                    LEFT COLUMN
                ══════════════════════════════ */}
                <aside className="w-[200px] shrink-0 flex flex-col border-r overflow-y-auto no-scrollbar"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>

                    {/* Mini calendar */}
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <button onClick={() => miniMonth.m === 0 ? setMiniMonth({ m:11, y: miniMonth.y-1 }) : setMiniMonth({ m: miniMonth.m-1, y: miniMonth.y })}
                                className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                                style={{ color: 'var(--txt-3)' }}
                                onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-hover)')}
                                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                <ChevronLeft size={13}/>
                            </button>
                            <span className="text-[11.5px] font-black" style={{ color: 'var(--txt-1)' }}>
                                {MONTHS[miniMonth.m].slice(0,3)} {miniMonth.y}
                            </span>
                            <button onClick={() => miniMonth.m === 11 ? setMiniMonth({ m:0, y: miniMonth.y+1 }) : setMiniMonth({ m: miniMonth.m+1, y: miniMonth.y })}
                                className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                                style={{ color: 'var(--txt-3)' }}
                                onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-hover)')}
                                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                <ChevronRight size={13}/>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 mb-1">
                            {DAYS_S.map(d => (
                                <div key={d} className="text-center text-[9px] font-black py-0.5" style={{ color: 'var(--txt-3)' }}>{d[0]}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-0.5">
                            {miniCells.map((day, i) => {
                                if (!day) return <div key={i} />;
                                const d = new Date(miniMonth.y, miniMonth.m, day);
                                const isToday = isSame(d, today);
                                const dk = fmtKey(d);
                                const has = !!(calendarOrders[dk]?.length);
                                const inWeek = weekDays.some(wd => isSame(wd, d));
                                return (
                                    <button key={i} onClick={() => { setWeekBase(d); }}
                                        className="relative flex flex-col items-center justify-center h-7 rounded-full text-[11px] font-bold transition-all"
                                        style={{
                                            background: isToday ? 'linear-gradient(135deg,#6638b4,#60ddc6)' : inWeek ? 'var(--surface-hover)' : 'transparent',
                                            color: isToday ? '#fff' : inWeek ? 'var(--txt-1)' : 'var(--txt-2)',
                                        }}>
                                        {day}
                                        {has && !isToday && (
                                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: 'var(--teal)' }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-3" style={{ height: 1, background: 'var(--border)' }} />

                    {/* Stats */}
                    <div className="p-3 flex flex-col gap-2">
                        {([ 
                            { icon: AlertTriangle, count: overdue.length, label: 'Overdue', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
                            { icon: CheckCircle2, count: dueToday.length, label: 'Today', color: '#60ddc6', bg: 'var(--teal-10)', border: 'rgba(96,221,198,0.25)' },
                            { icon: Clock, count: dueThisWeek.length, label: 'This Week', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
                            { icon: TrendingUp, count: dueThisMonth.length, label: 'This Month', color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' },
                        ] as const).map(({ icon: Icon, count, label, color, bg, border }) => (
                            <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                                style={{ background: bg, border: `1px solid ${border}` }}>
                                <Icon size={12} style={{ color, flexShrink: 0 }} />
                                <div className="flex items-center justify-between flex-1 min-w-0">
                                    <span className="text-[11px] font-semibold truncate" style={{ color }}>{label}</span>
                                    <span className="text-[12px] font-black ml-1" style={{ color }}>{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="px-3 pb-4">
                        <p className="text-[9.5px] font-black tracking-widest uppercase mb-2 px-1" style={{ color: 'var(--txt-3)' }}>Status</p>
                        {([['New','#60ddc6'],['In Progress','#818cf8'],['Fitting','#c084fc'],['Finished','#34d399'],['Shipped','#60ddc6']] as const).map(([l,c]) => (
                            <div key={l} className="flex items-center gap-2 py-1 px-1">
                                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c }} />
                                <span className="text-[11px] font-medium" style={{ color: 'var(--txt-2)' }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ══════════════════════════════
                    CENTER MAIN
                ══════════════════════════════ */}
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-5 h-14 border-b shrink-0"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        <div className="flex items-center gap-2">
                            <button onClick={goToday}
                                className="px-3.5 py-1.5 rounded-xl text-[12px] font-black border transition-all"
                                style={{ borderColor: 'var(--border-strong)', color: 'var(--txt-1)', background: 'var(--bg)' }}
                                onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--teal)')}
                                onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border-strong)')}>
                                Today
                            </button>
                            <div className="flex items-center">
                                <button onClick={prevNav}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: 'var(--txt-2)' }}
                                    onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-hover)')}
                                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                    <ChevronLeft size={17}/>
                                </button>
                                <button onClick={nextNav}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: 'var(--txt-2)' }}
                                    onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-hover)')}
                                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                    <ChevronRight size={17}/>
                                </button>
                            </div>
                            <h2 className="text-[16px] font-black" style={{ color: 'var(--txt-1)' }}>{weekLabel}</h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
                            {VIEW_TABS.map(tab => (
                                <button key={tab.key} onClick={() => setView(tab.key)}
                                    className="px-4 py-1.5 rounded-lg text-[12px] font-black transition-all"
                                    style={{
                                        background: view === tab.key ? 'linear-gradient(135deg,#6638b4,#60ddc6)' : 'transparent',
                                        color: view === tab.key ? '#fff' : 'var(--txt-2)',
                                    }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── WEEK VIEW ── */}
                    {view === 'week' && (
                        <div className="flex-1 overflow-auto no-scrollbar flex flex-col">
                            {/* Day header row */}
                            <div className="grid grid-cols-7 border-b sticky top-0 z-10"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                {weekDays.map((d, i) => {
                                    const isToday = isSame(d, today);
                                    const dk = fmtKey(d);
                                    const cnt = (calendarOrders[dk] || []).length;
                                    return (
                                        <div key={i}
                                            className="flex flex-col items-center py-3 border-r last:border-r-0 gap-1"
                                            style={{ borderColor: 'var(--border)' }}>
                                            <span className="text-[10px] font-black tracking-wider"
                                                style={{ color: isToday ? 'var(--teal)' : 'var(--txt-3)' }}>
                                                {DAYS_S[d.getDay()].toUpperCase()}
                                            </span>
                                            <span className="w-9 h-9 flex items-center justify-center rounded-full text-[17px] font-black mb-0.5"
                                                style={{
                                                    background: isToday ? 'linear-gradient(135deg,#6638b4,#60ddc6)' : 'transparent',
                                                    color: isToday ? '#fff' : 'var(--txt-1)',
                                                    boxShadow: isToday ? '0 4px 14px rgba(102,56,180,0.4)' : 'none'
                                                }}>
                                                {d.getDate()}
                                            </span>
                                            {cnt > 0 && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                                                    style={{ background: isToday ? 'rgba(96,221,198,0.15)' : 'var(--surface-hover)', color: isToday ? '#60ddc6' : 'var(--txt-3)' }}>
                                                    {cnt} order{cnt!==1?'s':''}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Events area */}
                            <div className="grid grid-cols-7 flex-1">
                                {weekDays.map((d, i) => {
                                    const dk = fmtKey(d);
                                    const orders = calendarOrders[dk] || [];
                                    const isToday = isSame(d, today);
                                    const isPast  = d < today && !isToday;
                                    return (
                                        <div key={i} className="border-r last:border-r-0 p-2 min-h-[420px]"
                                            style={{
                                                borderColor: 'var(--border)',
                                                background: isToday ? 'rgba(102,56,180,0.03)' : 'transparent'
                                            }}>
                                            {orders.length === 0 ? (
                                                <div className="flex items-center justify-center h-20 opacity-30">
                                                    <span className="text-[10px]" style={{ color: 'var(--txt-3)' }}>—</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    {orders.map((o, oi) => (
                                                        <EventCard key={oi} o={o} compact={orders.length > 3} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── MONTH VIEW ── */}
                    {view === 'month' && (
                        <div className="flex-1 overflow-auto no-scrollbar flex flex-col">
                            <div className="grid grid-cols-7 border-b"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                {DAYS_S.map(d => (
                                    <div key={d} className="text-center text-[10.5px] font-black py-2.5 border-r last:border-r-0 tracking-wide"
                                        style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>{d.toUpperCase()}</div>
                                ))}
                            </div>
                            <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: '1fr' }}>
                                {monthCells.map((day, i) => {
                                    if (!day) return (
                                        <div key={i} className="border-r border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)', opacity: 0.5 }} />
                                    );
                                    const d = new Date(miniMonth.y, miniMonth.m, day);
                                    const dk = fmtKey(d);
                                    const dayOrds = calendarOrders[dk] || [];
                                    const isToday = isSame(d, today);
                                    const isPast  = d < today && !isToday;
                                    return (
                                        <div key={i}
                                            className="border-r border-b last:border-r-0 p-2 min-h-[100px] cursor-pointer transition-colors"
                                            style={{ borderColor: 'var(--border)', background: isToday ? 'rgba(102,56,180,0.04)' : 'transparent' }}
                                            onClick={() => { setWeekBase(d); setView('week'); }}
                                            onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-hover)')}
                                            onMouseLeave={e=>(e.currentTarget.style.background=isToday?'rgba(102,56,180,0.04)':'transparent')}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="w-7 h-7 flex items-center justify-center rounded-full text-[12.5px] font-black"
                                                    style={{
                                                        background: isToday ? 'linear-gradient(135deg,#6638b4,#60ddc6)' : 'transparent',
                                                        color: isToday ? '#fff' : isPast ? 'var(--txt-3)' : 'var(--txt-1)',
                                                    }}>{day}</span>
                                                {dayOrds.length > 0 && (
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                                                        style={{ background: 'var(--purple-10)', color: 'var(--purple)' }}>{dayOrds.length}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                {dayOrds.slice(0, 2).map((o, oi) => {
                                                    const c = SC[o.status] ?? FB;
                                                    return (
                                                        <span key={oi} className="block truncate text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                                                            style={{ background: c.bg, color: c.text }}>
                                                            {o.patient||`#${o.id}`}
                                                        </span>
                                                    );
                                                })}
                                                {dayOrds.length > 2 && (
                                                    <span className="text-[9.5px] font-bold pl-1.5" style={{ color: 'var(--txt-3)' }}>+{dayOrds.length-2} more</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── AGENDA VIEW ── */}
                    {view === 'agenda' && (
                        <div className="flex-1 overflow-auto no-scrollbar p-5 flex flex-col gap-5">
                            {agendaMap.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-24 gap-3">
                                    <CalIcon size={40} style={{ color: 'var(--txt-3)', opacity: 0.4 }} />
                                    <p className="text-[14px] font-semibold" style={{ color: 'var(--txt-3)' }}>No upcoming orders</p>
                                </div>
                            )}
                            {agendaMap.map(([dk, orders]) => {
                                const d = new Date(dk);
                                const isToday = isSame(d, today);
                                const isPast  = d < today && !isToday;
                                return (
                                    <div key={dk}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-black"
                                                style={{
                                                    background: isToday ? 'linear-gradient(135deg,#6638b4,#60ddc6)' : isPast ? 'rgba(248,113,113,0.1)' : 'var(--surface)',
                                                    color: isToday ? '#fff' : isPast ? '#f87171' : 'var(--txt-1)',
                                                    border: isToday ? 'none' : '1px solid var(--border)',
                                                    boxShadow: isToday ? '0 4px 14px rgba(102,56,180,0.35)' : 'none',
                                                }}>
                                                <span className="text-[16px] leading-none">{d.getDate()}</span>
                                                <span className="text-[8px] font-black">{MONTHS_S[d.getMonth()].toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black" style={{ color: isPast ? '#f87171' : 'var(--txt-1)' }}>
                                                    {DAYS_S[d.getDay()]}, {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
                                                    {isPast && <span className="ml-2 text-[10px] font-bold">(Overdue)</span>}
                                                    {isToday && <span className="ml-2 text-[10px] font-bold" style={{ color: '#60ddc6' }}>Today</span>}
                                                </p>
                                                <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>
                                                    {orders.length} order{orders.length !== 1 ? 's' : ''} due
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-14 flex flex-col gap-2">
                                            {orders.map(o => <AgendaOrderRow key={o.id} o={o} />)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ══════════════════════════════
                    RIGHT: Multi-section Sidebar
                ══════════════════════════════ */}
                <aside className="w-[290px] shrink-0 flex flex-col border-l overflow-hidden"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>

                    {/* Tab header */}
                    <div className="shrink-0 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="grid grid-cols-4">
                            {([
                                { key: 'overdue' as const, label: 'Overdue', count: overdue.length, color: '#f87171' },
                                { key: 'today'   as const, label: 'Today',   count: dueToday.length, color: '#60ddc6' },
                                { key: 'week'    as const, label: 'Week',    count: dueThisWeek.length, color: '#818cf8' },
                                { key: 'month'   as const, label: 'Month',   count: dueThisMonth.length, color: '#c084fc' },
                            ]).map(tab => (
                                <button key={tab.key} onClick={() => setRightTab(tab.key)}
                                    className="flex flex-col items-center py-2.5 gap-0.5 border-b-2 transition-all"
                                    style={{
                                        borderBottomColor: rightTab === tab.key ? tab.color : 'transparent',
                                        background: rightTab === tab.key ? `${tab.color}08` : 'transparent',
                                    }}>
                                    <span className="text-[11px] font-black" style={{ color: rightTab === tab.key ? tab.color : 'var(--txt-3)' }}>
                                        {tab.count}
                                    </span>
                                    <span className="text-[9.5px] font-semibold" style={{ color: rightTab === tab.key ? tab.color : 'var(--txt-3)' }}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-2">
                        {(() => {
                            const lists: Record<string, CalendarOrder[]> = {
                                overdue, today: dueToday, week: dueThisWeek, month: dueThisMonth
                            };
                            const colors: Record<string, string> = {
                                overdue: '#f87171', today: '#60ddc6', week: '#818cf8', month: '#c084fc'
                            };
                            const emptyMsgs: Record<string, string> = {
                                overdue: 'No overdue orders 🎉',
                                today:   'Nothing due today ✓',
                                week:    'Clear this week 👌',
                                month:   'No orders this month',
                            };
                            const items = lists[rightTab] ?? [];
                            const accentColor = colors[rightTab];
                            if (items.length === 0) return (
                                <div className="flex flex-col items-center justify-center py-16 gap-2">
                                    <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-3)' }}>{emptyMsgs[rightTab]}</p>
                                </div>
                            );
                            return items.map(o => {
                                const c = SC[o.status] ?? FB;
                                return (
                                    <Link key={o.id} href={route('lab.orders.show', o.id)}
                                        className="block rounded-xl p-3.5 border transition-all"
                                        style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = 'translateX(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <p className="text-[12.5px] font-black leading-tight" style={{ color: 'var(--txt-1)' }}>
                                                {o.patient ? `${o.patient.first_name} ${o.patient.last_name}` : `Order #${o.id}`}
                                            </p>
                                            <StatusBadge status={o.status} />
                                        </div>
                                        {o.service?.name && (
                                            <p className="text-[10.5px] font-medium mb-2 truncate" style={{ color: 'var(--txt-3)' }}>
                                                {o.service.name}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-semibold truncate" style={{ color: 'var(--txt-3)' }}>
                                                {o.clinic?.name || '—'}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                {o.priority === 'urgent' && (
                                                    <span className="text-[9px] font-black px-1.5 py-[2px] rounded"
                                                        style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>!</span>
                                                )}
                                                <span className="text-[10.5px] font-black shrink-0" style={{ color: accentColor }}>
                                                    {new Date(o.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            });
                        })()}
                    </div>
                </aside>
            </div>
        </LabLayout>
    );
}
