import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Send, Paperclip, Check, CheckCheck, Loader2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Message {
    id: number;
    content: string | null;
    attachment_path?: string | null;
    read_at?: string | null;
    user_id: number;
    user_name?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    }
}

interface Props {
    orderId: number;
    initialMessages?: Message[];
    compact?: boolean;
    className?: string;
}

export default function ChatBox({ orderId, compact = false, className = '' }: Props) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch initial messages and setup polling
    useEffect(() => {
        const fetchMessages = () => {
            axios.get(route('chat.index', orderId))
                .then(response => {
                    setMessages(response.data);
                    setTimeout(scrollToBottom, 500);
                })
                .catch(error => console.error('Error fetching messages:', error));
        };

        // Initial fetch
        fetchMessages();

        // Listen for new messages via Laravel Echo / Reverb
        if (window.Echo) {
            const channel = window.Echo.private(`orders.${orderId}`);
            
            channel.listen('.message.sent', (e: any) => {
                const incomingMessage = e.message;
                setMessages(prev => {
                    if (prev.find(m => m.id === incomingMessage.id)) return prev;
                    setTimeout(scrollToBottom, 100);
                    
                    // Mark as read aggressively if we have it open
                    axios.post(route('chat.read', orderId)).catch(console.error);

                    return [...prev, {
                        ...incomingMessage,
                        user_name: incomingMessage.user?.name,
                    }];
                });
                
                // Clear typing indicator when message arrives
                setTypingUser(null);
            });
            
            // Listen for whisper typing
            channel.listenForWhisper('typing', (e: any) => {
                if (e.userId !== user.id) {
                    setTypingUser(e.userName);
                    
                    // Clear after 3 seconds of no typing
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                        setTypingUser(null);
                    }, 3000);
                }
            });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave(`orders.${orderId}`);
            }
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [orderId, user.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        
        if (window.Echo) {
            window.Echo.private(`orders.${orderId}`)
                .whisper('typing', {
                    userId: user.id,
                    userName: user.name
                });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachment) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            if (newMessage.trim()) formData.append('content', newMessage);
            if (attachment) formData.append('attachment', attachment);

            const response = await axios.post(route('chat.store', orderId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Optimistic update 
            const createdMessage = response.data;
            setMessages(prev => [...prev, {
                ...createdMessage,
                user_name: user.name,
                user: { id: user.id, name: user.name }
            }]);

            setNewMessage('');
            setAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col ${compact ? 'h-[400px]' : 'h-[500px]'} bg-white dark:bg-gray-800 ${compact ? '' : 'border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm'} ${className}`}>
            {!compact && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        {t('Live Order Chat')}
                    </h3>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {t('No messages yet. Start the conversation!')}
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.user_id === user.id;
                        return (
                            <div key={message.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 ${isOwn
                                    ? 'bg-primary-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-slate-600'
                                    }`}>
                                    {!isOwn && (
                                        <p className="text-xs font-bold mb-1 opacity-80 text-primary-600 dark:text-primary-400">
                                            {message.user_name || message.user?.name || 'User'}
                                        </p>
                                    )}
                                    
                                    {message.attachment_path && (
                                        <div className="mb-2">
                                            {message.attachment_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <a href={`/storage/${message.attachment_path}`} target="_blank" rel="noreferrer">
                                                    <img src={`/storage/${message.attachment_path}`} alt="attachment" className="rounded-xl max-h-48 object-cover border border-white/20 hover:opacity-90 transition-opacity" />
                                                </a>
                                            ) : (
                                                <a href={`/storage/${message.attachment_path}`} target="_blank" rel="noreferrer" className={`flex items-center gap-2 p-2 rounded-xl text-sm ${isOwn ? 'bg-primary-700 hover:bg-primary-800' : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 border border-gray-200 dark:border-slate-600'} transition-colors`}>
                                                    <Paperclip className="w-4 h-4" />
                                                    <span className="truncate max-w-[150px]">{message.attachment_path.split('/').pop()}</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {message.content && (
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    )}
                                    
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                        <p className="text-[10px]">
                                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {isOwn && (
                                            message.read_at ? (
                                                <CheckCheck className="w-3 h-3 text-emerald-400" />
                                            ) : (
                                                <Check className="w-3 h-3" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {typingUser && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-2xl rounded-bl-sm px-4 py-2 text-xs flex items-center gap-2 border border-gray-200 dark:border-slate-600 w-fit">
                            <span className="font-medium">{typingUser}</span> {t('is typing')}
                            <span className="flex gap-0.5 mt-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {attachment && (
                <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border-t border-primary-100 dark:border-primary-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 text-xs font-semibold overflow-hidden">
                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{attachment.name}</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => {
                            setAttachment(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }} 
                        className="text-primary-600 hover:text-red-500 text-xs font-bold hover:underline"
                    >
                        {t('Remove')}
                    </button>
                </div>
            )}

            <form onSubmit={sendMessage} className={`p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 ${compact ? '' : 'rounded-b-lg'}`}>
                <div className="flex gap-2 items-center relative">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 text-gray-400 hover:text-primary-600 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors hover:shadow-sm"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                    
                    <TextInput
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder={t('Type a message...')}
                        className="flex-1 !rounded-xl"
                        disabled={isLoading}
                    />
                    
                    <PrimaryButton 
                        disabled={isLoading || (!newMessage.trim() && !attachment)}
                        className="!px-4 !py-3 !rounded-xl shrink-0"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}

