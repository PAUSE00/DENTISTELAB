import LabLayout from '@/Layouts/LabLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
 Search, Edit, Phone, Video, MoreHorizontal, 
 Paperclip, Smile, Mic, Send, Check, CheckCheck, Loader2, Settings
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

interface Props extends PageProps {
 conversations: {
 data: Conversation[];
 links: any[]; 
 };
}

const patternSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='103.9' viewBox='0 0 60 103.9'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1' d='M30 0L60 17.3L30 34.6L0 17.3ZM60 17.3v34.6L30 69.2V34.6ZM0 17.3L30 34.6v34.6L0 51.9Z'/%3E%3C/svg%3E")`;

export default function Inbox({ auth, conversations }: Props) {
 const { t } = useTranslation();
 const user = usePage().props.auth.user;
 
 const [search, setSearch] = useState('');
 const [activeConv, setActiveConv] = useState<Conversation | null>(null);
 const [messages, setMessages] = useState<Message[]>([]);
 const [newMessage, setNewMessage] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const filtered = conversations.data.filter(c => {
 const q = search.toLowerCase();
 const pName = `${c.patient.first_name} ${c.patient.last_name}`.toLowerCase();
 const cName = c.clinic?.name?.toLowerCase() || '';
 return pName.includes(q) || cName.includes(q) || `ORD-${c.id}`.includes(q);
 });

 useEffect(() => {
 if (!activeConv) return;
 
 setIsLoading(true);
 axios.get(route('chat.index', activeConv.id))
 .then(res => {
 setMessages(res.data);
 setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
 })
 .catch(err => console.error(err))
 .finally(() => setIsLoading(false));

 // Mark read
 if (activeConv.unread_count > 0) {
 axios.post(route('chat.read', activeConv.id)).catch(() => {});
 activeConv.unread_count = 0;
 }

 if (window.Echo) {
 const channel = window.Echo.private(`orders.${activeConv.id}`);
 channel.listen('.message.sent', (e: any) => {
 setMessages(prev => {
 if (prev.find(m => m.id === e.message.id)) return prev;
 setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
 axios.post(route('chat.read', activeConv.id)).catch(() => {});
 return [...prev, { ...e.message, user_name: e.message.user?.name }];
 });
 });
 }

 return () => {
 if (window.Echo) window.Echo.leave(`orders.${activeConv.id}`);
 };
 }, [activeConv?.id]);

 const sendMessage = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newMessage.trim() || !activeConv) return;

 const content = newMessage;
 setNewMessage('');
 
 const tempId = Date.now();
 const tempMessage: Message = {
 id: tempId,
 content,
 user_id: user.id,
 user_name: user.name,
 created_at: new Date().toISOString(),
 read_at: null,
 };
 
 setMessages(prev => [...prev, tempMessage]);
 setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

 try {
 const formData = new FormData();
 formData.append('content', content);
 
 const res = await axios.post(route('chat.store', activeConv.id), formData);
 setMessages(prev => prev.map(m => m.id === tempId ? { ...res.data, user_name: user.name } : m));
 } catch (err) {
 console.error('Failed to send', err);
 }
 };

 const formatRelative = (iso?: string) => {
 if (!iso) return '';
 const date = new Date(iso);
 const diff = Math.floor((Date.now() - date.getTime()) / 1000);
 if (diff < 60) return 'just now';
 if (diff < 3600) return `${Math.floor(diff / 60)}m`;
 if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
 return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
 };

 const formatTime = (iso?: string) => {
 if (!iso) return '';
 return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 };

 const getInitials = (name?: string) => {
 if (!name) return 'U';
 return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
 };

 return (
 <LabLayout fullBleed={true}>
 <Head title={t('Messages')} />
 
 <div className="flex h-full w-full overflow-hidden relative"
 style={{ background: 'var(--bg-raised)', color: 'var(--txt-1)' }}>
 
 {/* ── LEFT SIDEBAR ── */}
 <div className="w-[340px] flex flex-col shrink-0 border-r relative z-10" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
 
 {/* Header */}
 <div className="p-6 pb-2">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-1.5 h-6 rounded-full" style={{ background: 'var(--purple)' }} />
 <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Messages')}</h1>
 </div>
 <button className="transition-colors" style={{ color: 'var(--txt-3)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'}>
 <Edit size={18} />
 </button>
 </div>
 
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: 'var(--txt-2)' }} />
 <input 
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder={t('Search conversations...')}
 className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border-none focus:ring-1"
 style={{ background: 'var(--bg)', color: 'var(--txt-1)', outline: 'none' }}
 />
 </div>
 </div>

 {/* Chat List */}
 <div className="flex-1 overflow-y-auto mt-4 px-3 pb-4 no-scrollbar border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-between mb-3 px-3 mt-4">
 <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--txt-3)' }}>ACTIVE CONVERSATIONS</span>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--purple-10)', color: 'var(--purple)' }}>
 {filtered.length}
 </span>
 </div>

 <div className="flex flex-col gap-1">
 {filtered.map(conv => {
 const isActive = activeConv?.id === conv.id;
 const initials = getInitials(conv.clinic?.name || '');
 
 return (
 <button
 key={conv.id}
 onClick={() => setActiveConv(conv)}
 className="flex items-start gap-3 p-3 w-full text-left rounded-2xl transition-all relative"
 style={{ background: isActive ? 'var(--bg)' : 'transparent' }}
 onMouseEnter={!isActive ? e => (e.currentTarget.style.background = 'var(--bg)') : undefined}
 onMouseLeave={!isActive ? e => (e.currentTarget.style.background = 'transparent') : undefined}
 >
 {isActive && (
 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md shadow-[0_0_10px_var(--purple)]" style={{ background: 'var(--purple)' }} />
 )}
 
 {/* Avatar */}
 <div className="relative shrink-0">
 <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white"
 style={{ background: isActive ? 'var(--purple)' : 'var(--border-strong)' }}>
 {initials}
 </div>
 <div className="absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full" style={{ background: 'var(--teal)', borderColor: 'var(--surface)' }} />
 </div>

 {/* Content */}
 <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
 <div className="flex items-center justify-between gap-2 mb-1">
 <span className="font-semibold text-sm truncate" style={{ color: 'var(--txt-1)' }}>
 {conv.clinic?.name}
 </span>
 <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: 'var(--txt-3)' }}>
 {formatRelative(conv.latest_message_at)}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <span className="shrink-0 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold border" style={{ background: 'var(--bg)', color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
 ORD-{conv.id}
 </span>
 <p className={`text-xs truncate ${conv.unread_count > 0 ? 'font-semibold' : ''}`} style={{ color: conv.unread_count > 0 ? 'var(--txt-1)' : 'var(--txt-2)' }}>
 {conv.latest_message_content || '📎 Attachment attached'}
 </p>
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Bottom User Area */}
 <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-overlay)' }}>
 <div className="flex items-center justify-between py-1">
 <div className="flex items-center gap-3">
 {user.avatar_path ? (
  <img src={`/storage/${user.avatar_path}`} className="w-10 h-10 rounded-full object-cover border-[1px] shadow-[0_0_15px_var(--purple)]" style={{ borderColor: 'var(--border)' }} alt="Avatar" />
 ) : (
  <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_var(--purple)]" style={{ background: 'var(--purple)' }}>
  {getInitials(user.name)}
  </div>
 )}
 <div className="flex flex-col">
 <span className="text-sm font-bold" style={{ color: 'var(--txt-1)' }}>{user.name}</span>
 <span className="text-[11px] font-medium" style={{ color: 'var(--teal)' }}>Active now</span>
 </div>
 </div>
 <button className="transition-colors" style={{ color: 'var(--txt-3)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'}>
 <Settings size={18} />
 </button>
 </div>
 </div>
 </div>

 {/* ── RIGHT CHAT AREA ── */}
 {activeConv ? (
 <div className="flex-1 flex flex-col relative" style={{ background: 'var(--bg)' }}>
 {/* Background Pattern */}
 <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: patternSvg, backgroundSize: '60px' }} />
 <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

 {/* Top Bar */}
 <div className="h-[76px] px-6 flex items-center justify-between border-b z-10 shrink-0"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-4">
 <div className="relative shrink-0">
 <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold shadow-lg" style={{ background: 'var(--purple)' }}>
 {getInitials(activeConv.clinic?.name)}
 </div>
 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 rounded-full" style={{ background: 'var(--teal)', borderColor: 'var(--surface)' }} />
 </div>
 <div className="flex flex-col">
 <span className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>{activeConv.clinic?.name}</span>
 <div className="flex items-center gap-1.5 mt-0.5">
 <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--teal)' }} />
 <span className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>Online</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-5" style={{ color: 'var(--txt-3)' }}>
 <Search size={18} className="cursor-pointer transition-colors" onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'} />
 <MoreHorizontal size={20} className="cursor-pointer transition-colors" onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'} />
 </div>
 </div>

 {/* Messages Flow */}
 <div className="flex-1 overflow-y-auto p-8 z-10 space-y-6">
 {isLoading ? (
 <div className="flex justify-center items-center h-full gap-3" style={{ color: 'var(--txt-3)' }}>
 <Loader2 className="w-5 h-5 animate-spin" /> Loading chat...
 </div>
 ) : messages.length === 0 ? (
 <div className="flex items-center justify-center h-full text-sm px-4 py-2 rounded-full w-max mx-auto border backdrop-blur-md"
 style={{ color: 'var(--txt-3)', background: 'var(--surface)', borderColor: 'var(--border)' }}>
 Start of conversation
 </div>
 ) : (
 <>
 <div className="flex justify-center my-6">
 <span className="text-[10px] font-bold px-4 py-1.5 rounded-full border tracking-wider"
 style={{ background: 'var(--surface)', color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
 TODAY
 </span>
 </div>
 {messages.map((msg, i) => {
 const isOwn = msg.user_id === user.id;
 return (
 <div key={msg.id || i} className={`w-full flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
 <div className="flex items-end gap-3 max-w-[70%]">
 {!isOwn && (
 <div className="w-8 h-8 rounded-full text-white flex shrink-0 items-center justify-center font-bold text-[10px]" style={{ background: 'var(--border-strong)' }}>
 {getInitials(msg.user_name || activeConv.clinic?.name)}
 </div>
 )}
 
 <div className="flex flex-col gap-1.5 relative group">
 <div className="px-5 py-3.5 text-[13.5px] shadow-sm leading-relaxed border"
 style={{ 
 background: isOwn ? 'var(--purple)' : 'var(--surface)',
 color: isOwn ? '#fff' : 'var(--txt-1)',
 borderColor: isOwn ? 'var(--purple)' : 'var(--border)',
 borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
 }}>
 {msg.content}
 {msg.attachment_path && (
 <a href={`/storage/${msg.attachment_path}`} target="_blank" rel="noreferrer" 
 className="mt-2 text-white/90 underline font-semibold flex items-center gap-2">
 <Paperclip size={14} /> Attachment Details
 </a>
 )}
 </div>

 {/* Timestamp and Read indicators inside / below */}
 {isOwn ? (
 <div className="absolute right-0 -bottom-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <span className="text-[10px] font-medium" style={{ color: 'var(--txt-3)' }}>
 {formatTime(msg.created_at)}
 </span>
 <CheckCheck size={14} style={{ color: 'var(--purple)' }} />
 </div>
 ) : (
 <div className="absolute left-0 -bottom-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold border"
 style={{ background: 'var(--surface)', color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
 {getInitials(msg.user_name || activeConv.clinic?.name)}
 </div>
 <span className="text-[10px] font-medium ml-1" style={{ color: 'var(--txt-3)' }}>
 {formatTime(msg.created_at)}
 </span>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 })}
 <div ref={messagesEndRef} className="h-6" />
 </>
 )}
 </div>

 {/* Input Area */}
 <div className="p-6 backdrop-blur-xl border-t z-10 shrink-0 flex flex-col" style={{ borderColor: 'var(--border)', background: 'rgba(var(--bg), 0.5)' }}>
 <form onSubmit={sendMessage} className="flex items-center border rounded-full p-1.5 shadow-lg group focus-within:border-[var(--txt-accent)] transition-colors"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <button type="button" className="p-2.5 transition-colors" style={{ color: 'var(--txt-3)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'}>
 <Paperclip size={18} />
 </button>
 <button type="button" className="p-2 ml-1 transition-colors" style={{ color: 'var(--txt-3)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'}>
 <Smile size={18} />
 </button>
 
 <input 
 type="text" 
 value={newMessage}
 onChange={e => setNewMessage(e.target.value)}
 placeholder="Write a message..."
 className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
 style={{ color: 'var(--txt-1)' }}
 />

 <button type="button" className="p-2.5 mr-1 transition-colors" style={{ color: 'var(--txt-3)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--txt-1)'} onMouseOut={e => e.currentTarget.style.color = 'var(--txt-3)'}>
 <Mic size={18} />
 </button>
 <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors disabled:opacity-50 shadow-[0_0_15px_var(--purple)]"
 style={{ background: 'var(--purple)' }}>
 <Send size={16} className="-ml-0.5" />
 </button>
 </form>
 
 <div className="flex items-center justify-center gap-4 mt-6 opacity-40">
 <div className="w-16 h-px" style={{ background: 'var(--txt-3)' }} />
 <span className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--txt-3)' }}>
 End-to-end encrypted
 </span>
 <div className="w-16 h-px" style={{ background: 'var(--txt-3)' }} />
 </div>
 </div>

 </div>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center relative z-0" style={{ background: 'var(--bg)', color: 'var(--txt-3)' }}>
 <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: patternSvg, backgroundSize: '60px' }} />
 <div className="w-20 h-20 rounded-full border flex items-center justify-center mb-6 shadow-2xl z-10" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <Smile className="w-10 h-10" />
 </div>
 <h2 className="text-xl font-bold mb-2 z-10" style={{ color: 'var(--txt-2)' }}>Your Messages</h2>
 <p className="z-10 text-sm">Select a conversation from the left to start chatting</p>
 </div>
 )}
 </div>
 </LabLayout>
 );
}
