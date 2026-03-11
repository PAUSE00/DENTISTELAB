import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, MessageSquare, Clock, ArrowRight, User } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';

interface Conversation {
    id: number;
    patient: {
        id: number;
        first_name: string;
        last_name: string;
    };
    clinic: {
        id: number;
        name: string;
    };
    unread_count: number;
    latest_message_at: string;
    latest_message_content: string;
}

interface Props extends PageProps {
    conversations: {
        data: Conversation[];
        links: any[]; // Laravel exact paginator
    };
}

export default function Inbox({ auth, conversations }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const filtered = conversations.data.filter(c => {
        const q = search.toLowerCase();
        const pName = `${c.patient.first_name} ${c.patient.last_name}`.toLowerCase();
        const cName = c.clinic?.name?.toLowerCase() || '';
        return pName.includes(q) || cName.includes(q) || `ORD-${c.id}`.includes(q);
    });

    const formatRelativeTime = (isoString?: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t('just now');
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <LabLayout>
            <Head title={t('Messages')} />

            <div className="flex flex-col gap-6 max-w-5xl mx-auto h-[calc(100vh-100px)]">
                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                    <div>
                        <h1 className="text-[22px] font-black" style={{ color: 'var(--txt-1)' }}>
                            {t('Messages')}
                        </h1>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {t('All client communications across your orders')}
                        </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('Search messages...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-primary-500 disabled:opacity-50"
                            style={{ color: 'var(--txt-1)' }}
                        />
                    </div>
                </div>

                {/* ── Conversations List ────────────────────────── */}
                <div className="card flex-1 flex flex-col min-h-0">
                    <div className="px-5 py-4 border-b shrink-0 flex items-center justify-between"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        <div className="flex items-center gap-2">
                            <MessageSquare size={14} style={{ color: 'var(--txt-accent)' }} />
                            <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                {t('Active Conversations')}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0">
                        {filtered.length > 0 ? (
                            <div className="flex flex-col">
                                {filtered.map((conv) => (
                                    <Link
                                        key={conv.id}
                                        href={route('lab.orders.show', conv.id) + '#chat'}
                                        className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 border-b last:border-0 transition-colors relative"
                                        style={{ borderColor: 'var(--border)' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                                    >
                                        {/* Unread indicator blob */}
                                        {conv.unread_count > 0 && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'var(--txt-accent)' }} />
                                        )}

                                        {/* Avatar area */}
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ 
                                                background: conv.unread_count > 0 ? 'var(--teal-10)' : 'var(--surface)', 
                                                color: conv.unread_count > 0 ? 'var(--txt-accent)' : 'var(--txt-3)',
                                                border: '1px solid var(--border)' 
                                            }}>
                                            <User size={20} />
                                        </div>

                                        {/* Inner content */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-bold text-[14px] truncate" style={{ color: 'var(--txt-1)' }}>
                                                        {conv.clinic?.name || t('Unknown Clinic')}
                                                    </span>
                                                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                                                        style={{ background: 'var(--surface)', color: 'var(--txt-3)', border: '1px solid var(--border)' }}>
                                                        ORD-{conv.id}
                                                    </span>
                                                    {conv.unread_count > 0 && (
                                                        <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                                            style={{ background: '#f87171', color: '#fff' }}>
                                                            {conv.unread_count} {t('New')}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-1.5 shrink-0 text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                                    <Clock size={11} />
                                                    {formatRelativeTime(conv.latest_message_at)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[13px] truncate" style={{ 
                                                    color: conv.unread_count > 0 ? 'var(--txt-1)' : 'var(--txt-2)',
                                                    fontWeight: conv.unread_count > 0 ? 600 : 400
                                                }}>
                                                    {conv.latest_message_content || '📎 Attachment'}
                                                </p>
                                                
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-bold shrink-0"
                                                    style={{ color: 'var(--txt-accent)' }}>
                                                    {t('Open Chat')}
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-16 h-16 rounded-3xl flex items-center justify-center transform -rotate-12"
                                    style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}>
                                    <MessageSquare size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                        {search ? t('No matches found') : t('No conversations yet')}
                                    </p>
                                    <p className="text-[12px] mt-1" style={{ color: 'var(--txt-3)' }}>
                                        {search 
                                            ? t('Try adjusting your search query.') 
                                            : t('When clients send messages about their orders, they will appear here.')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}
