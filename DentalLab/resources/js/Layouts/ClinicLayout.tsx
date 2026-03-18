import { useState, PropsWithChildren, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, ClipboardList, Users, Shield, ShieldPlus,
    LogOut, Menu, Moon, Sun, X, Settings, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import NotificationBell from '@/Components/NotificationBell';
import { useNotifications } from '@/Hooks/useNotifications';
import ToastContainer from '@/Components/ToastContainer';
import useTranslation from '@/Hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import GlobalSearch from '@/Components/GlobalSearch';

interface Props extends PropsWithChildren {
    header?: ReactNode;
    fullBleed?: boolean;
}

export default function ClinicLayout({ children, header, fullBleed }: Props) {
    const user = usePage().props.auth.user;
    useNotifications();
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('clinic-theme') ?? 'dark';
        applyTheme(saved === 'light');
    }, []);

    const applyTheme = (light: boolean) => {
        document.documentElement.classList.toggle('light', light);
        document.documentElement.classList.toggle('dark', !light);
        setIsLight(light);
    };
    
    const toggleTheme = () => {
        const next = !isLight;
        localStorage.setItem('clinic-theme', next ? 'light' : 'dark');
        applyTheme(next);
    };

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const isActive = (p: string) => route().current(p);

    const getPageTitle = () => {
        if (isActive('clinic.dashboard')) return t('Dashboard');
        if (isActive('clinic.orders.*')) return t('My Orders');
        if (isActive('clinic.patients.*')) return t('My Patients');
        if (isActive('clinic.team.*')) return t('Team Management');
        if (isActive('clinic.settings.*')) return t('Settings');
        if (isActive('clinic.inbox.*')) return t('Messages');
        return t('Clinic Portal');
    };

    // Use similar links to clinic portal layout
    const mainLinks = [
        { path: 'clinic.dashboard',      pat: 'clinic.dashboard',    label: 'Dashboard',        Icon: LayoutDashboard },
        { path: 'clinic.orders.index',   pat: 'clinic.orders.*',     label: 'My Orders',        Icon: ClipboardList },
        { path: 'clinic.patients.index', pat: 'clinic.patients.*',   label: 'My Patients',      Icon: Users },
        // Assume clinic has messaging routes ready: 
        // { path: 'clinic.inbox.index',    pat: 'clinic.inbox.*',      label: 'Messages',         Icon: MessageSquare },
    ];

    const mgmtLinks = [
        { path: 'clinic.team.index',     pat: 'clinic.team.*',       label: 'Team',             Icon: Shield },
        { path: 'clinic.settings.index', pat: 'clinic.settings.*',   label: 'Settings',         Icon: Settings },
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

    const w = collapsed ? 'w-[52px]' : 'w-[250px]';

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
                        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0ea5e9 100%)' }}>
                        {user.clinic?.logo_path
                            ? <img src={`/storage/${user.clinic.logo_path}`} className="w-full h-full object-cover rounded-lg" alt="" />
                            : <ShieldPlus size={14} className="text-white" />
                        }
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="font-semibold text-[13px] truncate leading-none" style={{ color: 'var(--txt-1)' }}>
                                {user.clinic?.name || 'Clinic Portal'}
                            </p>
                            <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--txt-3)' }}>Dental Clinic</p>
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
                    
                    {user.role === 'dentist' && (
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
                            style={{ background: 'linear-gradient(135deg, #0ea5e9, #16a34a)' }}>
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
            <main className={`transition-all duration-200 ${collapsed ? 'lg:ml-[52px]' : 'lg:ml-[250px]'} h-screen overflow-hidden flex flex-col`}>

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

                        {/* Message Icon - assuming route setup */}
                        <Link href={'#'}
                            className="p-1.5 rounded-md transition-colors flex items-center justify-center relative"
                            style={{ color: 'var(--txt-2)', background: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            title={t('Messages')}>
                            <MessageSquare size={16} />
                        </Link>

                        <NotificationBell />

                        <div style={{ width: 1, height: 20, background: 'var(--border-strong)', margin: '0 4px' }} />

                        {/* User chip */}
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[11px] text-white"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #16a34a)' }}>
                                {getInitials(user.name)}
                            </div>
                            <span className="hidden sm:block text-[12.5px] font-medium" style={{ color: 'var(--txt-1)' }}>
                                {user.name.split(' ')[0]}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                {fullBleed ? (
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto p-5">
                        <div className="max-w-[1400px] mx-auto">
                            {children}
                        </div>
                    </div>
                )}
            </main>

            <ToastContainer />
        </div>
    );
}
