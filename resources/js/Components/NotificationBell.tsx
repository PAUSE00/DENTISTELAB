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
                className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            >
                <div className={unreadCount > 0 ? 'animate-bounce' : ''}>
                    <Bell className="w-5 h-5" />
                </div>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/80 dark:bg-slate-900/80 rounded-t-2xl">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">{t('notifications.title', 'Notifications')}</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                            >
                                {t('notifications.read_all', 'Tout lire')}
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('notifications.empty', 'Pas de notifications')}</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 dark:border-slate-800/80 transition-colors hover:bg-gray-50/80 dark:hover:bg-slate-800/50 ${!notification.read_at ? 'bg-primary-50/60 dark:bg-primary-500/10' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-0.5">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${!notification.read_at ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                {notification.body}
                                            </p>
                                            <div className="flex items-center justify-between mt-2.5">
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: currentLocale })}
                                                </span>
                                                <div className="flex gap-2">
                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700"
                                                        >
                                                            {t('notifications.mark_read', 'Marquer lu')}
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={getLink(notification)}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            if (!notification.read_at) markAsRead(notification.id);
                                                        }}
                                                        className="text-[10px] font-medium text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                                                    >
                                                        {t('notifications.view', 'Voir')} <ExternalLink className="w-2.5 h-2.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        href={route('notifications.index')}
                        onClick={() => setIsOpen(false)}
                        className="block py-3.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 rounded-b-2xl transition-colors"
                    >
                        {t('notifications.view_all', 'Toutes les notifications')}
                    </Link>
                </div>
            )}
        </div>
    );
}
