import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
    Search, Plus, Stethoscope, ChevronRight, 
    Calendar, CheckCircle2, Clock, AlertCircle, FileText, User, MoreVertical
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Props {
    plans: {
        data: any[];
        links: any[];
    };
    filters: any;
}

export default function TreatmentPlansIndex({ plans, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('clinic.treatment-plans.index'), { search, status }, { preserveState: true });
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'completed': return { bg: 'var(--teal-10)', color: 'var(--teal)', icon: CheckCircle2 };
            case 'active': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', icon: Clock };
            case 'cancelled': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: AlertCircle };
            default: return { bg: 'var(--surface-hover)', color: 'var(--txt-2)', icon: FileText };
        }
    };

    return (
        <ClinicLayout>
            <Head title={t('Treatment Plans')} />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold transition-colors" style={{ color: 'var(--txt-1)' }}>{t('Treatment Plans')}</h1>
                        <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Clinical narratives & complex operations')}</p>
                    </div>
                    <Link
                        href={route('clinic.treatment-plans.create')}
                        className="btn-primary"
                    >
                        <Plus size={16} /> {t('Create Treatment Plan')}
                    </Link>
                </div>

                <div className="card shadow-sm overflow-hidden">
                    <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('Search plans or patients...')}
                                className="app-input pl-9"
                            />
                        </form>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                router.get(route('clinic.treatment-plans.index'), { search, status: e.target.value }, { preserveState: true });
                            }}
                            className="app-input w-full md:w-40"
                        >
                            <option value="">{t('All Statuses')}</option>
                            <option value="draft">{t('Draft')}</option>
                            <option value="active">{t('Active')}</option>
                            <option value="completed">{t('Completed')}</option>
                            <option value="cancelled">{t('Cancelled')}</option>
                        </select>
                    </div>

                    <div className="flex flex-col divide-y transition-colors" style={{ borderColor: 'var(--border)' }}>
                        {plans.data.map((plan) => {
                            const st = getStatusStyle(plan.status);
                            const StatusIcon = st.icon;
                            return (
                                <Link 
                                    key={plan.id}
                                    href={route('clinic.treatment-plans.show', plan.id)}
                                    className="p-5 flex flex-col md:flex-row md:items-center justify-between group transition-colors hover:bg-black/5 light:hover:bg-white/50"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                            style={{ background: 'var(--surface)', color: 'var(--txt-2)' }}>
                                            <Stethoscope size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[14px] transition-colors" style={{ color: 'var(--txt-1)' }}>{plan.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-[12.5px]" style={{ color: 'var(--txt-2)' }}>
                                                <User size={14} style={{ color: 'var(--txt-3)' }} />
                                                {plan.patient.first_name} {plan.patient.last_name}
                                                <span style={{ color: 'var(--border-strong)' }}>•</span>
                                                <span style={{ color: 'var(--txt-3)' }} className="truncate max-w-[200px] md:max-w-md">
                                                    {plan.description || t('No description provided')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t md:border-t-0 pt-4 md:pt-0" style={{ borderColor: 'var(--border)' }}>
                                        <div 
                                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                                            style={{ backgroundColor: st.bg, color: st.color, border: `1px solid ${st.color}30` }}
                                        >
                                            <StatusIcon size={12} />
                                            {t(plan.status).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white"
                                                style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                                                {plan.creator.name.charAt(0)}
                                            </div>
                                            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--txt-3)' }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {plans.data.length === 0 && (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 animate-pulseGlow" style={{ background: 'var(--surface-hover)', color: 'var(--txt-3)' }}>
                                    <Stethoscope size={28} />
                                </div>
                                <div className="text-[14px] font-medium" style={{ color: 'var(--txt-2)' }}>{t('No treatment plans created yet')}</div>
                                <Link href={route('clinic.treatment-plans.create')} className="btn-primary mt-2">
                                    <Plus size={16} /> {t('Create Your First Plan')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
