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

                {/* Data Table */}
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px] border-collapse">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                                    {['Reference', 'Subject', 'Context', 'Status', 'Actions'].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60 ${i === 4 ? 'text-right' : ''}`}
                                            style={{ color: 'var(--txt-2)' }}
                                        >{t(h)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.data.length > 0 ? tickets.data.map((tck: Ticket) => (
                                    <tr
                                        key={tck.id}
                                        className="group border-b transition-colors hover:bg-[var(--surface-hover)] last:border-0 cursor-pointer"
                                        style={{ borderColor: 'var(--border)' }}
                                        onClick={() => router.visit(route('admin.tickets.show', tck.id))}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-10)', border: '1px solid var(--border)' }}>
                                                    <TicketIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                                    <span className="absolute text-[8px] font-black translate-y-3" style={{ color: 'var(--accent)' }}>#{tck.id}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>{tck.user.name}</p>
                                                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{tck.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-[14px] font-semibold truncate max-w-sm transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--txt-1)' }}>
                                                {tck.subject}
                                            </p>
                                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                                {new Date(tck.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                                                    {tck.category}
                                                </span>
                                                <span
                                                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                                                    style={{ color: tck.priority === 'urgent' || tck.priority === 'high' ? '#f43f5e' : 'var(--txt-3)' }}
                                                >
                                                    <div className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
                                                    {tck.priority} Priority
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <StatusBadge s={tck.status} />
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button className="p-2 rounded-xl transition-all" style={{ background: 'var(--accent-10)', color: 'var(--accent)' }}>
                                                    <Navigation className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                                                    <TicketIcon className="w-7 h-7" style={{ color: 'var(--txt-3)' }} />
                                                </div>
                                                <p className="font-bold text-[13px]" style={{ color: 'var(--txt-1)' }}>{t('No Tickets Found')}</p>
                                                <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('Looks like all support queries are resolved. Great job!')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {tickets.links && tickets.links.length > 3 && (
                        <div className="px-6 py-4 border-t flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                {t('Showing')} <span className="font-bold" style={{ color: 'var(--txt-2)' }}>{tickets.data.length}</span> {t('of')} {tickets.total ?? tickets.data.length} {t('tickets')}
                            </p>
                            <Pagination links={tickets.links} />
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
