import useTranslation from '@/Hooks/useTranslation';
import { OrderHistoryEntry } from '@/types/order';
import { Clock } from 'lucide-react';

const STATUS_DOT: Record<string, string> = {
 new: '#60ddc6', in_progress: '#818cf8', fitting: '#c084fc',
 finished: '#34d399', shipped: '#60ddc6', delivered: '#34d399',
 rejected: '#f87171', cancelled: '#f87171', archived: '#94a3b8',
};

const STATUS_LABEL: Record<string, string> = {
 new: 'New', in_progress: 'In Progress', fitting: 'Fitting',
 finished: 'Finished', shipped: 'Shipped', delivered: 'Delivered',
 rejected: 'Rejected', cancelled: 'Cancelled', archived: 'Archived',
};

interface OrderTimelineProps {
 history: OrderHistoryEntry[];
}

export default function OrderTimeline({ history }: OrderTimelineProps) {
 const { t } = useTranslation();

 return (
 <div>
 <div style={{
 display: 'flex', alignItems: 'center', gap: 6,
 padding: '10px 16px', borderBottom: '1px solid var(--border)',
 background: 'var(--bg)',
 fontSize: '10.5px', fontWeight: 600,
 textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--txt-3)',
 }}>
 <Clock size={12} color="var(--txt-3)" />
 {t('Timeline')}
 </div>

 <div style={{ padding: 12 }}>
 {history && history.length > 0 ? (
 <div style={{ position: 'relative' }}>
 {/* Vertical line */}
 <div style={{
 position: 'absolute', left: 7, top: 6, bottom: 6,
 width: 1, background: 'var(--border)',
 }} />
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {history.map((entry, i) => {
 const isLatest = i === history.length - 1;
 const dot = STATUS_DOT[entry.status] ?? '#60ddc6';
 const label = STATUS_LABEL[entry.status] ?? entry.status;
 return (
 <div key={entry.id} style={{ position: 'relative', paddingLeft: 22, display: 'flex', flexDirection: 'column' }}>
 <div style={{
 position: 'absolute', left: 0, top: 4,
 width: 14, height: 14, borderRadius: '50%',
 border: `2px solid ${dot}`,
 background: isLatest ? dot : 'var(--bg)',
 boxShadow: isLatest ? `0 0 8px ${dot}60` : 'none',
 }} />
 <span style={{
 fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
 color: isLatest ? 'var(--txt-1)' : 'var(--txt-2)',
 }}>
 {t(label)}
 </span>
 <span style={{ fontSize: 10.5, marginTop: 2, color: 'var(--txt-3)' }}>
 {new Date(entry.created_at).toLocaleString(undefined, {
 month: 'short', day: 'numeric',
 hour: '2-digit', minute: '2-digit',
 })}
 {entry.user && <> · <span style={{ color: 'var(--txt-2)' }}>{entry.user.name}</span></>}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 ) : (
 <p style={{ fontSize: 12, textAlign: 'center', padding: '8px 0', color: 'var(--txt-3)' }}>
 {t('No history available.')}
 </p>
 )}
 </div>
 </div>
 );
}
