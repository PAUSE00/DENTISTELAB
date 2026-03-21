import { Link, usePage, router } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
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

 const getRoleColor = (r?: string) => {
     switch(r) {
         case 'super_admin': return '#c084fc'; // Purple
         case 'dentist': return '#38bdf8'; // Sky
         case 'lab_owner': return '#34d399'; // Emerald
         case 'lab_tech': return '#fbbf24'; // Amber
         case 'clinic_staff': return '#94a3b8'; // Slate
         default: return 'var(--accent)';
     }
 };

 // Role-based nav groups
 type NavItem = { name: string; href: string; icon: React.ElementType; active: boolean };
 type NavGroup = { label?: string; items: NavItem[] };

 const navGroups: NavGroup[] = [];

 if (user?.role === 'dentist' || user?.role === 'clinic_staff') {
 navGroups.push({
 label: t('MAIN'),
 items: [
 { name: t('Dashboard'), href: route('clinic.dashboard'), icon: LayoutDashboard, active: isActive('/clinic/dashboard') || url === '/dashboard' },
 { name: t('Orders'), href: route('clinic.orders.index'), icon: FileText, active: isActive('/clinic/orders') },
 { name: t('Messages'), href: route('clinic.inbox.index'), icon: MessageSquare, active: isActive('/clinic/inbox') },
 { name: t('Schedule'), href: route('clinic.appointments.index'), icon: Calendar, active: isActive('/clinic/appointments') },
 ],
 });
 navGroups.push({
 label: t('MANAGEMENT'),
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
 label: t('MAIN'),
 items: [
 { name: t('Dashboard'), href: route('lab.dashboard'), icon: LayoutDashboard, active: isActive('/lab/dashboard') || url === '/dashboard' },
 { name: t('Orders'), href: route('lab.orders.index'), icon: Package, active: isActive('/lab/orders') },
 { name: t('Messages'), href: route('lab.inbox.index'), icon: MessageSquare, active: isActive('/lab/inbox') },
 { name: t('Production Board'), href: route('lab.kanban.index'), icon: Layers, active: isActive('/lab/kanban') },
 { name: t('Schedule'), href: route('lab.calendar.index'), icon: Calendar, active: isActive('/lab/calendar') },
 { name: t('Service Catalog'), href: route('lab.services.index'), icon: Activity, active: isActive('/lab/services') },
 { name: t('Analytics'), href: route('lab.analytics.index'), icon: BarChart2, active: isActive('/lab/analytics') },
 ],
 });
 navGroups.push({
 label: t('MANAGEMENT'),
 items: [
 { name: t('Clients'), href: route('lab.clients.index'), icon: Building2, active: isActive('/lab/clients') },
 { name: t('Finance'), href: route('lab.finance.index'), icon: DollarSign, active: isActive('/lab/finance') },
 ...(user.role === 'lab_owner' ? [{ name: t('My Team'), href: route('lab.team.index'), icon: Users, active: isActive('/lab/team') }] : []),
 { name: t('Reports'), href: route('lab.reports.index'), icon: BarChart2, active: isActive('/lab/reports') },
 { name: t('Settings'), href: route('lab.settings.index'), icon: Settings, active: isActive('/lab/settings') },
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
 <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, var(--accent-10) 0%, transparent 100%)' }} />
 
 <div className={`relative rounded-xl flex items-center justify-center text-white font-bold shadow-[0_0_15px_var(--accent-20)] shrink-0 transition-all duration-300 ${collapsed ? 'w-9 h-9 mx-auto' : 'w-9 h-9'}`} style={{ background: 'var(--accent-grad)' }}>
 <Stethoscope className="w-5 h-5" />
 </div>
 
 {!collapsed && (
 <div className="ml-3 animate-fade-in flex-1">
 <h1 className="font-extrabold text-[15px] tracking-tight leading-none" style={{ color: 'var(--txt-1)' }}>
 Dental<span style={{ color: 'var(--accent)' }}>Lab</span>Pro
 </h1>
 <p className="text-[9px] uppercase tracking-widest font-black mt-1" style={{ color: 'var(--txt-3)' }}>
 {user?.role === 'super_admin' ? t('ADMINISTRATION') : user?.role === 'lab_owner' || user?.role === 'lab_tech' ? t('LABORATORY') : t('CLINIC')}
 </p>
 </div>
 )}

 {/* Collapse toggle */}
 <button
 onClick={() => setCollapsed(!collapsed)}
 className={`p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-hover)] ${collapsed ? 'hidden' : 'ml-auto'}`}
 style={{ color: 'var(--txt-3)' }}
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 
 {collapsed && (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center border shadow-xl transition-colors hover:text-[var(--accent)] z-50"
      style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}
    >
      <ChevronRight className="w-3 h-3" />
    </button>
 )}
 </div>

 {/* Navigation */}
 <nav className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-5">
 {navGroups.map((group, gi) => (
 <div key={gi}>
 {group.label && !collapsed && (
 <p className="text-[10px] font-black uppercase tracking-widest px-3 mb-3" style={{ color: 'var(--txt-3)' }}>
 {group.label}
 </p>
 )}
 <div className="space-y-1">
 {group.items.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
      item.active
        ? 'font-bold'
        : 'font-medium hover:bg-[var(--surface-hover)]'
    }`}
    style={{
      color: item.active ? 'var(--accent)' : 'var(--txt-2)',
      background: item.active ? 'var(--accent-10)' : 'transparent',
    }}
    title={collapsed ? item.name : undefined}
  >
 <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.active ? 'opacity-100' : 'opacity-70'} ${collapsed ? 'mx-auto' : ''}`} />
 
 {!collapsed && (
 <span className="text-[13px] tracking-wide truncate">{item.name}</span>
 )}
 
 {item.active && !collapsed && (
 <div className="absolute right-3 w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
 )}

 {/* Tooltip for collapsed */}
 {collapsed && (
 <div className="absolute left-full ml-4 px-3 py-2 rounded-xl text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border"
      style={{ background: 'var(--bg-raised)', color: 'var(--txt-1)', borderColor: 'var(--border)' }}>
 {item.name}
 </div>
 )}
 </Link>
 ))}
 </div>
 </div>
 ))}
 
 {/* Language Switcher */}
 {!collapsed && (
 <div className="mt-8 px-3">
 <div className="flex bg-[var(--surface-hover)] p-1 rounded-xl border border-[var(--border)] relative z-10">
 <button
 type="button"
 onClick={() => router.post(route('locale.update'), { locale: 'en' }, { preserveScroll: true })}
 className={`flex-1 text-[10px] font-black uppercase tracking-widest py-1.5 rounded-lg transition-all ${((props as any).locale === 'en' || !(props as any).locale) ? 'bg-[var(--accent)] text-[#0d1f1a] shadow-sm' : 'text-[var(--txt-3)] hover:text-[var(--txt-1)]'}`}
 >
 EN
 </button>
 <button
 type="button"
 onClick={() => router.post(route('locale.update'), { locale: 'fr' }, { preserveScroll: true })}
 className={`flex-1 text-[10px] font-black uppercase tracking-widest py-1.5 rounded-lg transition-all ${((props as any).locale === 'fr') ? 'bg-[var(--accent)] text-[#0d1f1a] shadow-sm' : 'text-[var(--txt-3)] hover:text-[var(--txt-1)]'}`}
 >
 FR
 </button>
 </div>
 </div>
 )}
 {collapsed && (
 <div className="mt-8 mx-auto flex flex-col gap-2 relative z-10 w-9 items-center pb-2">
 <button
 type="button"
 onClick={() => router.post(route('locale.update'), { locale: ((props as any).locale === 'fr' ? 'en' : 'fr') }, { preserveScroll: true })}
 className="w-9 h-9 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--txt-2)] transition-all hover:border-[var(--accent)]"
 >
 {(props as any).locale === 'fr' ? 'FR' : 'EN'}
 </button>
 </div>
 )}
 </nav>

 {/* Footer User */}
 <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
 <div
 className={`flex items-center gap-3 rounded-2xl p-2.5 border transition-all ${collapsed ? 'justify-center border-transparent bg-transparent' : 'hover:border-[var(--border-strong)]'}`}
 style={{ background: collapsed ? 'transparent' : 'var(--surface)', borderColor: collapsed ? 'transparent' : 'var(--border)' }}
 >
 <div className="relative shrink-0">
  <div className={`rounded-xl flex items-center justify-center text-white font-black shadow-lg ${collapsed ? 'w-10 h-10 text-[13px]' : 'w-9 h-9 text-xs'}`}
    style={{ background: 'var(--accent-grad)' }}>
 {getInitials(user.name)}
 </div>
 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 shadow-sm" style={{ background: getRoleColor(user?.role), borderColor: 'var(--bg-raised)', boxShadow: `0 0 8px ${getRoleColor(user?.role)}80` }} />
 </div>

 {!collapsed && (
 <div className="flex-1 min-w-0">
 <p className="font-bold text-[13px] truncate" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
 <p className="text-[9px] uppercase font-black tracking-widest truncate mt-0.5" style={{ color: getRoleColor(user?.role) }}>{t(user.role.replace('_', ' '))}</p>
 </div>
 )}

 {!collapsed && (
 <Link
 href={route('logout')}
 method="post"
 as="button"
 className="p-2 rounded-xl hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
 style={{ color: 'var(--txt-3)' }}
 title={t('Log Out')}
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
 className="w-full mt-3 flex items-center justify-center p-2.5 rounded-xl hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
 style={{ color: 'var(--txt-3)' }}
 title={t('Log Out')}
 >
 <LogOut className="w-5 h-5" />
 </Link>
 )}
 </div>
 </aside>
 );
}
