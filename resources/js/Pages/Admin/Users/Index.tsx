import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, Plus, Edit2, Trash2, User as UserIcon, Building2, Activity, Power, ShieldCheck, Mail, Calendar, FilterX, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  clinic?: { name: string };
  lab?: { name: string };
}

interface Props extends PageProps {
  users: {
    data: User[];
    links: any[];
  };
  filters: {
    search?: string;
    role?: string;
  };
}

export default function Index({ auth, users, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.users.index'), { search }, { preserveState: true, replace: true });
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setProcessing(true);
    router.delete(route('admin.users.destroy', userToDelete), {
      onFinish: () => {
        setProcessing(false);
        setUserToDelete(null);
      }
    });
  };

  const getRoleStyle = (r: string) => {
      switch(r) {
          case 'super_admin': return { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', color: '#c084fc', icon: ShieldCheck };
          case 'dentist':     return { bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)', color: '#38bdf8', icon: Activity };
          case 'lab_owner':   return { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', color: '#34d399', icon: Building2 };
          case 'lab_tech':    return { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', color: '#fbbf24', icon: Activity };
          case 'clinic_staff':return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', color: '#94a3b8', icon: UserIcon };
          default:            return { bg: 'var(--accent-10)', border: 'var(--border)', color: 'var(--accent)', icon: UserIcon };
      }
  };

  const getRoleIcon = (r: string) => getRoleStyle(r).icon;

  return (
    <AdminLayout header={t('User Management')}>
      <Head title={t('Users')} />

      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-tight" style={{ color: 'var(--txt-1)' }}>
              {t('Platform')} <span style={{ color: 'var(--accent)' }}>{t('Users')}</span>
            </h2>
            <p className="font-medium text-sm mt-1" style={{ color: 'var(--txt-3)' }}>{t('Manage accounts, roles and access permissions.')}</p>
          </div>
          <Link
            href={route('admin.users.create')}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold tracking-tight">{t('Create New User')}</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search by name, email or ID...')}
              className="w-full pl-11 pr-5 py-3 rounded-xl text-[13px] outline-none transition-all"
              style={{
                background: 'var(--bg-raised)',
                border: '1.5px solid var(--border)',
                color: 'var(--txt-1)',
              }}
            />
          </form>

          {/* Role Filter */}
          <select
            value={filters.role || ''}
            onChange={(e) => {
              router.get(route('admin.users.index'), { search, role: e.target.value }, { preserveState: true, replace: true });
            }}
            className="px-4 py-3 rounded-xl font-semibold text-[13px] outline-none cursor-pointer min-w-[160px] transition-all"
            style={{
              background: 'var(--bg-raised)',
              border: '1.5px solid var(--border)',
              color: 'var(--txt-2)',
            }}
          >
            <option value="">{t('All Roles')}</option>
            <option value="super_admin">{t('Super Admin')}</option>
            <option value="dentist">{t('Dentist')}</option>
            <option value="lab_owner">{t('Lab Owner')}</option>
            <option value="lab_tech">{t('Lab Technician')}</option>
            <option value="clinic_staff">{t('Clinic Staff')}</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => { setSearch(''); router.get(route('admin.users.index')); }}
            className="px-4 py-3 rounded-xl transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ background: 'var(--bg-raised)', border: '1.5px solid var(--border)', color: 'var(--txt-3)' }}
            title={t('Clear Filters')}
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>

        {/* Table Section */}
        <div className="card rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Identity')}</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Role')}</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Organization')}</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-2)' }}>{t('Engagement')}</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60 text-right" style={{ color: 'var(--txt-2)' }}>{t('System Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-transparent border-t-0">
                {users.data.length > 0 ? (
                  users.data.map((user) => {
                    const rs = getRoleStyle(user.role);
                    const RoleIcon = rs.icon;
                    
                    return (
                      <tr key={user.id} className="group transition-colors hover:bg-[var(--surface-hover)] cursor-pointer">
                        <td className="py-4 px-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-xs shrink-0 text-white relative" style={{ background: 'var(--accent-grad)' }}>
                                    {user.name.substring(0,2).toUpperCase()}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: user.is_active ? '#34d399' : '#f43f5e', borderColor: 'var(--bg-raised)' }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--txt-3)' }}>{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border" style={{ background: rs.bg, borderColor: rs.border, color: rs.color }}>
                                <RoleIcon className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                    {t(user.role.replace('_', ' '))}
                                </span>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            {user.clinic ? (
                                <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{user.clinic.name}</span>
                            ) : user.lab ? (
                                <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{user.lab.name}</span>
                            ) : (
                                <span className="text-[11px] font-medium opacity-40" style={{ color: 'var(--txt-3)' }}>{t('Independent')}</span>
                            )}
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--txt-3)' }} />
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>
                                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => router.patch(route('admin.users.toggle-active', user.id), {}, { preserveScroll: true })}
                                    className="p-2.5 rounded-xl transition-all border bg-transparent hover:bg-opacity-20"
                                    style={{ 
                                        borderColor: user.is_active ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)', 
                                        color: user.is_active ? '#fbbf24' : '#34d399',
                                        backgroundColor: user.is_active ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)'
                                    }}
                                    title={user.is_active ? t('Deactivate Account') : t('Activate Account')}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                                <Link
                                    href={route('admin.users.edit', user.id)}
                                    className="p-2.5 rounded-xl border transition-all hover:bg-opacity-20"
                                    style={{ backgroundColor: 'var(--accent-10)', borderColor: 'var(--border)', color: 'var(--accent)' }}
                                    title={t('Edit Details')}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setUserToDelete(user.id)}
                                    className="p-2.5 rounded-xl border transition-all hover:bg-opacity-20"
                                    style={{ backgroundColor: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' }}
                                    title={t('Delete User')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--surface)' }}>
                          <UserIcon className="w-10 h-10" style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-[15px]" style={{ color: 'var(--txt-1)' }}>{t('No Database Matches')}</h3>
                        <p className="font-medium text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Adjust your query parameters and try again.')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--txt-3)' }}>{t('Showing Database Index')}</p>
            <Pagination links={users.links} />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title={t('Delete User Account')}
        message={t('Are you sure you want to permanently delete this user account? This action cannot be undone and will erase all associated records.')}
        confirmText={t('Delete Account')}
        processing={processing}
      />
    </AdminLayout>
  );
}
