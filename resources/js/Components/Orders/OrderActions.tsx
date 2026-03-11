import { Activity, CheckCircle2, Clock, Truck, Flag, X, Package } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { AllowedTransition } from '@/types/order';

const TRANSITIONS: Record<string, {
    icon: typeof Activity;
    label: string;
    style: React.CSSProperties;
    hoverStyle?: React.CSSProperties;
}> = {
    in_progress: {
        icon: Activity,
        label: 'Start Production',
        style: { background: 'rgba(96,221,198,0.12)', border: '1px solid rgba(96,221,198,0.25)', color: '#60ddc6' },
    },
    fitting: {
        icon: Clock,
        label: 'Send for Fitting',
        style: { background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.25)', color: '#c084fc' },
    },
    finished: {
        icon: CheckCircle2,
        label: 'Mark as Finished',
        style: { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' },
    },
    shipped: {
        icon: Truck,
        label: 'Mark as Shipped',
        style: { background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', color: '#818cf8' },
    },
    delivered: {
        icon: Flag,
        label: 'Mark as Delivered',
        style: { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' },
    },
    rejected: {
        icon: X,
        label: 'Reject Order',
        style: { background: 'transparent', border: '1px solid var(--border-strong)', color: '#f87171' },
    },
    cancelled: {
        icon: X,
        label: 'Cancel Order',
        style: { background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--txt-3)' },
    },
    archived: {
        icon: Package,
        label: 'Archive',
        style: { background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-2)' },
    },
};

interface OrderActionsProps {
    allowedTransitions: AllowedTransition[];
    processing: boolean;
    onUpdateStatus: (status: string) => void;
}

export default function OrderActions({ allowedTransitions, processing, onUpdateStatus }: OrderActionsProps) {
    const { t } = useTranslation();

    return (
        <div className="card p-4">
            <p className="text-[11px] font-semibold mb-3" style={{ color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t('Actions')}
            </p>
            <div className="flex flex-col gap-2">
                {allowedTransitions && allowedTransitions.length > 0 ? (
                    allowedTransitions.map((transition) => {
                        const cfg = TRANSITIONS[transition.value] ?? TRANSITIONS['in_progress'];
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={transition.value}
                                onClick={() => onUpdateStatus(transition.value)}
                                disabled={processing}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[12.5px] font-semibold transition-opacity disabled:opacity-40"
                                style={cfg.style}
                            >
                                <Icon size={14} />
                                {t(cfg.label)}
                            </button>
                        );
                    })
                ) : (
                    <p className="text-[12px] text-center py-2" style={{ color: 'var(--txt-3)' }}>
                        {t('No actions available')}
                    </p>
                )}
            </div>
        </div>
    );
}
