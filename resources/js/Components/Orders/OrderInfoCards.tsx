import { Calendar, Building, Box } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { OrderPatient, OrderEntity } from '@/types/order';

interface OrderInfoCardsProps {
    dueDate: string;
    patient: OrderPatient;
    /** The other party: clinic (in Lab view) or lab (in Clinic view) */
    counterparty: OrderEntity;
    counterpartyLabel: string;
    service: OrderEntity;
    priority: string;
}

export default function OrderInfoCards({ dueDate, patient, counterparty, counterpartyLabel, service, priority }: OrderInfoCardsProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in animate-delay-200">
            {/* Due Date Card */}
            <div className="glass-card rounded-2xl p-5 group hover:border-amber-200 dark:hover:border-amber-800/50 hover:-translate-y-1 transition-all">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-500 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center shrink-0 shadow-sm">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('Due Date')}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                            {new Date(dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Patient Card */}
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-900/10 rounded-bl-full -mr-4 -mt-4 -z-0 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary-500/20 shrink-0">
                        {patient?.first_name?.[0] || '?'}{patient?.last_name?.[0] || '?'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t('Patient')}</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg truncate leading-tight">{patient?.first_name || t('Unknown')} {patient?.last_name || ''}</p>
                        <p className="text-[10px] text-gray-500 font-mono tracking-tight bg-gray-100 dark:bg-slate-700/50 px-1.5 rounded inline-block mt-1">ID: {patient?.id || '?'}</p>
                    </div>
                </div>
            </div>

            {/* Counterparty Info Card */}
            <div className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/10 text-primary-500 border border-primary-100 dark:border-primary-800/30 flex items-center justify-center shrink-0 shadow-sm">
                        <Building className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{counterpartyLabel}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{counterparty?.name || 'N/A'}</p>
                    </div>
                </div>
                <div className="space-y-2 border-t border-gray-100 dark:border-slate-700/50 pt-3">
                    <div className="flex justify-between items-center group">
                        <span className="text-[10px] text-gray-500">{t('Service')}</span>
                        <span className="font-bold text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-1.5 py-0.5 rounded">{service?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">{t('Priority')}</span>
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <Box className="w-3 h-3" /> {priority === 'urgent' ? `🔴 ${t('Urgent')}` : t('Normal')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
