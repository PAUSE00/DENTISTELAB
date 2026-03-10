import { Clock, Calendar } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { OrderHistoryEntry } from '@/types/order';

interface OrderTimelineProps {
    history: OrderHistoryEntry[];
}

export default function OrderTimeline({ history }: OrderTimelineProps) {
    const { t } = useTranslation();

    return (
        <div className="glass-card rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-primary-500" />
                {t('Order Timeline')}
            </h3>
            <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-3 space-y-6 pb-2">
                {history && history.length > 0 ? (
                    history.map((entry, index) => {
                        const isLast = index === history.length - 1;
                        return (
                            <div key={entry.id} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${isLast ? 'bg-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold capitalize ${isLast ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {t(entry.status.replace('_', ' '))}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(entry.created_at).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                    {entry.user && (
                                        <span className="text-[10px] text-gray-400 font-medium mt-1 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-block w-fit border border-gray-100 dark:border-slate-700">
                                            {t('By')}: {entry.user.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="pl-6 text-xs text-gray-400 italic">
                        {t('No history available.')}
                    </div>
                )}
            </div>
        </div>
    );
}
