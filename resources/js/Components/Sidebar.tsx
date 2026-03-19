import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PageProps } from '@/types';
import {
    LayoutDashboard,
    FileText,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Package,
    Building2,
    Activity,
    ShieldCheck,
    Stethoscope,
    DollarSign,
    Calendar,
    MessageSquare,
    BarChart2,
    Settings,
    Layers,
    Compass,
    Receipt,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const { url, props } = usePage<PageProps>();
    const user = props.auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const { t } = useTranslation();

    const getInitials = (name: string) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    const isActive = (path: string) => url.startsWith(path);

    // Role-based nav groups
    type NavItem = { name: string; href: string; icon: React.ElementType; active: boolean };
    type NavGroup = { label?: string; items: NavItem[] };

    const navGroups: NavGroup[] = [];

    if (user?.role === 'dentist' || user?.role === 'clinic_staff') {
        navGroups.push({
            label: 'MAIN',
            items: [
                { name: t('Dashboard'), href: route('clinic.dashboard'), icon: LayoutDashboard, active: isActive('/clinic/dashboard') || url === '/dashboard' },
                { name: t('Orders'), href: route('clinic.orders.index'), icon: FileText, active: isActive('/clinic/orders') },
                { name: t('Messages'), href: route('clinic.messages.index'), icon: MessageSquare, active: isActive('/clinic/messages') },
                { name: t('Schedule'), href: route('clinic.appointments.index'), icon: Calendar, active: isActive('/clinic/appointments') },
            ],
        });
        navGroups.push({
            label: 'MANAGEMENT',
            items: [
                { name: t('Patients'), href: route('clinic.patients.index'), icon: Users, active: isActive('/clinic/patients') },
                { name: t('Billing'), href: route('clinic.billing.index'), icon: Receipt, active: isActive('/clinic/billing') },
                { name: t('Explore Labs'), href: route('clinic.explore.index'), icon: Compass, active: isActive('/clinic/explore') },
                { name: t('Templates'), href: route('clinic.templates.index'), icon: Layers, active: isActive('/clinic/templates') },
                ...(user.role === 'dentist' ? [{ name: t('Team'), href: route('clinic.team.index'), icon: ShieldCheck, active: isActive('/clinic/team') }] : []),
            ],
        });
    } else if (user?.role === 'lab_owner' || user?.role === 'lab_tech') {
        navGroups.push({
            label: 'MAIN',
            items: [
                { name: t('Dashboard'), href: route('lab.dashboard'), icon: LayoutDashboard, active: isActive('/lab/dashboard') || url === '/dashboard' },
                { name: t('Orders'), href: route('lab.orders.index'), icon: Package, active: isActive('/lab/orders') },
                { name: t('Messages'), href: '#', icon: MessageSquare, active: false },
                { name: t('Production Board'), href: '#', icon: Layers, active: false },
                { name: t('Schedule'), href: '#', icon: Calendar, active: false },
                { name: t('Service Catalog'), href: route('lab.services.index'), icon: Activity, active: isActive('/lab/services') },
                { name: t('Analytics'), href: '#', icon: BarChart2, active: false },
            ],
        });
        navGroups.push({
            label: 'MANAGEMENT',
            items: [
                { name: t('Clients'), href: '#', icon: Building2, active: false },
                { name: t('Finance'), href: '#', icon: DollarSign, active: false },
                ...(user.role === 'lab_owner' ? [{ name: t('My Team'), href: route('lab.team.index'), icon: Users, active: isActive('/lab/team') }] : []),
                { name: t('Reports'), href: '#', icon: BarChart2, active: false },
                { name: t('Settings'), href: '#', icon: Settings, active: false },
            ],
        });
    } else if (user?.role === 'super_admin') {
        navGroups.push({
            items: [
                { name: t('Dashboard'), href: route('admin.dashboard'), icon: LayoutDashboard, active: isActive('/admin/dashboard') },
                { name: t('Users'), href: route('admin.users.index'), icon: Users, active: isActive('/admin/users') },
                { name: t('Clinics'), href: route('admin.clinics.index'), icon: Building2, active: isActive('/admin/clinics') },
                { name: t('Labs'), href: route('admin.labs.index'), icon: Activity, active: isActive('/admin/labs') },
            ],
        });
    }

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col border-r ${collapsed ? 'w-20' : 'w-64'}`}
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
        >
            {/* Brand / Logo */}
            <div
                className="relative flex items-center h-16 border-b shrink-0 overflow-hidden px-4"
                style={{ borderColor: 'var(--border)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                <div className={`relative rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0 transition-all duration-300 ${collapsed ? 'w-9 h-9' : 'w-9 h-9'}`}>
                    <Stethoscope className="w-5 h-5" />
                </div>
                {!collapsed && (
                    <div className="ml-3 animate-fade-in">
                        <h1 className="font-bold text-sm tracking-tight leading-none" style={{ color: 'var(--txt-1)' }}>
                            DentalLab<span className="text-indigo-500">Pro</span>
                        </h1>
                        <p className="text-[9px] uppercase tracking-widest font-bold mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {user?.role === 'super_admin' ? 'ADMINISTRATION' : user?.role === 'lab_owner' || user?.role === 'lab_tech' ? 'LABORATORY' : 'CLINIC'}
                        </p>
                    </div>
                )}
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto p-1.5 rounded-lg transition-colors hover:text-indigo-500"
                    style={{ color: 'var(--txt-3)' }}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
                {navGroups.map((group, gi) => (
                    <div key={gi}>
                        {group.label && !collapsed && (
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] px-3 mb-2" style={{ color: 'var(--txt-3)' }}>
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${item.active
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                    style={!item.active ? { color: 'var(--txt-3)' } : {}}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`} />
                                    {!collapsed && (
                                        <span className="font-medium text-sm truncate">{item.name}</span>
                                    )}
                                    {item.active && !collapsed && (
                                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50" />
                                    )}
                                    {/* Tooltip for collapsed */}
                                    {collapsed && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl"
                                            style={{ background: 'var(--surface)', color: 'var(--txt-1)', border: '1px solid var(--border)' }}>
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer User */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
                <div
                    className={`flex items-center gap-3 rounded-xl p-2.5 border transition-all ${collapsed ? 'justify-center' : ''}`}
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                    <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                            {getInitials(user.name)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2" style={{ borderColor: 'var(--surface)' }} />
                    </div>

                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                            <p className="text-[10px] uppercase font-bold text-indigo-500 truncate">{user.role.replace('_', ' ')}</p>
                        </div>
                    )}

                    {!collapsed && (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 rounded-lg hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            style={{ color: 'var(--txt-3)' }}
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {collapsed && (
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full mt-2 flex items-center justify-center p-2 rounded-lg hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        style={{ color: 'var(--txt-3)' }}
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </aside>
    );
}
