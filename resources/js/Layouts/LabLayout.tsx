import { useState, PropsWithChildren, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, BarChart3, ClipboardList, ShieldPlus,
    LogOut, Menu, Moon, Sun, X, Package, Users,
    DollarSign, Settings, ChevronLeft, ChevronRight, Shield, Kanban,
    CalendarDays, FileBarChart2, BellRing, MessageSquare
} from 'lucide-react';
import NotificationBell from '@/Components/NotificationBell';
import { useNotifications } from '@/Hooks/useNotifications';
import ToastContainer from '@/Components/ToastContainer';
import useTranslation from '@/Hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import GlobalSearch from '@/Components/GlobalSearch';

interface Props extends PropsWithChildren {
    header?: ReactNode;
}

export default function LabLayout({ children, header }: Props) {
    const user = usePage().props.auth.user;
    useNotifications();
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lab-theme') ?? 'dark';
        applyTheme(saved === 'light');
    }, []);

    const applyTheme = (light: boolean) => {
        document.documentElement.classList.toggle('light', light);
        document.documentElement.classList.toggle('dark', !light);
        setIsLight(light);
    };
    const toggleTheme = () => {
        const next = !isLight;
        localStorage.setItem('lab-theme', next ? 'light' : 'dark');
        applyTheme(next);
    };

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const isActive = (p: string) => route().current(p);

    const getPageTitle = () => {
        if (isActive('lab.dashboard'))       return t('Dashboard');
        if (isActive('lab.analytics.*'))     return t('Analytics');
        if (isActive('lab.orders.*'))        return t('Orders');
        if (isActive('lab.kanban.*'))        return t('Production Board');
        if (isActive('lab.calendar.*'))      return t('Schedule');
        if (isActive('lab.inbox.*'))         return t('Messages');
        if (isActive('lab.reports.*'))       return t('Reports');
        if (isActive('lab.services.*'))      return t('Service Catalog');
        if (isActive('lab.clients.*'))       return t('Clients');
        if (isActive('lab.finance.*'))       return t('Finance');
        if (isActive('lab.team.*'))          return t('My Team');
        if (isActive('lab.settings.*'))      return t('Settings');
        if (isActive('notifications.*'))     return t('Notifications');
        return t('Lab Portal');
    };

    const mainLinks = [
        { path: 'lab.dashboard',      pat: 'lab.dashboard',    label: 'Dashboard',        Icon: LayoutDashboard },
        { path: 'lab.orders.index',   pat: 'lab.orders.*',     label: 'Orders',           Icon: ClipboardList },
        { path: 'lab.inbox.index',    pat: 'lab.inbox.*',      label: 'Messages',         Icon: MessageSquare },
        { path: 'lab.kanban.index',   pat: 'lab.kanban.*',     label: 'Production Board', Icon: Kanban },
        { path: 'lab.calendar.index', pat: 'lab.calendar.*',   label: 'Schedule',         Icon: CalendarDays },
        { path: 'lab.services.index', pat: 'lab.services.*',   label: 'Service Catalog',  Icon: Package },
        ...(user.role === 'lab_owner'
            ? [{ path: 'lab.analytics.index', pat: 'lab.analytics.*', label: 'Analytics', Icon: BarChart3 }]
            : []),
    ];

    const mgmtLinks = [
        { path: 'lab.clients.index',  pat: 'lab.clients.*',  label: 'Clients',        Icon: Users },
        { path: 'lab.finance.index',  pat: 'lab.finance.*',  label: 'Finance',        Icon: DollarSign },
        { path: 'notifications.index',pat: 'notifications.*',label: 'Notifications',  Icon: BellRing },
        { path: 'lab.team.index',     pat: 'lab.team.*',     label: 'My Team',        Icon: Shield },
        ...(user.role === 'lab_owner' ? [
            { path: 'lab.reports.index',  pat: 'lab.reports.*',  label: 'Reports',        Icon: FileBarChart2 },
            { path: 'lab.settings.index', pat: 'lab.settings.*', label: 'Settings',       Icon: Settings },
        ] : []),
    ];

    const NavLink = ({ item }: { item: typeof mainLinks[0] }) => {
        const active = isActive(item.pat);
        return (
            <Link
                href={route(item.path)}
                title={collapsed ? t(item.label) : undefined}
                className={`nav-lnk ${active ? 'active' : ''} ${collapsed ? '!justify-center' : ''}`}
            >
                <item.Icon className="nav-icon" />
                {!collapsed && item.label}
            </Link>
        );
    };

    const w = collapsed ? 'w-[52px]' : 'w-56';

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--txt-1)' }}>

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col app-sidebar transition-all duration-200
                ${w} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Collapse button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-[60px] w-6 h-6 rounded-full items-center justify-center transition-colors z-10 text-xs"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-2)' }}
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>

                {/* Brand */}
                <div className={`flex items-center h-14 border-b ${collapsed ? 'justify-center px-3' : 'px-4 gap-3'}`}
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6638b4 0%, #60ddc6 100%)' }}>
                        {user.lab?.logo_path
                            ? <img src={`/storage/${user.lab.logo_path}`} className="w-full h-full object-cover rounded-lg" alt="" />
                            : <ShieldPlus size={14} className="text-white" />
                        }
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="font-semibold text-[13px] truncate leading-none" style={{ color: 'var(--txt-1)' }}>
                                {user.lab?.name || 'ProDent Lab'}
                            </p>
                            <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--txt-3)' }}>Laboratory</p>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto" style={{ color: 'var(--txt-3)' }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
                    {!collapsed && <p className="nav-section-label">{t('Main')}</p>}
                    {mainLinks.map(i => <NavLink key={i.path} item={i} />)}
                    {user.role === 'lab_owner' && (
                        <>
                            <div style={{ height: 1, background: 'var(--border)', margin: '10px 12px' }} />
                            {!collapsed && <p className="nav-section-label">{t('Management')}</p>}
                            {mgmtLinks.map(i => <NavLink key={i.path} item={i} />)}
                        </>
                    )}
                </nav>

                {/* User footer */}
                <div className="shrink-0 p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className={`flex items-center gap-2.5 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}
                        style={{ background: 'var(--surface)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 text-white"
                            style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                            {getInitials(user.name)}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold truncate leading-none" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                                <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--txt-3)' }}>{user.role.replace('_', ' ')}</p>
                            </div>
                        )}
                        <Link href={route('logout')} method="post" as="button"
                            className="p-1 rounded transition-colors hover:text-red-400"
                            style={{ color: 'var(--txt-3)' }}>
                            <LogOut size={13} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile toggle */}
            <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--txt-2)' }}>
                <Menu size={16} />
            </button>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Main layout ──────────────────────────────────────────── */}
            <main className={`transition-all duration-200 ${collapsed ? 'lg:ml-[52px]' : 'lg:ml-56'} min-h-screen flex flex-col`}>

                {/* Header */}
                <header className="app-header sticky top-0 z-40 h-14 flex items-center justify-between px-5">
                    <div className="pl-9 lg:pl-0">
                        <h1 className="text-[15px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                            {header || getPageTitle()}
                        </h1>
                    </div>

                    {/* Global Search */}
                    <div className="flex-1 flex justify-center px-4 max-w-xs mx-auto">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Date */}
                        <span className="hidden md:block text-[11.5px] font-medium" style={{ color: 'var(--txt-3)' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        <div style={{ width: 1, height: 20, background: 'var(--border-strong)', margin: '0 6px' }} />

                        {/* Theme toggle */}
                        <button onClick={toggleTheme}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: 'var(--txt-2)', background: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            title={isLight ? 'Switch to dark' : 'Switch to light'}>
                            {isLight ? <Moon size={15} /> : <Sun size={15} />}
                        </button>

                        <LanguageSwitcher />
                        <NotificationBell />

                        <div style={{ width: 1, height: 20, background: 'var(--border-strong)', margin: '0 4px' }} />

                        {/* User chip */}
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[11px] text-white"
                                style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                                {getInitials(user.name)}
                            </div>
                            <span className="hidden sm:block text-[12.5px] font-medium" style={{ color: 'var(--txt-1)' }}>
                                {user.name.split(' ')[0]}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-5">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            <ToastContainer />
        </div>
    );
}
