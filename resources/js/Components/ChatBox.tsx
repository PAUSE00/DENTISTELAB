import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Send, Paperclip, Check, CheckCheck, Loader2, MessageSquare } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Message {
    id: number;
    content: string | null;
    attachment_path?: string | null;
    read_at?: string | null;
    user_id: number;
    user_name?: string;
    created_at: string;
    user?: { id: number; name: string; };
}

interface Props {
    orderId: number;
    initialMessages?: Message[];
    compact?: boolean;
    className?: string;
}

const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Avatar initials
const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export default function ChatBox({ orderId, compact = false, className = '' }: Props) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const [messages, setMessages]     = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isLoading, setIsLoading]   = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef  = useRef<HTMLDivElement>(null);
    const fileInputRef    = useRef<HTMLInputElement>(null);
    const typingTimeout   = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchMessages = () => {
            axios.get(route('chat.index', orderId))
                .then(r => { setMessages(r.data); setTimeout(scrollToBottom, 200); })
                .catch(console.error);
        };
        fetchMessages();

        if (window.Echo) {
            const ch = window.Echo.private(`orders.${orderId}`);

            ch.listen('.message.sent', (e: any) => {
                const msg: Message = e.message;
                setMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    setTimeout(scrollToBottom, 100);
                    axios.post(route('chat.read', orderId)).catch(console.error);
                    return [...prev, { ...msg, user_name: msg.user?.name }];
                });
                setTypingUser(null);
            });

            ch.listenForWhisper('typing', (e: any) => {
                if (e.userId !== user.id) {
                    setTypingUser(e.userName);
                    if (typingTimeout.current) clearTimeout(typingTimeout.current);
                    typingTimeout.current = setTimeout(() => setTypingUser(null), 3000);
                }
            });
        }

        return () => {
            if (window.Echo) window.Echo.leave(`orders.${orderId}`);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [orderId, user.id]);

    const scrollToBottom = () =>
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (window.Echo) {
            window.Echo.private(`orders.${orderId}`)
                .whisper('typing', { userId: user.id, userName: user.name });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setAttachment(e.target.files[0]);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachment) return;
        setIsLoading(true);
        try {
            const fd = new FormData();
            if (newMessage.trim()) fd.append('content', newMessage);
            if (attachment) fd.append('attachment', attachment);

            const res = await axios.post(route('chat.store', orderId), fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessages(prev => [...prev, {
                ...res.data,
                user_name: user.name,
                user: { id: user.id, name: user.name },
            }]);
            setNewMessage('');
            setAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            scrollToBottom();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const height = compact ? 'h-[400px]' : 'h-[500px]';

    return (
        <div className={`flex flex-col ${height} ${className}`}
             style={{ background: 'var(--bg-base)' }}>

            {/* ── Header (only when not compact) ──────────────────── */}
            {!compact && (
                <div className="px-4 py-3 border-b flex items-center gap-2.5"
                     style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{ background: '#60ddc6' }} />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5"
                              style={{ background: '#60ddc6' }} />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest"
                          style={{ color: '#60ddc6' }}>
                        {t('Lab Chat')} · {t('Live')}
                    </span>
                </div>
            )}

            {/* ── Messages area ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4"
                 style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}>

                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-20">
                        <MessageSquare size={32} />
                        <p className="text-xs font-bold">{t('No messages yet — start the conversation!')}</p>
                    </div>
                ) : (
                    messages.map(msg => {
                        const isOwn = msg.user_id === user.id;
                        const name  = msg.user_name ?? msg.user?.name ?? 'User';

                        return (
                            <div key={msg.id}
                                 className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar */}
                                {!isOwn && (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                                         style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8' }}>
                                        {getInitials(name)}
                                    </div>
                                )}

                                <div className={`flex flex-col gap-1 max-w-[78%] ${isOwn ? 'items-end' : 'items-start'}`}>

                                    {/* Sender name */}
                                    {!isOwn && (
                                        <span className="text-[10px] font-bold ml-1"
                                              style={{ color: '#818cf8' }}>
                                            {name}
                                        </span>
                                    )}

                                    {/* Bubble */}
                                    <div className={`relative px-3.5 py-2.5 text-[13px] leading-relaxed ${
                                        isOwn
                                            ? 'rounded-2xl rounded-br-md'
                                            : 'rounded-2xl rounded-bl-md'
                                    }`}
                                         style={isOwn ? {
                                             background: 'linear-gradient(135deg, #60ddc6, #34d399)',
                                             color: 'rgba(0,0,0,0.85)',
                                         } : {
                                             background: 'var(--bg-raised)',
                                             color: 'var(--txt-1)',
                                             border: '1px solid var(--border)',
                                         }}>

                                        {/* Attachment */}
                                        {msg.attachment_path && (
                                            <div className="mb-2">
                                                {msg.attachment_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                    <a href={`/storage/${msg.attachment_path}`} target="_blank" rel="noreferrer">
                                                        <img
                                                            src={`/storage/${msg.attachment_path}`}
                                                            alt="attachment"
                                                            className="rounded-xl max-h-44 object-cover hover:opacity-90 transition-opacity"
                                                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                        />
                                                    </a>
                                                ) : (
                                                    <a href={`/storage/${msg.attachment_path}`}
                                                       target="_blank" rel="noreferrer"
                                                       className="flex items-center gap-2 p-2 rounded-xl text-[11px] font-semibold transition-all hover:opacity-80"
                                                       style={{
                                                           background: isOwn ? 'rgba(0,0,0,0.12)' : 'var(--surface)',
                                                           border: '1px solid rgba(255,255,255,0.08)',
                                                       }}>
                                                        <Paperclip size={12} />
                                                        <span className="truncate max-w-[140px]">
                                                            {msg.attachment_path.split('/').pop()}
                                                        </span>
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {msg.content && (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        )}

                                        {/* Timestamp + read receipt */}
                                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[9.5px]"
                                                  style={{ color: isOwn ? 'rgba(0,0,0,0.45)' : 'var(--txt-4)' }}>
                                                {fmtTime(msg.created_at)}
                                            </span>
                                            {isOwn && (
                                                msg.read_at
                                                    ? <CheckCheck size={11} style={{ color: isOwn ? 'rgba(0,0,0,0.5)' : '#60ddc6' }} />
                                                    : <Check size={11} style={{ color: 'rgba(0,0,0,0.35)' }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Typing indicator */}
                {typingUser && (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                             style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8' }}>
                            {getInitials(typingUser)}
                        </div>
                        <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-1.5"
                             style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                            <span className="text-[10px] font-semibold" style={{ color: 'var(--txt-3)' }}>
                                {typingUser}
                            </span>
                            <span className="flex gap-0.5">
                                {[0, 0.2, 0.4].map(d => (
                                    <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                          style={{ background: 'var(--txt-4)', animationDelay: `${d}s` }} />
                                ))}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* ── Attachment preview ───────────────────────────────── */}
            {attachment && (
                <div className="px-4 py-2 flex items-center justify-between border-t"
                     style={{ borderColor: 'var(--border)', background: 'rgba(96,221,198,0.05)' }}>
                    <div className="flex items-center gap-2 text-[11px] font-semibold truncate"
                         style={{ color: '#60ddc6' }}>
                        <Paperclip size={12} />
                        <span className="truncate max-w-[200px]">{attachment.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="text-[11px] font-bold ml-3 hover:text-rose-400 transition-colors"
                        style={{ color: 'var(--txt-3)' }}>
                        {t('Remove')}
                    </button>
                </div>
            )}

            {/* ── Input bar ────────────────────────────────────────── */}
            <form onSubmit={sendMessage}
                  className="px-3 py-3 flex items-center gap-2 border-t"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>

                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-all hover:border-[#60ddc6]/40 hover:text-[#60ddc6] hover:bg-[#60ddc6]/06"
                    style={{ borderColor: 'var(--border)', color: 'var(--txt-3)', background: 'var(--surface)' }}>
                    <Paperclip size={15} />
                </button>

                <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder={t('Type a message...')}
                    disabled={isLoading}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { sendMessage(e); } }}
                    className="flex-1 h-9 px-3.5 rounded-xl text-[13px] outline-none border transition-all"
                    style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--txt-1)',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#60ddc650')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
                />

                <button
                    type="submit"
                    disabled={isLoading || (!newMessage.trim() && !attachment)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #60ddc6, #34d399)', color: 'rgba(0,0,0,0.8)' }}>
                    {isLoading
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Send size={14} style={{ transform: 'translateX(1px)' }} />
                    }
                </button>
            </form>
        </div>
    );
}
