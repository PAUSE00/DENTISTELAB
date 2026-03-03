import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, Plus, Edit2, Trash2, Building2, User, Phone, MapPin, Power } from 'lucide-react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

interface Clinic {
    id: number;
    name: string;
    address: string;
    phone: string;
    owner?: { name: string };
    created_at: string;
    is_active: boolean;
    labs?: { id: number; name: string }[];
}

interface Props extends PageProps {
    clinics: {
        data: Clinic[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ auth, clinics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.clinics.index'), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this clinic? Users associated with it will be unlinked.')) {
            router.delete(route('admin.clinics.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center w-full pr-4">
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Clinic Management
                    </h2>
                    <Link
                        href={route('admin.clinics.create')}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Clinic
                    </Link>
                </div>
            }
        >
            <Head title="Clinics" />

            <div className="animate-fade-in space-y-6">
                {/* Filters */}
                <div className="glass-card p-4 flex gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <TextInput
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search clinics by name, address, or owner..."
                                className="w-full pl-10 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                            />
                        </div>
                    </form>
                </div>

                {/* Clinics Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700/50">
                            <thead className="bg-gray-50/50 dark:bg-slate-800/50 flex-col">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clinic Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Linked Labs</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                                {clinics.data.length > 0 ? (
                                    clinics.data.map((clinic) => (
                                        <tr key={clinic.id} className="hover:bg-hover dark:hover:bg-hover transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-sm font-medium text-text dark:text-text">{clinic.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {clinic.owner ? (
                                                    <div className="flex items-center gap-2 text-sm text-text dark:text-text">
                                                        <User className="w-4 h-4 text-sub" />
                                                        {clinic.owner.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-sub italic">No Owner Assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {clinic.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[200px]" title={clinic.address}>{clinic.address}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                                                    {clinic.labs?.length || 0} Connected
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ring-1 ring-inset ${clinic.is_active ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-green-600/20' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-red-600/10'}`}>
                                                    {clinic.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => router.patch(route('admin.clinics.toggle-active', clinic.id), {}, { preserveScroll: true })}
                                                        title={clinic.is_active ? "Deactivate Clinic" : "Activate Clinic"}
                                                        className={`${clinic.is_active ? 'text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50' : 'text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'} p-2 rounded-lg transition-colors ring-1 ring-inset ring-opacity-10`}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={route('admin.clinics.edit', clinic.id)}
                                                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors ring-1 ring-inset ring-primary-600/10"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(clinic.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors ring-1 ring-inset ring-red-600/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <Building2 className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">No clinics found</p>
                                            <p className="text-sm">Try adjusting your search terms</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-slate-700/50">
                        <Pagination links={clinics.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
