import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Ticket as TicketIcon, Search, AlertCircle, Clock, CheckCircle, Navigation } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

interface Ticket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    category: string;
    created_at: string;
    user: { name: string, email: string };
}

interface Props extends PageProps {
    tickets: { data: Ticket[], links: any[], total?: number };
    filters: { status?: string };
}

export default function Tickets({ tickets, filters }: Props) {
    const { t } = useTranslation();
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = (v: string) => {
        setStatus(v);
        router.get(route('admin.tickets.index'), { status: v }, { preserveState: true, replace: true });
    };

    const StatusBadge = ({ s }: { s: string }) => {
        let colors = { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', text: '#34d399', icon: CheckCircle };
        if (s === 'open') colors = { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24', icon: AlertCircle };
        if (s === 'in_progress') colors = { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)', text: '#38bdf8', icon: Clock };
        const Icon = colors.icon;

        return (
            <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
            >
                <Icon size={10} />
                {t(s.replace('_', ' '))}
            </span>
        );
    };

    return (
        <AdminLayout header={t('Support Helpdesk')}>
            <Head title={t('Support Tickets')} />

            <div className="animate-fade-in space-y-6 pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                            {t('User Relations')}
                        </p>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('Support')} <span style={{ color: 'var(--accent)' }}>{t('Tickets')}</span>
                        </h2>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'open', 'in_progress', 'closed'].map(s => (
                        <button
                            key={s}
                            onClick={() => handleFilter(s)}
                            className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all border"
                            style={{
                                background: status === s ? 'var(--accent)' : 'var(--bg-raised)',
                                borderColor: status === s ? 'var(--accent)' : 'var(--border)',
                                color: status === s ? '#0d1f1a' : 'var(--txt-3)',
                                boxShadow: status === s ? '0 4px 16px rgba(96,221,198,0.2)' : 'none'
                            }}
                        >
                            {t(s.replace('_', ' '))}
                        </button>
                    ))}
                </div>

                {/* Modern Data List */}
                <div className="space-y-4">
                    {/* Header Row */}
                    {tickets.data.length > 0 && (
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-2 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>
                            <div className="col-span-3">{t('User & Clinic')}</div>
                            <div className="col-span-4">{t('Ticket Info')}</div>
                            <div className="col-span-2">{t('Category')}</div>
                            <div className="col-span-2">{t('Status')}</div>
                            <div className="col-span-1 text-right">{t('Action')}</div>
                        </div>
                    )}

                    {tickets.data.length > 0 ? tickets.data.map((tck: Ticket) => (
                        <div 
                            key={tck.id}
                            onClick={() => router.visit(route('admin.tickets.show', tck.id))}
                            className="group relative rounded-3xl p-5 lg:p-6 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden border"
                            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center relative z-10">
                                {/* 1. User Info */}
                                <div className="col-span-1 lg:col-span-3 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border relative transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-10)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                        <TicketIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--txt-1)' }}>
                                            {tck.user.name}
                                        </p>
                                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                            {tck.user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. Subject */}
                                <div className="col-span-1 lg:col-span-4 pr-4">
                                    <p className="text-[15px] font-bold truncate" style={{ color: 'var(--txt-1)' }}>
                                        <span className="opacity-50 font-normal mr-1.5" style={{ color: 'var(--txt-3)' }}>#{tck.id}</span>
                                        {tck.subject}
                                    </p>
                                    <p className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--txt-3)' }}>
                                        <Clock className="w-3.5 h-3.5 opacity-60" />
                                        {new Date(tck.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {/* 3. Priority & Category */}
                                <div className="col-span-1 lg:col-span-2 flex flex-col items-start gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                                        {tck.category}
                                    </span>
                                    <span 
                                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-1"
                                        style={{ color: tck.priority === 'urgent' || tck.priority === 'high' ? '#f43f5e' : 'var(--txt-3)' }}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                                        {tck.priority}
                                    </span>
                                </div>

                                {/* 4. Status */}
                                <div className="col-span-1 lg:col-span-2">
                                    <StatusBadge s={tck.status} />
                                </div>

                                {/* 5. Actions */}
                                <div className="hidden lg:flex col-span-1 justify-end">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-[var(--surface)] border border-[var(--border)] text-[var(--txt-2)] scale-90 opacity-50 group-hover:opacity-100 group-hover:scale-100 group-hover:bg-[var(--accent)] group-hover:text-[#0d1f1a] group-hover:border-transparent group-hover:shadow-[0_4px_16px_rgba(96,221,198,0.3)]">
                                        <Navigation className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <AlertCircle className="w-8 h-8 opacity-40" style={{ color: 'var(--txt-3)' }} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('No Tickets Found')}</h3>
                            <p className="text-[14px] max-w-sm opacity-80" style={{ color: 'var(--txt-3)' }}>
                                {t('Looks like all support queries matching this filter are resolved. Great job!')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {tickets.links && tickets.links.length > 3 && (
                        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-[12px] font-medium" style={{ color: 'var(--txt-3)' }}>
                                {t('Showing')} <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{tickets.data.length}</span> {t('of')} <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{tickets.total ?? tickets.data.length}</span> {t('tickets')}
                            </p>
                            <Pagination links={tickets.links} />
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
