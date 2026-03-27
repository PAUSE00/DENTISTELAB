import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Send, ShieldCheck, CheckCircle, Ticket as TicketIcon, MessageSquare } from 'lucide-react';
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
        (window as any).Echo?.private(`tickets.${ticket.id}`)
            ?.listen('TicketMessageSent', () => {
                router.reload({ only: ['ticket'] });
            });

        return () => {
            (window as any).Echo?.leave(`tickets.${ticket.id}`);
        };
    }, [ticket.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    return (
        <AdminLayout header={`Ticket #${ticket.id}`}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="max-w-4xl mx-auto animate-fade-in space-y-6 pb-12 flex flex-col pt-4 h-[calc(100vh-100px)]">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.tickets.index')}
                            className="p-2.5 rounded-xl border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <TicketIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                                    {t('Ticket')} #{ticket.id}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight line-clamp-1" style={{ color: 'var(--txt-1)' }}>
                                {ticket.subject}
                            </h2>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                {t('From')} <span className="font-semibold" style={{ color: 'var(--txt-2)' }}>{ticket.user.name}</span> &bull; {new Date(ticket.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    {ticket.status !== 'closed' && (
                        <div className="ml-auto">
                            <Link 
                                href={route('admin.tickets.close', ticket.id)} 
                                method="patch" 
                                as="button" 
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
                            >
                                <CheckCircle className="w-4 h-4" />
                                {t('Mark as Resolved')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Chat Container */}
                <div className="flex-1 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    
                    {/* Background glow for depth */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 scrollbar-thin" style={{ background: 'var(--surface-hover)' }}>
                        {ticket.messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-40">
                                <MessageSquare className="w-12 h-12 mb-4" />
                                <p className="text-[14px] font-medium">{t('No messages yet. Send an official response below!')}</p>
                            </div>
                        )}
                        {ticket.messages.map((msg: any) => (
                            <div key={msg.id} className={`flex w-full ${msg.is_admin_reply ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3.5 max-w-[85%] sm:max-w-[75%] ${msg.is_admin_reply ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div 
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-auto mb-1"
                                        style={{ 
                                            background: msg.is_admin_reply ? 'var(--accent)' : 'var(--surface)', 
                                            border: msg.is_admin_reply ? 'none' : '1px solid var(--border)',
                                            color: msg.is_admin_reply ? '#0d1f1a' : 'var(--txt-1)'
                                        }}
                                    >
                                        {msg.is_admin_reply ? <ShieldCheck className="w-5 h-5" /> : <span className="text-[13px] font-black">{msg.user.name.charAt(0)}</span>}
                                    </div>
                                    
                                    {/* Bubble */}
                                    <div className="flex flex-col gap-1.5 min-w-[150px]">
                                        <div className={`flex items-baseline gap-2 px-1 ${msg.is_admin_reply ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: msg.is_admin_reply ? 'var(--accent)' : 'var(--txt-2)' }}>
                                                {msg.is_admin_reply ? t('Support Admin (You)') : msg.user.name}
                                            </span>
                                            <span className="text-[10px] font-bold opacity-60" style={{ color: 'var(--txt-3)' }}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div 
                                            className={`px-5 py-3.5 text-[14.5px] font-medium leading-[1.6] whitespace-pre-wrap shadow-md ${msg.is_admin_reply ? 'rounded-3xl rounded-br-sm' : 'rounded-3xl rounded-bl-sm'}`}
                                            style={{ 
                                                background: msg.is_admin_reply ? 'var(--accent)' : 'var(--surface)', 
                                                color: msg.is_admin_reply ? '#0d1f1a' : 'var(--txt-1)',
                                                border: msg.is_admin_reply ? '1px solid transparent' : '1px solid var(--border)'
                                            }}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                        placeholder={t('Type your official response...')}
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
                            <div className="w-14 h-14 rounded-full border shadow-sm flex items-center justify-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: '#f43f5e' }}>
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[14px] font-bold uppercase tracking-widest" style={{ color: '#f43f5e' }}>
                                    {t('This ticket is securely archived and closed.')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
