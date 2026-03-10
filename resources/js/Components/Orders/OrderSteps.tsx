import { Check, Activity, CheckCircle2, Truck, Flag } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { OrderHistoryEntry } from '@/types/order';

interface OrderStepsProps {
    status: string;
    createdAt: string;
    dueDate: string;
    history: OrderHistoryEntry[];
}

export default function OrderSteps({ status, createdAt, dueDate, history }: OrderStepsProps) {
    const { t } = useTranslation();

    const getStatusDate = (stepId: string) => {
        const entry = history.find(h => h.status === stepId);
        if (entry) {
            return new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return null;
    };

    const steps = [
        { id: 'new', label: t('New'), icon: Check, date: getStatusDate('new') || new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
        { id: 'in_progress', label: t('In Progress'), icon: Activity, date: getStatusDate('in_progress') || t('Pending') },
        { id: 'finished', label: t('Finished'), icon: CheckCircle2, date: getStatusDate('finished') || t('Pending') },
        { id: 'shipped', label: t('Shipped'), icon: Truck, date: getStatusDate('shipped') || t('Pending') },
        { id: 'delivered', label: t('Delivered'), icon: Flag, date: getStatusDate('delivered') || new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
    ];

    const stepsIndexMap: Record<string, number> = {
        'new': 0, 'in_progress': 1, 'fitting': 1, 'finished': 2, 'shipped': 3, 'delivered': 4, 'archived': 4, 'rejected': 0
    };
    const activeStepIndex = stepsIndexMap[status] ?? 0;

    return (
        <div className="w-full py-8 overflow-x-auto custom-scrollbar">
            <div className="relative flex justify-between items-start w-full max-w-5xl mx-auto px-4 min-w-[600px]">
                {/* Background Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700/60 rounded-full -z-10 hidden md:block"></div>
                {/* Progress Line */}
                <div
                    className="absolute top-6 left-0 h-1 bg-emerald-500 rounded-full -z-10 hidden md:block transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= activeStepIndex;
                    const isCurrent = index === activeStepIndex;
                    const displayDate = isCurrent && index !== 4 ? t('Active') : step.date;

                    return (
                        <div key={step.id} className="relative flex flex-col items-center group w-28">
                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3.5 transition-all duration-500 z-10 relative
                                ${isCompleted
                                    ? 'bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-100'
                                    : 'bg-white dark:bg-[#1e293b] text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 shadow-sm'
                                }
                                ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}
                            `}>
                                <step.icon className={`w-6 h-6 ${isCompleted ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                {isCurrent && (
                                    <span className="absolute flex h-full w-full rounded-xl">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-emerald-400 opacity-25"></span>
                                    </span>
                                )}
                            </div>

                            {/* Text Container */}
                            <div className="flex flex-col items-center text-center space-y-1.5 min-h-[44px]">
                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300
                                    ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-500'}`}>
                                    {step.label}
                                </span>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md transition-colors duration-300 whitespace-nowrap
                                    ${isCurrent
                                        ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                                        : isCompleted
                                            ? 'text-gray-500 dark:text-slate-400'
                                            : 'text-gray-400 dark:text-slate-600'}`}>
                                    {displayDate}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
