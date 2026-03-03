import { useState, PropsWithChildren, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Shield,
    ShieldPlus,
    LogOut,
    Menu,
    Moon,
    Sun,
    Plus,
    X,
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

export default function ClinicLayout({ children, header }: Props) {
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
        if (isActive('clinic.dashboard')) return t('Dashboard');
        if (isActive('clinic.orders.*')) return t('Order Management');
        if (isActive('clinic.patients.*')) return t('Patient Management');
        if (isActive('clinic.team.*')) return t('Team Management');
        if (isActive('clinic.settings.*')) return t('Settings');
        return t('Clinic Portal');
    };

    const mainNavLinks = [
        { routePath: 'clinic.dashboard', activePattern: 'clinic.dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        { routePath: 'clinic.orders.index', activePattern: 'clinic.orders.*', label: 'My Orders', Icon: ClipboardList },
        { routePath: 'clinic.patients.index', activePattern: 'clinic.patients.*', label: 'My Patients', Icon: Users },
    ];

    const managementNavLinks = [
        { routePath: 'clinic.team.index', activePattern: 'clinic.team.*', label: 'Team', Icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-primary-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans antialiased selection:bg-primary-500 selection:text-white text-sm">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-50 transform transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isSidebarCollapsed ? 'w-[88px]' : 'w-64'}`}
            >
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full items-center justify-center text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 z-50 shadow-sm transition-all hover:scale-110"
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
                </button>

                {/* Brand */}
                <div className={`relative flex flex-col items-center gap-3 border-b border-gray-100 dark:border-slate-800 overflow-hidden group/brand shrink-0 transition-all ${isSidebarCollapsed ? 'p-5' : 'p-6'}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none" />

                    <div className={`relative rounded-2xl bg-gradient-to-br from-primary-500 to-dental-500 flex items-center justify-center text-white font-bold shadow-xl shadow-primary-500/30 group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-500 z-10 ${isSidebarCollapsed ? 'w-11 h-11 text-xl' : 'w-14 h-14 text-2xl'}`}>
                        {user.clinic?.logo_path ? (
                            <img src={`/storage/${user.clinic.logo_path}`} className="w-full h-full object-cover rounded-2xl bg-white" alt={t('Clinic Logo')} />
                        ) : (
                            <ShieldPlus className={isSidebarCollapsed ? 'w-6 h-6' : 'w-8 h-8'} />
                        )}
                        <div className="absolute inset-0 bg-primary-400 blur-xl opacity-20 group-hover/brand:opacity-40 transition-opacity -z-10 rounded-full" />
                    </div>

                    {!isSidebarCollapsed && (
                        <div className="relative z-10 text-center animate-fade-in w-full">
                            <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white truncate" title={user.clinic?.name || "DentalLabPro"}>
                                {user.clinic?.name || <span>DentalLab<span className="text-primary-500">Pro</span></span>}
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold mt-0.5 truncate">{t('Clinic Portal')}</p>
                        </div>
                    )}

                    <button onClick={toggleSidebar} className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white/50 dark:bg-slate-800/50 rounded-full backdrop-blur transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6 ${isSidebarCollapsed ? 'p-3' : 'p-4'}`}>

                    {/* Main Section */}
                    {!isSidebarCollapsed ? (
                        <div className="mb-3 mt-1 px-2 flex items-center gap-3 animate-fade-in">
                            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('Main')}</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-slate-700 dark:to-transparent"></div>
                        </div>
                    ) : (
                        <div className="mb-4 mt-2 flex justify-center"><div className="h-px w-6 bg-gray-200 dark:bg-slate-700"></div></div>
                    )}

                    {mainNavLinks.map((item) => (
                        <Link
                            key={item.routePath}
                            href={route(item.routePath)}
                            className={`sidebar-link ${route().current(item.activePattern) ? 'active' : ''} group ${isSidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
                            title={isSidebarCollapsed ? t(item.label) : undefined}
                        >
                            <item.Icon className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
                            {!isSidebarCollapsed && <span className="truncate">{t(item.label)}</span>}
                        </Link>
                    ))}

                    {/* Management Section - Restricted to Dentist */}
                    {user.role === 'dentist' && (
                        <>
                            {!isSidebarCollapsed ? (
                                <div className="mt-8 mb-3 px-2 flex items-center gap-3 animate-fade-in">
                                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('Management')}</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-slate-700 dark:to-transparent"></div>
                                </div>
                            ) : (
                                <div className="mt-6 mb-4 flex justify-center"><div className="h-px w-6 bg-gray-200 dark:bg-slate-700"></div></div>
                            )}

                            {managementNavLinks.map((item) => (
                                <Link
                                    key={item.routePath}
                                    href={route(item.routePath)}
                                    className={`sidebar-link ${route().current(item.activePattern) ? 'active' : ''} group ${isSidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
                                    title={isSidebarCollapsed ? t(item.label) : undefined}
                                >
                                    <item.Icon className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
                                    {!isSidebarCollapsed && <span className="truncate">{t(item.label)}</span>}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Settings Segment */}
                    {user.role === 'dentist' && (
                        <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/50 flex flex-col ${isSidebarCollapsed ? '' : 'mx-2'}`}>
                            <Link
                                href={route('clinic.settings.index')}
                                className={`sidebar-link ${route().current('clinic.settings.*') ? 'active' : ''} group ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                                title={isSidebarCollapsed ? t('Settings') : undefined}
                            >
                                <Settings className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
                                {!isSidebarCollapsed && <span className="truncate">{t('Settings')}</span>}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/80 backdrop-blur-xl shrink-0">
                    <div className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50 shadow-sm border border-gray-200/80 dark:border-slate-700 hover:shadow-md transition-all duration-300 group relative overflow-hidden ${isSidebarCollapsed ? 'flex-col p-2 justify-center' : 'px-3 py-2.5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-dental-500 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-all z-10 ${isSidebarCollapsed ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}`}>
                            {getInitials(user.name)}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0 z-10 animate-fade-in">
                                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{user.name}</p>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-primary-600 dark:text-primary-400 truncate mt-0.5">{user.role.replace('_', ' ')}</p>
                            </div>
                        )}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all z-10 group/logout ${isSidebarCollapsed ? 'p-1.5 mt-1' : 'p-2'}`}
                            title={t('Log Out')}
                        >
                            <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <button onClick={toggleSidebar} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                <Menu className="w-5 h-5" />
            </button>

            {/* Main Content */}
            <main className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-64'}`}>

                {/* Top Header */}
                <header className="sticky top-0 z-40 glass-effect px-6 py-3 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-12 lg:pl-0">
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {header || getPageTitle()}
                            </h2>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <span className="capitalize">
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300">
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        <NotificationBell />
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-dental-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800 shadow-md">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <ToastContainer />
        </div>
    );
}

// Add global styles for the sidebar link indicator if not already present
// or explicitly add them here style tag
const globalStyles = `
    .sidebar-link::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: linear-gradient(180deg, #16a34a, #0ea5e9);
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }
    .sidebar-link:hover::before,
    .sidebar-link.active::before {
        transform: scaleY(1);
    }
`;
