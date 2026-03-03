import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PageProps } from '@/types';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LayoutDashboard,
    FileText,
    Settings,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Package,
    Building2,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const { url, props } = usePage<PageProps>();
    const user = props.auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const { t } = useTranslation();

    // Common navigation items
    const commonNav = [
        { name: t('nav.dashboard', 'Dashboard'), href: route('dashboard'), icon: LayoutDashboard, active: url.startsWith('/dashboard') || url.startsWith('/clinic/dashboard') || url.startsWith('/lab/dashboard') || url.startsWith('/admin/dashboard') },
    ];

    // Role-specific navigation
    const roleNav = {
        dentist: [
            { name: t('nav.my_orders', 'My Orders'), href: route('clinic.orders.index'), icon: FileText, active: url.startsWith('/clinic/orders') },
            { name: t('nav.my_patients', 'My Patients'), href: route('clinic.patients.index'), icon: Users, active: url.startsWith('/clinic/patients') },
            { name: t('nav.team', 'Team'), href: route('clinic.team.index'), icon: ShieldCheck, active: url.startsWith('/clinic/team') },
        ],
        lab_owner: [
            { name: t('nav.incoming_orders', 'Incoming Orders'), href: route('lab.orders.index'), icon: Package, active: url.startsWith('/lab/orders') },
            { name: t('nav.my_services', 'My Services'), href: route('lab.services.index'), icon: Activity, active: url.startsWith('/lab/services') },
            { name: t('nav.team', 'Team'), href: route('lab.team.index'), icon: ShieldCheck, active: url.startsWith('/lab/team') },
        ],
        super_admin: [
            { name: t('nav.manage_users', 'Manage Users'), href: route('admin.users.index'), icon: Users, active: url.startsWith('/admin/users') },
            { name: t('nav.manage_clinics', 'Manage Clinics'), href: route('admin.clinics.index'), icon: Building2, active: url.startsWith('/admin/clinics') },
            { name: t('nav.manage_labs', 'Manage Labs'), href: route('admin.labs.index'), icon: Activity, active: url.startsWith('/admin/labs') },
        ],
        lab_tech: [
            { name: t('nav.incoming_orders', 'Incoming Orders'), href: route('lab.orders.index'), icon: Package, active: url.startsWith('/lab/orders') },
        ],
        clinic_staff: [
            { name: t('nav.my_orders', 'My Orders'), href: route('clinic.orders.index'), icon: FileText, active: url.startsWith('/clinic/orders') },
            { name: t('nav.my_patients', 'My Patients'), href: route('clinic.patients.index'), icon: Users, active: url.startsWith('/clinic/patients') },
        ],
    };

    // Merge common and role-specific items
    // Safe access to roleNav based on user.role
    const currentRoleNav = user && user.role && roleNav[user.role as keyof typeof roleNav] ? roleNav[user.role as keyof typeof roleNav] : [];
    const navigation = [...commonNav, ...currentRoleNav];

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out
                bg-sidebar dark:bg-sidebar border-r border-border dark:border-border
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center justify-center h-16 border-b border-border dark:border-border bg-surface/50 dark:bg-surface/50 backdrop-blur-sm">
                    <Link href="/">
                        <ApplicationLogo className={`fill-current text-brand transition-all duration-300 ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`} />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group relative
                                ${item.active
                                    ? 'bg-brand/20 text-text dark:text-text font-medium'
                                    : 'text-sub dark:text-sub hover:bg-hover dark:hover:bg-hover hover:text-text dark:hover:text-text'
                                }
                            `}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${item.active ? 'text-green-700 dark:text-accent' : 'text-sub group-hover:text-green-700 dark:group-hover:text-accent'}`} />

                            {!collapsed && (
                                <span className="ml-3 truncate">{item.name}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Collapse Toggle & User Section */}
                <div className="p-4 border-t border-border dark:border-border bg-surface/50 dark:bg-surface/50 backdrop-blur-sm">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-2 mb-4 rounded-lg text-sub hover:bg-hover dark:hover:bg-hover transition-colors"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                        {!collapsed && (
                            <div className="flex items-center overflow-hidden">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand/30 dark:bg-accent/20 flex items-center justify-center text-xs font-bold text-text">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="ml-3 truncate">
                                    <p className="text-sm font-medium text-text dark:text-text truncate">{user.name}</p>
                                    <p className="text-xs text-sub dark:text-sub truncate capitalize">
                                        {t(`roles.${user.role}`, user.role.replace('_', ' '))}
                                    </p>
                                </div>
                            </div>
                        )}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`p-2 text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${collapsed ? '' : 'ml-2'}`}
                            title="Log Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
