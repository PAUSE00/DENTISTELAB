import { useState, PropsWithChildren, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ClipboardList,
    Shield,
    ShieldPlus,
    LogOut,
    Menu,
    Bell,
    Moon,
    Sun,
    X,
    Package,
    Users,
    DollarSign,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { User } from '@/types';
import NotificationBell from '@/Components/NotificationBell';
import { useNotifications } from '@/Hooks/useNotifications';
import ToastContainer from '@/Components/ToastContainer';
import useTranslation from '@/Hooks/useTranslation';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

interface Props extends PropsWithChildren {
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: Props) {
    const user = usePage().props.auth.user;
    useNotifications();
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initial Theme Check
    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const isActive = (routePattern: string) => {
        return route().current(routePattern);
    };

    const getPageTitle = () => {
        if (isActive('admin.dashboard')) return t('Dashboard');
        if (isActive('admin.users.*')) return t('User Management');
        if (isActive('admin.clinics.*')) return t('Clinic Management');
        if (isActive('admin.labs.*')) return t('Lab Management');
        return t('Admin Portal');
    };

    const mainNavLinks = [
        { routePath: 'admin.dashboard', activePattern: 'admin.dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        { routePath: 'admin.users.index', activePattern: 'admin.users.*', label: 'Users', Icon: Users },
        { routePath: 'admin.clinics.index', activePattern: 'admin.clinics.*', label: 'Clinics', Icon: ClipboardList },
        { routePath: 'admin.labs.index', activePattern: 'admin.labs.*', label: 'Labs', Icon: Package },
    ];

    const managementNavLinks = [
        { routePath: 'lab.clients.index', activePattern: 'lab.clients.*', label: 'Clients', Icon: Users },
        { routePath: 'lab.finance.index', activePattern: 'lab.finance.*', label: 'Finance', Icon: DollarSign },
        { routePath: 'lab.team.index', activePattern: 'lab.team.*', label: 'My Team', Icon: Shield },
    ];

    return (
        <div className="min-h-screen transition-colors duration-300 font-sans antialiased text-sm" style={{ background: 'var(--bg-color)', color: 'var(--txt-1)' }}>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full z-50 transform transition-all duration-300 flex flex-col border-r ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isSidebarCollapsed ? 'w-[88px]' : 'w-64'}`}
                style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
            >
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 rounded-full items-center justify-center z-50 shadow-sm transition-all hover:scale-110 border"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Brand */}
                <div className={`relative flex flex-col items-center gap-3 border-b overflow-hidden group/brand shrink-0 transition-all ${isSidebarCollapsed ? 'p-5' : 'p-6'}`} style={{ borderColor: 'var(--border)' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                    <div className={`relative rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-xl shadow-indigo-500/20 group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-500 z-10 ${isSidebarCollapsed ? 'w-11 h-11' : 'w-14 h-14'}`}>
                        <ShieldPlus className={isSidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} />
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="relative z-10 text-center animate-fade-in w-full">
                            <h1 className="font-bold text-lg tracking-tight truncate" style={{ color: 'var(--txt-1)' }}>
                                <span>DentalLab<span className="text-indigo-500">Pro</span></span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5 truncate" style={{ color: 'var(--txt-3)' }}>{t('Administration')}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto no-scrollbar pb-6 ${isSidebarCollapsed ? 'p-3' : 'p-3'}`}>
                    {mainNavLinks.map((item) => {
                        const active = route().current(item.activePattern);
                        return (
                            <Link
                                key={item.routePath}
                                href={route(item.routePath)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative mb-1 ${active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-indigo-500'} ${isSidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
                                style={!active ? { color: 'var(--txt-3)' } : {}}
                                title={isSidebarCollapsed ? t(item.label) : undefined}
                            >
                                <item.Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110`} />
                                {!isSidebarCollapsed && <span className="font-medium truncate">{t(item.label)}</span>}
                                {active && !isSidebarCollapsed && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-md" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                    <div className={`flex items-center gap-3 rounded-2xl p-2.5 border transition-all group ${isSidebarCollapsed ? 'flex-col p-2 justify-center' : ''}`} style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className={`shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold ring-2 shadow-sm ${isSidebarCollapsed ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm'}`} style={{ '--tw-ring-color': 'var(--bg-raised)' } as React.CSSProperties}>
                            {getInitials(user.name)}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs truncate" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                                <p className="text-[10px] uppercase font-bold text-indigo-500 truncate">{t(user.role.replace('_', ' '))}</p>
                            </div>
                        )}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`rounded-lg hover:text-rose-500 hover:bg-rose-500/10 transition-all p-2`}
                            style={{ color: 'var(--txt-3)' }}
                            title={t('Log Out')}
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Toggle */}
            <button onClick={toggleSidebar} className="lg:hidden fixed top-4 right-4 z-[60] p-2 rounded-xl shadow-xl border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main Content */}
            <main className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-64'}`}>

                {/* Top Header */}
                <header className="sticky top-0 z-40 px-6 py-4 h-20 flex items-center justify-between border-b" style={{ background: 'var(--bg-color)', borderColor: 'var(--border)' }}>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tight leading-none mb-1" style={{ color: 'var(--txt-1)' }}>
                            {header || getPageTitle()}
                        </h2>
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block rounded-xl border p-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <LanguageSwitcher />
                        </div>
                        <div className="flex items-center gap-1 rounded-xl border p-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                             <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors hover:text-indigo-500" style={{ color: 'var(--txt-3)' }}>
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <NotificationBell />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
            )}

            <ToastContainer />
        </div>
    );
}
