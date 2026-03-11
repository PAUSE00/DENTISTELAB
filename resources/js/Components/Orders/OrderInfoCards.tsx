import { Calendar, Building } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { OrderPatient, OrderEntity } from '@/types/order';

interface OrderInfoCardsProps {
    dueDate: string;
    patient: OrderPatient;
    counterparty: OrderEntity;
    counterpartyLabel: string;
    service: OrderEntity;
    priority: string;
}

export default function OrderInfoCards({ dueDate, patient, counterparty, counterpartyLabel, service, priority }: OrderInfoCardsProps) {
    const { t } = useTranslation();

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Due Date */}
            <div className="card p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>
                    <Calendar size={15} />
                </div>
                <div>
                    <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Due Date')}</p>
                    <p className="text-[13.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>{fmtDate(dueDate)}</p>
                </div>
            </div>

            {/* Patient */}
            <div className="card p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                    {patient?.first_name?.[0] || '?'}{patient?.last_name?.[0] || '?'}
                </div>
                <div>
                    <p className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{t('Patient')}</p>
                    <p className="text-[13.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                        {patient?.first_name || '—'} {patient?.last_name || ''}
                    </p>
                </div>
            </div>

            {/* Counterparty / Service / Priority */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Building size={13} style={{ color: 'var(--txt-3)' }} />
                    <span className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>{counterpartyLabel}</span>
                </div>
                <p className="text-[13.5px] font-semibold mb-2" style={{ color: 'var(--txt-1)' }}>
                    {counterparty?.name || '—'}
                </p>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Service')}</span>
                    <span className="text-[11.5px] font-semibold" style={{ color: 'var(--txt-accent)' }}>{service?.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Priority')}</span>
                    <span className="priority-chip" style={priority === 'urgent'
                        ? { background: 'rgba(249,115,22,0.12)', color: '#f97316' }
                        : { background: 'var(--surface)', color: 'var(--txt-3)' }}>
                        {priority === 'urgent' ? t('Urgent') : t('Normal')}
                    </span>
                </div>
            </div>
        </div>
    );
}
