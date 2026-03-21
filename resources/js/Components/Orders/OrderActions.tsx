import { Activity, CheckCircle2, Clock, Truck, Flag, X, Package, Zap } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { AllowedTransition } from '@/types/order';

const TRANSITIONS: Record<string, {
 icon: typeof Activity;
 label: string;
 color: string;
 bg: string;
 border: string;
}> = {
 in_progress: { icon: Activity, label: 'Start Production', color: '#60ddc6', bg: 'rgba(96,221,198,0.1)', border: 'rgba(96,221,198,0.3)' },
 fitting: { icon: Clock, label: 'Send for Fitting', color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
 finished: { icon: CheckCircle2, label: 'Mark as Finished', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
 shipped: { icon: Truck, label: 'Mark as Shipped', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)' },
 delivered: { icon: Flag, label: 'Mark as Delivered', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
 rejected: { icon: X, label: 'Reject Order', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
 cancelled: { icon: X, label: 'Cancel Order', color: 'var(--txt-3)', bg: 'var(--bg)', border: 'var(--border-strong)' },
 archived: { icon: Package, label: 'Archive', color: 'var(--txt-2)', bg: 'var(--bg)', border: 'var(--border-strong)' },
};

interface OrderActionsProps {
 allowedTransitions: AllowedTransition[];
 processing: boolean;
 onUpdateStatus: (status: string) => void;
}

export default function OrderActions({ allowedTransitions, processing, onUpdateStatus }: OrderActionsProps) {
 const { t } = useTranslation();

 if (!allowedTransitions || allowedTransitions.length === 0) {
 return (
 <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' }}>
 {t('No actions available')}
 </div>
 );
 }

 const primary = allowedTransitions[0];
 const secondary = allowedTransitions.slice(1);
 const P_CFG = TRANSITIONS[primary.value] ?? TRANSITIONS['in_progress'];
 const PIcon = P_CFG.icon;

 return (
 <div className="flex flex-col gap-3">
 {/* Primary Action Button */}
 <button
 key={primary.value}
 onClick={() => onUpdateStatus(primary.value)}
 disabled={processing}
 className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 style={{
 background: '#14b8a6', // Teal 500
 borderColor: '#0d9488', // Teal 600
 color: '#ffffff',
 fontSize: '13px',
 fontWeight: 600,
 }}
 onMouseEnter={e => { if (!processing) e.currentTarget.style.background = '#0d9488'; }}
 onMouseLeave={e => { if (!processing) e.currentTarget.style.background = '#14b8a6'; }}
 >
 <PIcon size={15} />
 {t(P_CFG.label)}
 </button>

 {/* Secondary Action Grid */}
 {secondary.length > 0 && (
 <div className="grid gap-2 text-[12px]" style={{ gridTemplateColumns: secondary.length === 1 ? '1fr' : '1fr 1fr' }}>
 {secondary.map((transition) => {
 const cfg = TRANSITIONS[transition.value] ?? TRANSITIONS['in_progress'];
 const Icon = cfg.icon;
 return (
 <button
 key={transition.value}
 onClick={() => onUpdateStatus(transition.value)}
 disabled={processing}
 className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 style={{
 background: 'var(--bg)',
 borderColor: 'var(--border)',
 color: 'var(--txt-2)',
 fontWeight: 500,
 }}
 onMouseEnter={e => { if (!processing) { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.color = cfg.color; } }}
 onMouseLeave={e => { if (!processing) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--txt-2)'; } }}
 >
 <Icon size={13} />
 {t(cfg.label)}
 </button>
 );
 })}
 </div>
 )}
 </div>
 );
}
