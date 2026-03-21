import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Send, ShieldCheck, CheckCircle, Ticket as TicketIcon } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import React, { useRef, useEffect } from 'react';

export default function TicketShow({ ticket }: PageProps<{ ticket: any }>) {
    const { t } = useTranslation();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ message: '' });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

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
                <div className="flex-1 rounded-2xl border overflow-hidden flex flex-col" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: 'var(--surface-hover)' }}>
                        {ticket.messages.map((msg: any) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.is_admin_reply ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                                
                                <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                                    style={{ 
                                        background: msg.is_admin_reply ? 'var(--accent-10)' : 'var(--surface)', 
                                        borderColor: msg.is_admin_reply ? 'var(--accent)' : 'var(--border)',
                                        color: msg.is_admin_reply ? 'var(--accent)' : 'var(--txt-2)'
                                    }}
                                >
                                    {msg.is_admin_reply ? <ShieldCheck className="w-4 h-4" /> : <span className="text-[11px] font-black">{msg.user.name.charAt(0)}</span>}
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <div 
                                        className={`px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${msg.is_admin_reply ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                                        style={{ 
                                            background: msg.is_admin_reply ? 'var(--accent)' : 'var(--bg-raised)', 
                                            color: msg.is_admin_reply ? '#0d1f1a' : 'var(--txt-1)',
                                            border: msg.is_admin_reply ? 'none' : '1px solid var(--border)'
                                        }}
                                    >
                                        {msg.message}
                                    </div>
                                    <span className={`text-[10px] font-bold opacity-60 px-1 ${msg.is_admin_reply ? 'text-right' : 'text-left'}`} style={{ color: 'var(--txt-3)' }}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    {ticket.status !== 'closed' ? (
                        <div className="p-4 border-t" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <input
                                    type="text"
                                    required
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder={t('Type your official response...')}
                                    className="flex-1 w-full px-5 py-3 rounded-xl text-[13px] outline-none transition-all"
                                    style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                />
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-[46px] h-[46px] flex items-center justify-center rounded-xl transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                                    style={{ background: 'var(--accent)', color: '#0d1f1a' }}
                                >
                                    <Send className="w-5 h-5 -ml-0.5" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 border-t text-center" style={{ background: 'rgba(244,63,94,0.05)', borderColor: 'var(--border)' }}>
                            <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#f43f5e' }}>
                                {t('This ticket is securely archived and closed.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
