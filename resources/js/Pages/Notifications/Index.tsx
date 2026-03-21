import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import LabLayout from '@/Layouts/LabLayout';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { Bell, CheckCheck, Filter, Inbox, Package, MessageSquare, RefreshCw, X, ArrowRight } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Notification {
 id: number; type: string; title: string; body: string;
 data: Record<string, unknown>; read_at: string | null; created_at: string;
}
interface PaginatedData {
 data: Notification[]; current_page: number; last_page: number;
 per_page: number; total: number;
 links: { url: string | null; label: string; active: boolean }[];
}
interface Props {
 notifications: PaginatedData;
 filters: { type: string | null; status: string | null };
 userLayout: 'lab' | 'clinic' | 'admin';
}

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
 order_status: { icon: RefreshCw, color: '#818cf8', label: 'Status Update' },
 new_order: { icon: Package, color: '#60ddc6', label: 'New Order' },
 new_message: { icon: MessageSquare, color: '#c084fc', label: 'Message' },
 invitation_accepted:{ icon: Bell, color: '#f59e0b', label: 'Invitation' },
};

function timeAgo(d: string) {
 const diff = Date.now() - new Date(d).getTime();
 const m = Math.floor(diff / 60000);
 if (m < 1) return 'Just now';
 if (m < 60) return `${m}m ago`;
 const h = Math.floor(m / 60);
 if (h < 24) return `${h}h ago`;
 const days = Math.floor(h / 24);
 if (days < 7) return `${days}d ago`;
 return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function NotificationsContent({ notifications, filters, userLayout }: Props) {
 const { t } = useTranslation();
 const [selectedType, setSelectedType] = useState(filters.type || '');
 const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

 const applyFilters = (overrides: { type?: string; status?: string } = {}) => {
 const p: Record<string, string> = {};
 const ty = overrides.type !== undefined ? overrides.type : selectedType;
 const st = overrides.status !== undefined ? overrides.status : selectedStatus;
 if (ty) p.type = ty;
 if (st) p.status = st;
 router.get(route('notifications.index'), p, { preserveState: true, preserveScroll: true });
 };

 const markAsRead = (id: number) =>
 router.patch(route('notifications.read', id), {}, { preserveScroll: true });

 const markAllAsRead = () =>
 router.post(route('notifications.read-all'), {}, { preserveScroll: true });

 const handleClick = (n: Notification) => {
 if (!n.read_at) markAsRead(n.id);
 const orderId = n.data?.order_id;
 if (orderId !== undefined && orderId !== null) {
 const id = Number(orderId);
 if (userLayout === 'lab') {
 router.visit(route('lab.orders.show', id));
 } else {
 router.visit(route('clinic.orders.show', id));
 }
 }
 };

 const unreadCount = notifications.data.filter(n => !n.read_at).length;
 const totalUnread = notifications.total;

 const statusFilters = [
 { key: 'unread', label: t('Unread'), color: '#f59e0b' },
 { key: 'read', label: t('Read'), color: '#34d399' },
 ];

 return (
 <>
 <Head title={t('Notifications')} />
 <div className="flex flex-col gap-4">

 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('Notifications')}
 {unreadCount > 0 && (
 <span className="ml-2 text-[12px] font-bold px-2 py-px rounded-full"
 style={{ background: 'rgba(96,221,198,0.15)', color: 'var(--txt-accent)' }}>
 {unreadCount} {t('new')}
 </span>
 )}
 </h2>
 <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {notifications.total} {t('total notifications')}
 </p>
 </div>
 {unreadCount > 0 && (
 <button onClick={markAllAsRead} className="btn-ghost text-[12px]">
 <CheckCheck size={13} /> {t('Mark all read')}
 </button>
 )}
 </div>

 {/* Filters */}
 <div className="card p-3 flex flex-wrap items-center gap-2">
 <Filter size={13} style={{ color: 'var(--txt-3)' }} />
 {statusFilters.map(f => (
 <button key={f.key}
 onClick={() => { const v = selectedStatus === f.key ? '' : f.key; setSelectedStatus(v); applyFilters({ status: v }); }}
 className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
 style={selectedStatus === f.key
 ? { background: `${f.color}15`, borderColor: `${f.color}30`, color: f.color }
 : { background: 'transparent', borderColor: 'var(--border-strong)', color: 'var(--txt-2)' }}>
 {f.label}
 </button>
 ))}

 <div className="w-px h-4 mx-1" style={{ background: 'var(--border-strong)' }} />

 {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
 const Icon = cfg.icon;
 return (
 <button key={key}
 onClick={() => { const v = selectedType === key ? '' : key; setSelectedType(v); applyFilters({ type: v }); }}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
 style={selectedType === key
 ? { background: `${cfg.color}15`, borderColor: `${cfg.color}30`, color: cfg.color }
 : { background: 'transparent', borderColor: 'var(--border-strong)', color: 'var(--txt-2)' }}>
 <Icon size={12} /> {t(cfg.label)}
 </button>
 );
 })}

 {(selectedType || selectedStatus) && (
 <button onClick={() => { setSelectedType(''); setSelectedStatus(''); router.get(route('notifications.index')); }}
 className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] transition-colors ml-auto"
 style={{ color: 'var(--txt-3)' }}>
 <X size={12} /> {t('Clear')}
 </button>
 )}
 </div>

 {/* List */}
 <div className="card overflow-hidden">
 {notifications.data.length === 0 ? (
 <div className="py-16 text-center" style={{ color: 'var(--txt-3)' }}>
 <Inbox size={32} className="mx-auto mb-3 opacity-40" />
 <p className="text-[13px] font-medium">{t('No notifications')}</p>
 </div>
 ) : (
 <div>
 {notifications.data.map((n, i) => {
 const cfg = TYPE_CONFIG[n.type] ?? { icon: Bell, color: '#94a3b8', label: n.type };
 const Icon = cfg.icon;
 const isUnread = !n.read_at;
 return (
 <button key={n.id} onClick={() => handleClick(n)}
 className="w-full text-left flex items-start gap-3 px-4 py-3.5 border-b last:border-b-0 transition-colors group relative"
 style={{
 borderColor: 'var(--border)',
 background: isUnread ? `${cfg.color}06` : 'transparent',
 }}
 onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
 onMouseLeave={e => (e.currentTarget.style.background = isUnread ? `${cfg.color}06` : 'transparent')}>

 {/* Unread indicator */}
 {isUnread && (
 <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
 style={{ background: cfg.color }} />
 )}

 {/* Icon */}
 <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
 style={{ background: `${cfg.color}15`, color: cfg.color }}>
 <Icon size={14} />
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <p className="text-[12.5px] font-semibold" style={{ color: isUnread ? 'var(--txt-1)' : 'var(--txt-2)' }}>
 {t(n.title)}
 </p>
 {isUnread && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />}
 </div>
 <p className="text-[11.5px] mt-0.5 line-clamp-2" style={{ color: 'var(--txt-3)' }}>{t(n.body)}</p>
 <div className="flex items-center gap-2 mt-1.5">
 <span className="text-[10.5px]" style={{ color: 'var(--txt-3)' }}>{timeAgo(n.created_at)}</span>
 <span className="text-[10.5px] px-1.5 py-px rounded"
 style={{ background: `${cfg.color}10`, color: cfg.color }}>
 {t(cfg.label)}
 </span>
 </div>
 </div>

 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
 {isUnread && (
 <button onClick={e => { e.stopPropagation(); markAsRead(n.id); }}
 className="p-1.5 rounded-md transition-colors"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => (e.currentTarget.style.color = 'var(--txt-accent)')}
 onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
 <CheckCheck size={13} />
 </button>
 )}
 {n.data?.order_id != null && <ArrowRight size={13} style={{ color: 'var(--txt-3)' }} />}
 </div>
 </button>
 );
 })}
 </div>
 )}

 {/* Pagination */}
 {notifications.last_page > 1 && (
 <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
 {t('Page')} {notifications.current_page} / {notifications.last_page}
 </p>
 <div className="flex gap-1">
 {notifications.links.map((link, i) => (
 <button key={i}
 disabled={!link.url}
 onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
 className="px-2.5 py-1 rounded-md text-[12px] font-medium disabled:opacity-30 transition-colors"
 style={link.active
 ? { background: 'var(--txt-accent)', color: 'var(--bg)' }
 : { color: 'var(--txt-3)' }}
 dangerouslySetInnerHTML={{ __html: link.label }} />
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 </>
 );
}

export default function NotificationsIndex(props: Props) {
 return props.userLayout === 'lab'
 ? <LabLayout><NotificationsContent {...props} /></LabLayout>
 : <ClinicLayout><NotificationsContent {...props} /></ClinicLayout>;
}
