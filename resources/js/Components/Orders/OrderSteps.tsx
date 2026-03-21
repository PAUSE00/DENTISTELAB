import { Check, Activity, Clock, Truck, Flag } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { OrderHistoryEntry } from '@/types/order';

interface OrderStepsProps {
 status: string;
 createdAt: string;
 dueDate: string;
 history: OrderHistoryEntry[];
}

const SOLID = '#10b981';
const DASHED = 'repeating-linear-gradient(90deg, #3d4762 0px, #3d4762 5px, transparent 5px, transparent 13px)';

export default function OrderSteps({ status, createdAt, dueDate, history }: OrderStepsProps) {
 const { t } = useTranslation();

 const getStatusDate = (stepId: string) => {
 const entry = history.slice().reverse().find(h => h.status === stepId);
 if (entry) return new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
 return null;
 };

 const steps = [
 { id: 'new', label: t('New').toUpperCase(), icon: Check, date: getStatusDate('new') || new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
 { id: 'in_progress', label: t('In Progress').toUpperCase(), icon: Activity, date: getStatusDate('in_progress') },
 { id: 'finished', label: t('Finished').toUpperCase(), icon: Clock, date: getStatusDate('finished') },
 { id: 'shipped', label: t('Shipped').toUpperCase(), icon: Truck, date: getStatusDate('shipped') },
 { id: 'delivered', label: t('Delivered').toUpperCase(), icon: Flag, date: getStatusDate('delivered') || `${t('Est.')} ${new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` },
 ];

 const stepsIndexMap: Record<string, number> = {
 new: 0, in_progress: 1, fitting: 1, finished: 2, shipped: 3, delivered: 4, archived: 4, rejected: 0,
 };
 const activeIdx = stepsIndexMap[status] ?? 0;

 // Circle center Y position (circle is 36px = h-9)
 const CIRCLE_CENTER_Y = 18; // px from top of node

 return (
 <div className="w-full overflow-x-auto no-scrollbar">
 <div className="flex items-start justify-between w-full max-w-3xl mx-auto min-w-[520px]">
 {steps.map((step, index) => {
 const isCompleted = index < activeIdx;
 const isCurrent = index === activeIdx;
 const isPending = index > activeIdx;
 const Icon = step.icon;

 // Segment to the LEFT of this node: green if this node is reached (index <= activeIdx)
 const leftGreen = index <= activeIdx;
 // Segment to the RIGHT of this node: green if next node is reached (index < activeIdx)
 const rightGreen = index < activeIdx;

 return (
 <div key={step.id}
 className="relative flex flex-col items-center flex-1">

 {/* ─── LEFT half-connector ─── */}
 {index > 0 && (
 <div style={{
 position: 'absolute',
 top: `${CIRCLE_CENTER_Y}px`,
 left: 0,
 right: '50%',
 height: '2px',
 background: leftGreen ? SOLID : DASHED,
 zIndex: 0,
 }} />
 )}

 {/* ─── RIGHT half-connector ─── */}
 {index < steps.length - 1 && (
 <div style={{
 position: 'absolute',
 top: `${CIRCLE_CENTER_Y}px`,
 left: '50%',
 right: 0,
 height: '2px',
 background: rightGreen ? SOLID : DASHED,
 zIndex: 0,
 }} />
 )}

 {/* ─── Circle icon ─── */}
 <div style={{ position: 'relative', zIndex: 1, marginBottom: '10px' }}>
 {/* Outer glow for active */}
 {isCurrent && (
 <div style={{
 position: 'absolute',
 inset: '-6px',
 borderRadius: '50%',
 background: '#60ddc6',
 opacity: 0.2,
 }} />
 )}
 <div style={{
 width: '36px', height: '36px',
 borderRadius: '50%',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 border: `2px solid ${isCompleted ? SOLID : isCurrent ? '#60ddc6' : '#3d4762'}`,
 background: isCompleted ? SOLID : isCurrent ? '#60ddc6' : 'var(--bg)',
 color: (isCompleted || isCurrent) ? 'var(--bg)' : '#4b5875',
 boxShadow: isCurrent ? '0 0 18px rgba(96,221,198,0.45)' : 'none',
 position: 'relative',
 }}>
 <Icon size={15} strokeWidth={isCompleted ? 2.5 : 2} />
 </div>
 </div>

 {/* ─── Label + date + pill ─── */}
 <div className="flex flex-col items-center" style={{ gap: '3px' }}>
 <span style={{
 fontSize: '11px',
 fontWeight: 700,
 letterSpacing: '0.06em',
 color: isCompleted ? SOLID : isCurrent ? '#60ddc6' : '#6b7280',
 whiteSpace: 'nowrap',
 }}>
 {step.label}
 </span>

 <span style={{
 fontSize: '10.5px',
 color: 'var(--txt-3)',
 whiteSpace: 'nowrap',
 }}>
 {step.date ?? `${t('Status')}: ${t('Pending')}`}
 </span>

 {isCurrent && (
 <span style={{
 marginTop: '4px',
 fontSize: '10px', fontWeight: 600,
 padding: '2px 10px',
 borderRadius: '999px',
 background: 'rgba(245,158,11,0.12)',
 color: '#f59e0b',
 border: '1px solid rgba(245,158,11,0.25)',
 whiteSpace: 'nowrap',
 }}>
 {t('Active')}
 </span>
 )}

 {isCompleted && index === activeIdx - 1 && (
 <span style={{
 marginTop: '4px',
 fontSize: '10px', fontWeight: 600,
 padding: '2px 10px',
 borderRadius: '999px',
 background: 'rgba(16,185,129,0.1)',
 color: '#10b981',
 border: '1px solid rgba(16,185,129,0.2)',
 whiteSpace: 'nowrap',
 }}>
 {t('Completed')}
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}
