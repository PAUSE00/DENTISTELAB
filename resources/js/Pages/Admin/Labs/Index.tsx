import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, Plus, Edit2, Trash2, Activity, User, Phone, MapPin, Power } from 'lucide-react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

interface Lab {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    owner?: { name: string };
    is_active: boolean;
    clinics?: { id: number; name: string }[];
}

interface Props extends PageProps {
    labs: {
        data: Lab[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ auth, labs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.labs.index'), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lab? Users associated with it will be unlinked.')) {
            router.delete(route('admin.labs.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center w-full pr-4">
                    <h2 className="text-3xl font-black tracking-tight leading-tight" style={{ color: 'var(--txt-1)' }}>
                        Lab <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Management</span>
                    </h2>
                    <Link
                        href={route('admin.labs.create')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">Add New Lab</span>
                    </Link>
                </div>
            }
        >
            <Head title="Labs" />

            <div className="animate-fade-in space-y-6">
                {/* Filters */}
                <div className="card p-4 flex gap-4" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <TextInput
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search labs by name, address, or owner..."
                                className="w-full pl-10 app-input rounded-xl"
                            />
                        </div>
                    </form>
                </div>

                {/* Labs Table */}
                <div className="card overflow-hidden shadow-2xl dark:shadow-none" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead style={{ background: 'var(--surface)' }}>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--txt-3)' }}>
                                    <th className="px-8 py-6">Lab Name</th>
                                    <th className="px-6 py-6">Owner</th>
                                    <th className="px-6 py-6">Contact Info</th>
                                    <th className="px-6 py-6">Linked Clinics</th>
                                    <th className="px-6 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--surface)' }}>
                                {labs.data.length > 0 ? (
                                    labs.data.map((lab) => (
                                        <tr key={lab.id} className="group transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <div className="font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{lab.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                {lab.owner ? (
                                                    <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--txt-1)' }}>
                                                        <User className="w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                                        {lab.owner.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold italic" style={{ color: 'var(--txt-3)' }}>No Owner Assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {lab.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 border-t mt-1 pt-1" style={{ borderColor: 'var(--surface)' }}>
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[200px]" title={lab.address}>{lab.address}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                    {lab.clinics?.length || 0} Connected
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase font-black tracking-widest rounded-xl border ${lab.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                    {lab.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => router.patch(route('admin.labs.toggle-active', lab.id), {}, { preserveScroll: true })}
                                                        title={lab.is_active ? "Deactivate Lab" : "Activate Lab"}
                                                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${lab.is_active 
                                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' 
                                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={route('admin.labs.edit', lab.id)}
                                                        className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 transition-all shadow-sm"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(lab.id)}
                                                        className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--surface)' }}>
                                                    <Activity className="w-10 h-10" style={{ color: 'var(--txt-3)' }} />
                                                </div>
                                                <h3 className="font-black uppercase tracking-tight" style={{ color: 'var(--txt-1)' }}>No Labs Found</h3>
                                                <p className="font-medium text-xs mt-1" style={{ color: 'var(--txt-3)' }}>Try adjusting your search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-6 flex justify-between items-center border-t border-slate-100/10" style={{ background: 'var(--surface)' }}>
                        <Pagination links={labs.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
