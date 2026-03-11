import useTranslation from '@/Hooks/useTranslation';
import { OrderHistoryEntry } from '@/types/order';

const STATUS_DOT: Record<string, string> = {
    new: '#60ddc6', in_progress: '#818cf8', fitting: '#c084fc',
    finished: '#34d399', shipped: '#60ddc6', delivered: '#34d399',
    rejected: '#f87171', cancelled: '#f87171', archived: '#94a3b8',
};

interface OrderTimelineProps {
    history: OrderHistoryEntry[];
}

export default function OrderTimeline({ history }: OrderTimelineProps) {
    const { t } = useTranslation();

    return (
        <div className="card p-4">
            <p className="text-[11px] font-semibold mb-4" style={{ color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t('Timeline')}
            </p>

            {history && history.length > 0 ? (
                <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-[6px] top-2 bottom-2 w-px" style={{ background: 'var(--border)' }} />

                    <div className="space-y-4">
                        {history.map((entry, i) => {
                            const isLatest = i === history.length - 1;
                            const dot = STATUS_DOT[entry.status] ?? '#60ddc6';
                            return (
                                <div key={entry.id} className="relative pl-5 flex flex-col">
                                    {/* dot */}
                                    <div className="absolute left-0 top-[3px] w-3 h-3 rounded-full border-2"
                                        style={{
                                            background: isLatest ? dot : 'var(--surface)',
                                            borderColor: isLatest ? dot : 'var(--border-strong)',
                                        }} />
                                    <span className="text-[12.5px] font-semibold capitalize" style={{ color: isLatest ? 'var(--txt-1)' : 'var(--txt-2)' }}>
                                        {t(entry.status.replace('_', ' '))}
                                    </span>
                                    <span className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                        {new Date(entry.created_at).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                        {entry.user && <> · {entry.user.name}</>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('No history available.')}</p>
            )}
        </div>
    );
}
