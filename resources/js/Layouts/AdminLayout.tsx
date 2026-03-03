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
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans antialiased text-sm">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50 transform transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.03)] dark:shadow-[0_0_40px_rgba(0,0,0,0.2)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isSidebarCollapsed ? 'w-[88px]' : 'w-64'}`}
            >
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 z-50 shadow-sm transition-all hover:scale-110"
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Brand */}
                <div className={`relative flex flex-col items-center gap-3 border-b border-slate-100 dark:border-slate-800/50 overflow-hidden group/brand shrink-0 transition-all ${isSidebarCollapsed ? 'p-5' : 'p-6'}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                    <div className={`relative rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-xl shadow-indigo-500/20 group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-500 z-10 ${isSidebarCollapsed ? 'w-11 h-11' : 'w-14 h-14'}`}>
                        <ShieldPlus className={isSidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} />
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="relative z-10 text-center animate-fade-in w-full">
                            <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">
                                <span>DentalLab<span className="text-indigo-500">Pro</span></span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mt-0.5 truncate">{t('Administration')}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto no-scrollbar pb-6 ${isSidebarCollapsed ? 'p-3' : 'p-3'}`}>
                    {mainNavLinks.map((item) => (
                        <Link
                            key={item.routePath}
                            href={route(item.routePath)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative mb-1 ${route().current(item.activePattern)
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active-glow'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-500'
                                } ${isSidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
                            title={isSidebarCollapsed ? t(item.label) : undefined}
                        >
                            <item.Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110`} />
                            {!isSidebarCollapsed && <span className="font-medium truncate">{t(item.label)}</span>}
                            {route().current(item.activePattern) && !isSidebarCollapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-md" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm shrink-0">
                    <div className={`flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-2.5 border border-slate-100 dark:border-slate-700/50 transition-all group ${isSidebarCollapsed ? 'flex-col p-2 justify-center' : ''}`}>
                        <div className={`shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-700 shadow-sm ${isSidebarCollapsed ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm'}`}>
                            {getInitials(user.name)}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 truncate">{t(user.role.replace('_', ' '))}</p>
                            </div>
                        )}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all p-2`}
                            title={t('Log Out')}
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Toggle */}
            <button onClick={toggleSidebar} className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main Content */}
            <main className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-64'}`}>

                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-[#f8fafc]/80 dark:bg-[#0f172a]/80 backdrop-blur-md px-6 py-4 h-20 flex items-center justify-between border-b border-transparent">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                            {header || getPageTitle()}
                        </h2>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-1 shadow-sm">
                            <LanguageSwitcher />
                        </div>
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-1 shadow-sm">
                             <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-500">
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
