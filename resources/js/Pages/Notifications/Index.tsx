import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import LabLayout from '@/Layouts/LabLayout';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { Bell, BellOff, CheckCheck, Filter, Package, MessageSquare, RefreshCw, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface Notification {
    id: number;
    type: string;
    title: string;
    body: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

interface PaginatedData {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    notifications: PaginatedData;
    filters: { type: string | null; status: string | null };
    userLayout: 'lab' | 'clinic' | 'admin';
}

const typeIcons: Record<string, { icon: string; color: string }> = {
    order_status: { icon: '🔄', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    new_order: { icon: '📦', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    new_message: { icon: '💬', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    invitation_accepted: { icon: '🤝', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
};

const typeLabels: Record<string, string> = {
    order_status: 'Statut commande',
    new_order: 'Nouvelle commande',
    new_message: 'Message',
    invitation_accepted: 'Invitation',
};

function getTimeAgo(dateString: string) {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Il y a ${days}j`;
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function NotificationsContent({ notifications, filters }: Props) {
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const applyFilters = (overrides: { type?: string; status?: string } = {}) => {
        const params: Record<string, string> = {};
        const t = overrides.type !== undefined ? overrides.type : selectedType;
        const s = overrides.status !== undefined ? overrides.status : selectedStatus;
        if (t) params.type = t;
        if (s) params.status = s;
        router.get(route('notifications.index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleTypeFilter = (type: string) => {
        const newType = selectedType === type ? '' : type;
        setSelectedType(newType);
        applyFilters({ type: newType });
    };

    const handleStatusFilter = (status: string) => {
        const newStatus = selectedStatus === status ? '' : status;
        setSelectedStatus(newStatus);
        applyFilters({ status: newStatus });
    };

    const markAsRead = (id: number) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const handleClick = (notification: Notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }
        if (notification.data?.order_id) {
            const isLab = route().current('lab.*') || route().current('notifications.*');
            // Try lab route first, fallback
            try {
                const orderRoute = route().has('lab.orders.show')
                    ? route('lab.orders.show', notification.data.order_id as number)
                    : route('clinic.orders.show', notification.data.order_id as number);
                router.visit(orderRoute);
            } catch {
                // fallback
            }
        }
    };

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <>
            <Head title="Notifications" />

            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                                <Bell className="w-5 h-5" />
                            </div>
                            Notifications
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notifications.total} notification{notifications.total > 1 ? 's' : ''} au total
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all text-sm font-bold border border-primary-200 dark:border-primary-500/30"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Filter className="w-4 h-4" />
                        Filtres
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* Status Filters */}
                        <button
                            onClick={() => handleStatusFilter('unread')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedStatus === 'unread'
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                                }`}
                        >
                            Non lues
                        </button>
                        <button
                            onClick={() => handleStatusFilter('read')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedStatus === 'read'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                                : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                                }`}
                        >
                            Lues
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-slate-600 mx-1 self-center" />

                        {/* Type Filters */}
                        {Object.entries(typeLabels).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleTypeFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedType === key
                                    ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-500/50'
                                    : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {typeIcons[key]?.icon} {label}
                            </button>
                        ))}

                        {(selectedType || selectedStatus) && (
                            <button
                                onClick={() => { setSelectedType(''); setSelectedStatus(''); router.get(route('notifications.index'), {}, { preserveState: true }); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                            >
                                ✕ Réinitialiser
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    {notifications.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                <Inbox className="w-8 h-8" />
                            </div>
                            <p className="font-medium text-lg">Aucune notification</p>
                            <p className="text-sm mt-1">Vous n'avez aucune notification pour le moment.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {notifications.data.map((n) => {
                                const typeInfo = typeIcons[n.type] || { icon: '🔔', color: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400' };
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => handleClick(n)}
                                        className={`w-full text-left px-6 py-5 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors group ${!n.read_at ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 text-base">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${typeInfo.color}`}>
                                                {typeInfo.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-base ${!n.read_at ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.read_at && (
                                                        <span className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 animate-pulse shadow-sm shadow-primary-500/50" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{n.body}</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-xs font-medium text-gray-400 dark:text-slate-500">{getTimeAgo(n.created_at)}</span>
                                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 border border-transparent dark:border-slate-700">
                                                        {typeLabels[n.type] || n.type}
                                                    </span>
                                                </div>
                                            </div>
                                            {!n.read_at && (
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 flex-shrink-0"
                                                    title="Marquer comme lu"
                                                >
                                                    <CheckCheck className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Page {notifications.current_page} sur {notifications.last_page} ({notifications.total} résultats)
                            </p>
                            <div className="flex items-center gap-1">
                                {notifications.links.map((link, i) => {
                                    if (i === 0) {
                                        return (
                                            <button
                                                key="prev"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    if (i === notifications.links.length - 1) {
                                        return (
                                            <button
                                                key="next"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${link.active
                                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                                : 'hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default function NotificationsIndex(props: Props) {
    const { userLayout } = props;

    if (userLayout === 'lab') {
        return (
            <LabLayout>
                <NotificationsContent {...props} />
            </LabLayout>
        );
    }

    return (
        <ClinicLayout>
            <NotificationsContent {...props} />
        </ClinicLayout>
    );
}
