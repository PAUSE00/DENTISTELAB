import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Send, ShieldCheck, Ticket as TicketIcon, Clock, AlertCircle, CheckCircle, Tag, Calendar, Info, MessageSquare } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import React, { useRef, useEffect } from 'react';

export default function TicketShow({ ticket }: PageProps<{ ticket: any }>) {
    const { t } = useTranslation();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ message: '' });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

    // Real-time: listen for new messages via Laravel Echo
    useEffect(() => {
        const channel = (window as any).Echo?.private(`tickets.${ticket.id}`)
            ?.listen('TicketMessageSent', () => {
                router.reload({ only: ['ticket'] });
            });

        return () => {
            (window as any).Echo?.leave(`tickets.${ticket.id}`);
        };
    }, [ticket.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clinic.tickets.reply', ticket.id), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    const StatusBadge = ({ s }: { s: string }) => {
        let colors = { bg: 'var(--accent-10)', border: 'var(--accent)', text: 'var(--accent)', icon: CheckCircle };
        if (s === 'open') colors = { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.5)', text: '#fbbf24', icon: AlertCircle };
        if (s === 'in_progress') colors = { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.5)', text: '#38bdf8', icon: Clock };
        const Icon = colors.icon;
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
                <Icon size={12} />
                {t(s.replace('_', ' '))}
            </span>
        );
    };

    const PriorityBadge = ({ p }: { p: string }) => {
        const isUrgent = p === 'urgent' || p === 'high';
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ 
                      background: isUrgent ? 'rgba(244,63,94,0.1)' : 'var(--surface)', 
                      borderColor: isUrgent ? 'rgba(244,63,94,0.5)' : 'var(--border)', 
                      color: isUrgent ? '#f43f5e' : 'var(--txt-2)' 
                  }}>
                {isUrgent ? <AlertCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />}
                {t(p)}
            </span>
        );
    };

    return (
        <ClinicLayout header={`${t('Ticket')} #${ticket.id}`}>
            <Head title={`${t('Ticket')} #${ticket.id}`} />

            <div className="max-w-6xl mx-auto animate-fade-in pb-12 pt-6 px-4 sm:px-6">
                
                {/* Back Navigation */}
                <Link
                    href={route('clinic.tickets.index')}
                    className="inline-flex items-center gap-2 text-[13px] font-bold mb-6 transition-colors hover:text-[var(--accent)] group w-fit"
                    style={{ color: 'var(--txt-3)' }}
                >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-10)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    {t('Back to Tickets')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Sidebar: Ticket Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 md:p-8 rounded-3xl border shadow-lg relative overflow-hidden" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                    <TicketIcon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--txt-3)' }}>{t('Ticket ID')}</h3>
                                    <p className="text-xl font-bold font-mono" style={{ color: 'var(--txt-1)' }}>#{ticket.id}</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--txt-3)' }}>{t('Subject')}</h4>
                                    <p className="text-[14px] font-semibold leading-snug" style={{ color: 'var(--txt-1)' }}>{ticket.subject}</p>
                                </div>
                                
                                <div className="h-px w-full my-4" style={{ background: 'var(--border)' }} />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-2)' }}>
                                        <Info className="w-4 h-4" /> {t('Status')}
                                    </div>
                                    <StatusBadge s={ticket.status} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-2)' }}>
                                        <AlertCircle className="w-4 h-4" /> {t('Priority')}
                                    </div>
                                    <PriorityBadge p={ticket.priority} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-2)' }}>
                                        <Tag className="w-4 h-4" /> {t('Category')}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
                                        {t(ticket.category.replace('_', ' '))}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-2)' }}>
                                        <Calendar className="w-4 h-4" /> {t('Created On')}
                                    </div>
                                    <span className="text-[12px] font-medium" style={{ color: 'var(--txt-1)' }}>
                                        {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column: Chat Area */}
                    <div className="lg:col-span-8 flex flex-col rounded-3xl border shadow-xl h-[70vh] md:h-[800px] overflow-hidden relative" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                        {/* Background glow for depth */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

                        {/* Top Bar for Chat */}
                        <div className="flex items-center justify-between px-6 py-5 border-b relative z-20" style={{ background: 'rgba(var(--bg-raised-rgb), 0.5)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
                             <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 rounded-full flex items-center justify-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                                      <MessageSquare className="w-5 h-5" />
                                  </div>
                                  <div>
                                       <h2 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Ticket Discussion')}</h2>
                                       <p className="text-[12px] mt-0.5 flex items-center gap-1.5 font-medium" style={{ color: 'var(--txt-3)' }}>
                                            <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: ticket.status === 'closed' ? 'var(--border)' : 'var(--accent)', color: ticket.status === 'closed' ? 'transparent' : 'var(--accent)' }} />
                                            {ticket.status === 'closed' ? t('Closed') : t('Active Support')}
                                       </p>
                                  </div>
                             </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 scrollbar-thin">
                            {ticket.messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-40">
                                    <MessageSquare className="w-12 h-12 mb-4" />
                                    <p className="text-[14px] font-medium">{t('No messages yet. Send one below!')}</p>
                                </div>
                            )}

                            {ticket.messages.map((msg: any) => {
                                const isUser = !msg.is_admin_reply;
                                return (
                                    <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-3.5 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            <div 
                                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-auto mb-1"
                                                style={{ 
                                                    background: isUser ? 'var(--accent)' : 'var(--surface)', 
                                                    border: isUser ? 'none' : '1px solid var(--border)',
                                                    color: isUser ? '#0d1f1a' : 'var(--accent)'
                                                }}
                                            >
                                                {isUser ? <span className="text-[13px] font-black">{msg.user.name.charAt(0)}</span> : <ShieldCheck className="w-5 h-5" />}
                                            </div>
                                            
                                            {/* Bubble */}
                                            <div className="flex flex-col gap-1.5 min-w-[150px]">
                                                <div className={`flex items-baseline gap-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: isUser ? 'var(--accent)' : 'var(--txt-2)' }}>
                                                        {isUser ? t('You') : t('Support Admin')}
                                                    </span>
                                                    <span className="text-[10px] font-bold opacity-60" style={{ color: 'var(--txt-3)' }}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div 
                                                    className={`px-5 py-3.5 text-[14.5px] font-medium leading-[1.6] whitespace-pre-wrap shadow-md ${isUser ? 'rounded-3xl rounded-br-sm' : 'rounded-3xl rounded-bl-sm'}`}
                                                    style={{ 
                                                        background: isUser ? 'var(--accent)' : 'var(--surface)', 
                                                        color: isUser ? '#0d1f1a' : 'var(--txt-1)',
                                                        border: isUser ? '1px solid transparent' : '1px solid var(--border)'
                                                    }}
                                                >
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} className="h-4" />
                        </div>

                        {/* Input Area */}
                        {ticket.status !== 'closed' ? (
                            <div className="p-4 sm:p-6 sm:pb-8 shrink-0 relative z-20">
                                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
                                    <div className="flex items-center gap-2 rounded-full p-2 pl-6 shadow-xl border transition-all focus-within:ring-4 focus-within:ring-opacity-20"
                                         style={{ background: 'var(--surface)', borderColor: 'var(--border)', '--tw-ring-color': 'var(--accent)' } as any}>
                                        <input
                                            type="text"
                                            autoFocus
                                            required
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            placeholder={t('Type your message...')}
                                            className="flex-1 bg-transparent border-none outline-none text-[15px] p-0 focus:ring-0 placeholder:opacity-40"
                                            style={{ color: 'var(--txt-1)' }}
                                            autoComplete="off"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.message.trim()} 
                                            className="w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 shadow-md"
                                            style={{ background: 'var(--accent)', color: '#0d1f1a' }}
                                        >
                                            <Send className="w-5 h-5 -ml-0.5" />
                                        </button>
                                    </div>
                                    <div className="text-center mt-3">
                                        <p className="text-[10px] font-medium uppercase tracking-widest opacity-50" style={{ color: 'var(--txt-3)' }}>
                                            {t('Press Enter to send securely')}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="p-8 text-center shrink-0 flex flex-col items-center gap-3 relative z-20" style={{ background: 'var(--surface-hover)' }}>
                                <div className="w-14 h-14 rounded-full border shadow-sm flex items-center justify-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                        {t('This ticket has been closed.')}
                                    </p>
                                    <p className="text-[12px] mt-1.5" style={{ color: 'var(--txt-3)' }}>
                                        {t('If you need further assistance, please open a new ticket.')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
