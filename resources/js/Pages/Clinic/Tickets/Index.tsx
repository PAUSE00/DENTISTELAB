import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Ticket as TicketIcon, AlertCircle, Clock, CheckCircle, Plus, X, MessageSquare, ChevronRight, Inbox, LifeBuoy } from 'lucide-react';
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
    messages_count?: number;
}

interface Props extends PageProps {
    tickets: { data: Ticket[], links: any[], total?: number };
}

export default function Index({ tickets }: Props) {
    const { t } = useTranslation();

    const StatusBadge = ({ s }: { s: string }) => {
        let colors = { bg: 'var(--accent-10)', border: 'var(--accent)', text: 'var(--accent)', icon: CheckCircle };
        if (s === 'open') colors = { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.5)', text: '#fbbf24', icon: AlertCircle };
        if (s === 'in_progress') colors = { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.5)', text: '#38bdf8', icon: Clock };
        const Icon = colors.icon;

        return (
            <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
            >
                <Icon size={12} />
                {t(s.replace('_', ' '))}
            </span>
        );
    };

    const stats = [
        { label: 'Total Tickets', value: tickets.total || tickets.data.length, icon: Inbox, color: 'var(--txt-1)' },
        { label: 'Open', value: tickets.data.filter(t => t.status === 'open').length, icon: AlertCircle, color: '#fbbf24' },
        { label: 'Resolved', value: tickets.data.filter(t => t.status === 'resolved' || t.status === 'closed').length, icon: CheckCircle, color: 'var(--accent)' }
    ];

    return (
        <ClinicLayout header={t('Support Helpdesk')}>
            <Head title={t('Support Tickets')} />

            <div className="animate-fade-in space-y-6 pb-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl overflow-hidden relative border"
                     style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    
                    {/* Background decorations matching the theme */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.03] translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'var(--accent)' }}/>
                    <div className="absolute bottom-0 left-12 w-32 h-32 rounded-full opacity-[0.02] translate-y-1/2 pointer-events-none" style={{ background: 'var(--accent)' }}/>

                    <div className="relative z-10 flex items-center gap-6 flex-1">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border"
                             style={{ background: 'var(--accent-10)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                            <LifeBuoy className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                                {t('Need Help?')}
                            </p>
                            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                                {t('Support Tickets')}
                            </h2>
                            <p className="text-[13px] mt-1 max-w-lg" style={{ color: 'var(--txt-3)' }}>
                                {t('Create a new ticket or manage your existing requests. We are here to help.')}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-3 shrink-0">
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-3 px-5 rounded-2xl border"
                                 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <span className="text-xl font-bold font-mono tracking-tight" style={{ color: s.color }}>{s.value}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--txt-3)' }}>{t(s.label)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center px-2 pt-2">
                    <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>
                        {t('Recent Tickets')}
                    </p>
                    <Link
                        href={route('clinic.tickets.create')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:bg-opacity-90 active:scale-95 shadow-lg group"
                        style={{ background: 'var(--accent-grad)', color: '#ffffff', boxShadow: '0 4px 20px rgba(96,221,198,0.25)' }}
                    >
                        <Plus size={16} className="transition-transform group-hover:rotate-90" />
                        {t('New Ticket')}
                    </Link>
                </div>

                {/* Tickets List */}
                <div className="space-y-3">
                    {tickets.data.length > 0 ? tickets.data.map((tck: Ticket) => (
                        <div
                            key={tck.id}
                            className="group relative flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all cursor-pointer hover:border-[var(--accent)]"
                            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
                            onClick={() => router.visit(route('clinic.tickets.show', tck.id))}
                        >
                            {/* Hover accent strip */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'var(--accent)' }} />

                            <div className="flex gap-4 items-center flex-1">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors group-hover:bg-[var(--accent-10)] group-hover:border-[var(--accent)]" 
                                     style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                    <TicketIcon className="w-5 h-5 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--txt-3)' }} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[15px] font-bold truncate transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--txt-1)' }}>
                                        {tck.subject}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                                        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                            #{tck.id}
                                        </span>
                                        <div className="w-1 h-1 rounded-full opacity-30" style={{ background: 'var(--txt-3)' }} />
                                        <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>
                                            {new Date(tck.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="w-1 h-1 rounded-full opacity-30" style={{ background: 'var(--txt-3)' }} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                                            {t(tck.category.replace('_', ' '))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 pl-16 md:pl-0 mt-2 md:mt-0">
                                <div className="flex flex-col items-end gap-1.5">
                                    <StatusBadge s={tck.status} />
                                    <span
                                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                        style={{ color: tck.priority === 'urgent' || tck.priority === 'high' ? '#f43f5e' : 'var(--txt-3)' }}
                                    >
                                        {tck.priority === 'urgent' || tck.priority === 'high' ? <AlertCircle size={10} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />}
                                        {t(tck.priority)} {t('Priority')}
                                    </span>
                                </div>
                                
                                <div className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all group-hover:bg-[var(--accent)] group-hover:text-[#0d1f1a] group-hover:border-[var(--accent)]"
                                     style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center rounded-3xl border border-dashed" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                    <LifeBuoy className="w-8 h-8 opacity-30" style={{ color: 'var(--txt-1)' }} />
                                </div>
                                <div>
                                    <p className="font-bold text-[15px] mb-1" style={{ color: 'var(--txt-1)' }}>{t('No Support Tickets')}</p>
                                    <p className="text-[13px] max-w-sm mx-auto" style={{ color: 'var(--txt-3)' }}>
                                        {t('If you are experiencing issues or have questions, feel free to open a ticket here.')}
                                    </p>
                                </div>
                                <Link
                                    href={route('clinic.tickets.create')}
                                    className="mt-4 px-6 py-2.5 rounded-xl border font-bold text-[12px] uppercase tracking-widest hover:bg-[var(--surface-hover)] transition-colors"
                                    style={{ borderColor: 'var(--border)', color: 'var(--txt-1)' }}
                                >
                                    {t('Create Ticket')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {tickets.links && tickets.links.length > 3 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination links={tickets.links} />
                    </div>
                )}

            </div>
        </ClinicLayout>
    );
}
