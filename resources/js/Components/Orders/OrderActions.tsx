import { Activity, CheckCircle2, Clock, Truck, Flag, X, Package } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { AllowedTransition } from '@/types/order';

const transitionStyles: Record<string, { bg: string; icon: typeof Activity; label: string }> = {
    in_progress: { bg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20', icon: Activity, label: 'Start Production' },
    fitting: { bg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20', icon: Clock, label: 'Send for Fitting' },
    finished: { bg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20', icon: CheckCircle2, label: 'Mark as Finished' },
    shipped: { bg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20', icon: Truck, label: 'Mark as Shipped' },
    delivered: { bg: 'bg-green-600 hover:bg-green-700 shadow-green-500/20', icon: Flag, label: 'Mark as Delivered' },
    rejected: { bg: 'bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10', icon: X, label: 'Reject Order' },
    cancelled: { bg: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700', icon: X, label: 'Cancel Order' },
    archived: { bg: 'bg-gray-600 hover:bg-gray-700 shadow-gray-500/20', icon: Package, label: 'Archive' },
};

interface OrderActionsProps {
    allowedTransitions: AllowedTransition[];
    processing: boolean;
    onUpdateStatus: (newStatus: string) => void;
}

export default function OrderActions({ allowedTransitions, processing, onUpdateStatus }: OrderActionsProps) {
    const { t } = useTranslation();

    return (
        <div className="glass-card rounded-2xl p-5 overflow-hidden relative animate-fade-in animate-delay-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 dark:bg-primary-900/10 rounded-bl-full -mr-10 -mt-10 z-0"></div>

            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-xs uppercase tracking-wide relative z-10 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-500" /> {t('Actions')}
            </h3>

            <div className="space-y-3 relative z-10 mt-4">
                {allowedTransitions && allowedTransitions.length > 0 ? (
                    allowedTransitions.map((transition: AllowedTransition) => {
                        const style = transitionStyles[transition.value] || transitionStyles['in_progress'];
                        const isOutline = transition.value === 'rejected' || transition.value === 'cancelled';
                        const Icon = style.icon;

                        return (
                            <button
                                key={transition.value}
                                onClick={() => onUpdateStatus(transition.value)}
                                disabled={processing}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50
                                    ${isOutline
                                        ? style.bg
                                        : `${style.bg} text-white shadow-lg`
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {t(style.label)}
                            </button>
                        );
                    })
                ) : (
                    <p className="text-xs text-gray-400 italic text-center py-2">{t('No actions available')}</p>
                )}
            </div>
        </div>
    );
}
