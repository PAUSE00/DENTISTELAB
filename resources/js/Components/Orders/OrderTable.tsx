import { Link, router } from '@inertiajs/react';
import { ChevronRight, Package, X, Zap, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';
import { OrderListItem } from '@/types/order';

const STATUS: Record<string, { dot: string; bg: string; border: string; label: string }> = {
 new: { dot: '#60ddc6', bg: 'rgba(96,221,198,0.1)', border: 'rgba(96,221,198,0.4)', label: 'New' },
 in_progress: { dot: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.4)', label: 'In Progress' },
 fitting: { dot: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.4)', label: 'Fitting' },
 finished: { dot: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.4)', label: 'Finished' },
 shipped: { dot: '#60ddc6', bg: 'rgba(96,221,198,0.1)', border: 'rgba(96,221,198,0.4)', label: 'Shipped' },
 delivered: { dot: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.4)', label: 'Delivered' },
 rejected: { dot: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.4)', label: 'Rejected' },
 cancelled: { dot: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.4)', label: 'Cancelled' },
 archived: { dot: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.4)', label: 'Archived' },
};

const NEXT_STATUSES: Record<string, { value: string; label: string; color: string }[]> = {
 new: [{ value: 'in_progress', label: 'Start Production', color: '#818cf8' }, { value: 'rejected', label: 'Reject', color: '#f87171' }],
 in_progress: [{ value: 'fitting', label: 'Send for Fitting', color: '#c084fc' }, { value: 'finished', label: 'Mark Finished', color: '#34d399' }],
 fitting: [{ value: 'finished', label: 'Mark Finished', color: '#34d399' }],
 finished: [{ value: 'shipped', label: 'Mark Shipped', color: '#60ddc6' }],
 shipped: [{ value: 'delivered', label: 'Mark Delivered', color: '#34d399' }],
};

function QuickStatus({ orderId, currentStatus, variant }: { orderId: number; currentStatus: string; variant: 'lab' | 'clinic' }) {
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
 <button onClick={() => setOpen(!open)}
 className="p-1.5 rounded transition-all inline-flex items-center justify-center"
 style={{ 
 color: open ? 'var(--txt-accent)' : 'var(--txt-3)',
 border: open ? '1px solid var(--teal-20)' : '1px solid transparent',
 background: open ? 'var(--teal-10)' : 'transparent'
 }}
 title={t('Quick status update')}
 onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-accent)'; e.currentTarget.style.borderColor = 'var(--teal-20)'; e.currentTarget.style.background = 'var(--teal-10)'; }}
 onMouseLeave={e => { if (!open) { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; } }}>
 <Zap size={13} />
 </button>
 {open && (
 <div className="absolute right-0 top-full mt-1 z-50 min-w-[170px] rounded-lg overflow-hidden shadow-xl"
 style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}>
 <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border-b"
 style={{ color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
 {t('Move to')}
 </p>
 {nexts.map(n => (
 <button key={n.value}
 onClick={() => updateStatus(n.value)}
 className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors"
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

// Deterministic color from initials (no gradient, just a muted solid)
const AVATAR_COLORS = ['#4f6272','#5c5f7a','#4a6a5c','#6b5060','#4d6b6b','#5f5070'];
function avatarColor(name: string) {
 let h = 0;
 for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
 return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
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
 <div className="flex flex-col gap-2">
 {selectedOrders.length > 0 && (
 <div className="flex items-center justify-between px-3 py-2 rounded-lg"
 style={{ background: 'var(--teal-10)', border: '1px solid var(--teal-20)' }}>
 <span className="text-[12.5px] font-medium" style={{ color: 'var(--txt-accent)' }}>
 {selectedOrders.length} {t('orders selected')}
 </span>
 <div className="flex items-center gap-2">
 {bulkActions}
 <button onClick={onToggleSelectAll} className="p-1 rounded" style={{ color: 'var(--txt-3)' }}>
 <X size={13} />
 </button>
 </div>
 </div>
 )}

 <div className="rounded-xl overflow-hidden flex flex-col shadow-sm" style={{ border: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
 <div className="overflow-x-auto w-full hide-scrollbar">
 <table className="w-full min-w-[950px]">
 <thead>
 <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
 <th className="w-10 px-4 py-2.5">
 <input type="checkbox"
 checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
 onChange={onToggleSelectAll}
 style={{ accentColor: 'var(--txt-accent)' }} />
 </th>
 {['#', t('Patient'), `${variant === 'lab' ? t('Clinic') : t('Lab')} / ${t('Service')}`, t('Status'), t('Payment'), t('Due Date'), t('Priority'), ''].map((h, i) => (
 <th key={i} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
 style={{ color: 'var(--txt-3)' }}>
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {orders.data.length > 0 ? orders.data.map(order => {
 const s = STATUS[order.status] ?? STATUS.new;
 const counterpartyName = variant === 'lab' ? order.clinic?.name : order.lab?.name;
 const isSelected = selectedOrders.includes(order.id);
 const initials = `${order.patient.first_name[0]}${order.patient.last_name[0]}`;
 const bg = avatarColor(initials);

 const remaining = order.remaining_balance || 0;
 const isPaid = order.payment_status === 'paid';
 const isPartial = order.payment_status === 'partial';

 const formatCurrency = (val: number) => 
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(val);

 return (
 <tr key={order.id}
 style={{
 borderBottom: '1px solid var(--border)',
 background: isSelected ? 'var(--teal-10)' : 'transparent',
 }}
 className="group"
 onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface)'; }}
 onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'var(--teal-10)' : 'transparent'; }}>

 <td className="px-4 py-3">
 <input type="checkbox" checked={isSelected}
 onChange={() => onToggleSelect(order.id)}
 style={{ accentColor: 'var(--txt-accent)' }} />
 </td>

 <td className="px-3 py-3">
 <span className="text-[12px] font-semibold tabular-nums" style={{ color: 'var(--txt-accent)' }}>
 #{order.id}
 </span>
 </td>

 <td className="px-3 py-3">
 <div className="flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
 style={{ background: bg }}>
 {initials}
 </div>
 <span className="text-[13px] font-medium" style={{ color: 'var(--txt-1)' }}>
 {order.patient.first_name} {order.patient.last_name}
 </span>
 </div>
 </td>

 <td className="px-3 py-3">
 <p className="text-[12.5px] font-medium" style={{ color: 'var(--txt-1)' }}>
 {counterpartyName || '—'}
 </p>
 <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {order.service.name}
 </p>
 </td>

 <td className="px-3 py-3">
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] font-medium transition-all"
 style={{ background: s.bg, border: `1px solid ${s.border}`, color: 'var(--txt-1)', boxShadow: `0 0 6px ${s.border}` }}>
 <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot, boxShadow: `0 0 5px ${s.dot}` }} />
 <span>{t(s.label)}</span>
 </span>
 </td>

 <td className="px-3 py-3">
 <div className="flex flex-col">
 <div className={`text-[10px] font-black uppercase tracking-tight flex items-center gap-1 ${isPaid ? 'text-emerald-500' : isPartial ? 'text-amber-500' : 'text-rose-500'}`}>
 {isPaid ? <CheckCircle2 size={10} /> : <Clock size={10} />}
 {t(order.payment_status)}
 </div>
 {!isPaid && remaining > 0 && (
 <div className="text-[11px] font-bold mt-0.5" style={{ color: isPartial ? 'var(--txt-2)' : 'var(--rose-500)' }}>
 {formatCurrency(remaining)} <span className="text-[9px] opacity-40 font-bold uppercase tracking-tighter">{t('left')}</span>
 </div>
 )}
 </div>
 </td>

 <td className="px-3 py-3">
 <span className="text-[12.5px]"
 style={{ color: order.is_overdue ? '#f87171' : 'var(--txt-2)' }}>
 {order.due_date
 ? new Date(order.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
 : '—'}
 </span>
 {order.is_overdue && (
 <div className="flex items-center gap-1 mt-0.5">
 <AlertTriangle size={10} color="#f87171" />
 <p className="text-[10px] font-medium" style={{ color: '#f87171' }}>Overdue</p>
 </div>
 )}
 </td>

 <td className="px-3 py-3">
 <span className="text-[12px]"
 style={{ color: order.priority === 'urgent' ? '#f97316' : 'var(--txt-3)' }}>
 {order.priority}
 </span>
 </td>

 <td className="px-3 py-3">
 <div className="flex items-center justify-end gap-1">
 <QuickStatus orderId={order.id} currentStatus={order.status} variant={variant} />
 <Link href={showRoute(order.id)}
 className="p-1.5 rounded transition-all inline-flex items-center justify-center"
 style={{ color: 'var(--txt-3)', border: '1px solid transparent', background: 'transparent' }}
 onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-accent)'; e.currentTarget.style.borderColor = 'var(--teal-20)'; e.currentTarget.style.background = 'var(--teal-10)'; }}
 onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
 <ChevronRight size={15} />
 </Link>
 </div>
 </td>
 </tr>
 );
 }) : (
 <tr>
 <td colSpan={8} className="py-16 text-center" style={{ color: 'var(--txt-3)' }}>
 <Package size={28} className="mx-auto mb-3 opacity-30" />
 <p className="text-[13px]">{t('No Orders Found')}</p>
 <p className="text-[11px] mt-1 opacity-70">{t('Adjust your filters or create a new order.')}</p>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {orders.links && orders.links.length > 3 && (
 <div className="px-4 py-3 border-t flex justify-between items-center"
 style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
 <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
 {orders.total} {t('total orders')}
 </p>
 <Pagination links={orders.links} />
 </div>
 )}
 </div>
 </div>
 );
}
