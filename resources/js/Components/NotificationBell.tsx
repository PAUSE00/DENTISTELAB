import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, MessageSquare, Package, UserPlus, ExternalLink } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface Notification {
    id: number;
    type: string;
    title: string;
    body: string;
    data: any;
    read_at: string | null;
    created_at: string;
}

export default function NotificationBell() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t, i18n } = useTranslation();

    const dateLocales: Record<string, any> = { fr, en: enUS, ar };
    const currentLocale = dateLocales[i18n.language] || fr;

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.recent'));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (window.Echo) {
            window.Echo.private(`App.Models.User.${user.id}`)
                .listen('.notification.created', (e: any) => {
                    setNotifications(prev => [e, ...prev.slice(0, 9)]);
                    setUnreadCount(prev => prev + 1);

                    // Optional: Show browser notification or custom toast
                    if (Notification.permission === 'granted') {
                        new Notification(e.title, { body: e.body });
                    }
                });
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleNotificationSound = () => {
            // Play sound
            const audio = new Audio('/sounds/notification.ogg');
            audio.play().catch(e => console.log('Audio autoplay prevented'));

            // Re-fetch notifications just in case
            fetchNotifications();
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('notification-sound', handleNotificationSound);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('notification-sound', handleNotificationSound);
            if (window.Echo) {
                window.Echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, [user.id]);

    const markAsRead = async (id: number) => {
        try {
            await axios.patch(route('notifications.read', id));
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route('notifications.read-all'));
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order_submitted': return <Package className="w-4 h-4 text-primary-500" />;
            case 'status_updated': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'new_message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            case 'invitation_accepted': return <UserPlus className="w-4 h-4 text-amber-500" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    const getLink = (notification: Notification) => {
        const orderId = notification.data?.order_id;
        if (!orderId) return route('notifications.index');

        const isLab = ['lab_owner', 'lab_tech'].includes(user.role);
        return isLab ? route('lab.orders.show', orderId) : route('clinic.orders.show', orderId);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1.5 rounded-md transition-colors flex items-center justify-center outline-none"
                style={{ color: 'var(--txt-2)', background: isOpen ? 'var(--surface)' : 'transparent' }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
            >
                <div className={unreadCount > 0 ? 'animate-bounce' : ''}>
                    <Bell size={15} />
                </div>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#f87171' }}></span>
                        <span className="relative flex rounded-full h-3.5 w-3.5 text-[8px] items-center justify-center font-bold text-white shadow-sm" style={{ background: '#ef4444' }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-[340px] rounded-xl shadow-2xl z-50 overflow-hidden border flex flex-col"
                    style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        <h3 className="font-bold text-[13px]" style={{ color: 'var(--txt-1)' }}>
                            {t('notifications.title', 'Notifications')}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                                style={{ color: 'var(--txt-accent)' }}
                            >
                                {t('notifications.read_all', 'READ ALL')}
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <Bell className="w-8 h-8 opacity-20 mb-3" style={{ color: 'var(--txt-3)' }} />
                                <p className="text-[12px] font-medium" style={{ color: 'var(--txt-3)' }}>
                                    {t('notifications.empty', 'Pas de notifications')}
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 border-b flex gap-3 transition-colors"
                                    style={{ 
                                        borderColor: 'var(--border)',
                                        background: !notification.read_at ? 'var(--surface)' : 'transparent' 
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = !notification.read_at ? 'var(--surface)' : 'transparent'; }}
                                >
                                    <div className="mt-0.5 shrink-0 opacity-70">
                                        {/* Use outline icon instead of filled colors for theme compliance */}
                                        <Bell size={14} style={{ color: 'var(--txt-2)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <p className="text-[12px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>
                                            {t(notification.title)}
                                        </p>
                                        <p className="text-[12px] leading-tight" style={{ color: 'var(--txt-2)' }}>
                                            {t(notification.body)}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10.5px] font-medium opacity-60" style={{ color: 'var(--txt-3)' }}>
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: currentLocale })}
                                            </span>
                                            <div className="flex items-center gap-2.5">
                                                {!notification.read_at && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-[10.5px] font-semibold transition-opacity hover:opacity-80"
                                                        style={{ color: 'var(--txt-accent)' }}
                                                    >
                                                        {t('notifications.mark_read', 'Mark as read')}
                                                    </button>
                                                )}
                                                <Link
                                                    href={getLink(notification)}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        if (!notification.read_at) markAsRead(notification.id);
                                                    }}
                                                    className="flex items-center gap-1 text-[10.5px] font-semibold transition-opacity hover:opacity-80"
                                                    style={{ color: 'var(--txt-accent)' }}
                                                >
                                                    {t('notifications.view', 'View')} <ExternalLink size={10} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <Link
                        href={route('notifications.index')}
                        onClick={() => setIsOpen(false)}
                        className="py-3 text-center text-[12px] font-bold border-t transition-colors"
                        style={{ 
                            borderColor: 'var(--border)', 
                            color: 'var(--txt-1)', 
                            background: 'var(--surface)' 
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-1)'; }}
                    >
                        {t('notifications.view_all', 'All notifications')}
                    </Link>
                </div>
            )}
        </div>
    );
}
