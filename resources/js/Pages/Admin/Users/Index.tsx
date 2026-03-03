import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, Plus, Edit2, Trash2, User as UserIcon, Building2, Activity, Power, ShieldCheck, Mail, Calendar, FilterX, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
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

const roleStyles: Record<string, { color: string, icon: any }> = {
    super_admin: { color: 'from-purple-500/10 to-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50', icon: ShieldCheck },
    dentist: { color: 'from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50', icon: Activity },
    lab_owner: { color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50', icon: Building2 },
    lab_tech: { color: 'from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50', icon: Activity },
    clinic_staff: { color: 'from-slate-500/10 to-slate-500/5 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/50', icon: UserIcon },
};

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

    return (
        <AdminLayout header={t('User Management')}>
            <Head title={t('Users')} />

            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Platform')} <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{t('Users')}</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">{t('Manage accounts, roles and access permissions.')}</p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">{t('Create New User')}</span>
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('Search by name, email or ID...')}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400"
                        />
                    </form>
                    <div className="flex gap-2">
                        <select
                            value={filters.role || ''}
                            onChange={(e) => {
                                router.get(route('admin.users.index'), { search, role: e.target.value }, { preserveState: true, replace: true });
                            }}
                            className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200 font-bold text-sm appearance-none min-w-[180px]"
                        >
                            <option value="">{t('All Roles')}</option>
                            <option value="super_admin">{t('Super Admin')}</option>
                            <option value="dentist">{t('Dentist')}</option>
                            <option value="lab_owner">{t('Lab Owner')}</option>
                            <option value="lab_tech">{t('Lab Technician')}</option>
                            <option value="clinic_staff">{t('Clinic Staff')}</option>
                        </select>
                        <button 
                            onClick={() => { setSearch(''); router.get(route('admin.users.index')); }}
                            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 rounded-[1.5rem] transition-colors"
                            title={t('Clear Filters')}
                        >
                            <FilterX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-8 py-6">{t('Identity')}</th>
                                    <th className="px-6 py-6">{t('Status & Role')}</th>
                                    <th className="px-6 py-6">{t('Entity Association')}</th>
                                    <th className="px-6 py-6">{t('Engagement')}</th>
                                    <th className="px-8 py-6 text-right">{t('System Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => {
                                        const style = roleStyles[user.role] || roleStyles.clinic_staff;
                                        const RoleIcon = style.icon;
                                        
                                        return (
                                            <tr key={user.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                                                                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-indigo-500 italic">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 dark:text-white tracking-tight">{user.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Mail className="w-3 h-3 text-slate-400" />
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gradient-to-br transition-all duration-300 ${style.color}`}>
                                                        <RoleIcon className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                            {t(user.role.replace('_', ' '))}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.clinic ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                                                <Building2 className="w-3.5 h-3.5" />
                                                            </div>
                                                            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{user.clinic.name}</span>
                                                        </div>
                                                    ) : user.lab ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                                                <Activity className="w-3.5 h-3.5" />
                                                            </div>
                                                            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{user.lab.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('Independent')}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            onClick={() => router.patch(route('admin.users.toggle-active', user.id), {}, { preserveScroll: true })}
                                                            className={`p-2.5 rounded-xl transition-all shadow-sm border ${user.is_active 
                                                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-100 dark:border-amber-500/20 hover:bg-amber-100' 
                                                                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100'}`}
                                                            title={user.is_active ? t('Deactivate') : t('Activate')}
                                                        >
                                                            <Power className="w-4 h-4" />
                                                        </button>
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all shadow-sm"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setUserToDelete(user.id)}
                                                            className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 transition-all shadow-sm"
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
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                    <UserIcon className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('No Database Matches')}</h3>
                                                <p className="text-slate-400 font-medium text-xs mt-1">{t('Adjust your query parameters and try again.')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Showing Database Index')}</p>
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title={t('Restrict User Access')}
                message={t('Are you sure you want to delete this user? This will permanently revoke all access rights. This configuration cannot be rolled back.')}
                processing={processing}
                variant="danger"
            />
        </AdminLayout>
    );
}
