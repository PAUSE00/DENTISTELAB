import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import { useState, FormEvent } from 'react';
import { Search, UserPlus, Phone, Calendar, Eye, Edit, Users, FilterX, Sparkles } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';

interface Props extends PageProps {
    patients: {
        data: Patient[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ auth, patients, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('clinic.patients.index'), { search }, { preserveState: true });
    };

    return (
        <ClinicLayout>
            <Head title={t('Patients')} />

            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Patient')} <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">{t('Registry')}</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">{t('Manage patient records, history and contact information.')}</p>
                    </div>
                    <Link
                        href={route('clinic.patients.create')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">{t('New Patient')}</span>
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
                            placeholder={t('Search by name, phone or ID...')}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400"
                        />
                    </form>
                    <button
                        onClick={() => { setSearch(''); router.get(route('clinic.patients.index')); }}
                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 rounded-[1.5rem] transition-colors"
                        title={t('Clear Filters')}
                    >
                        <FilterX className="w-6 h-6" />
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-8 py-6">{t('Patient')}</th>
                                    <th className="px-6 py-6">{t('Date of Birth')}</th>
                                    <th className="px-6 py-6">{t('Contact')}</th>
                                    <th className="px-8 py-6 text-right">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {patients.data.length > 0 ? (
                                    patients.data.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                                                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-blue-500">
                                                                {patient.first_name[0]}{patient.last_name[0]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white tracking-tight">{patient.first_name} {patient.last_name}</p>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #{patient.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{patient.dob}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{patient.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                    <Link
                                                        href={route('clinic.patients.show', patient.id)}
                                                        className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 transition-all shadow-sm"
                                                        title={t('View Details')}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('clinic.patients.edit', patient.id)}
                                                        className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all shadow-sm"
                                                        title={t('Edit Patient')}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                    <Users className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('No Patients Found')}</h3>
                                                <p className="text-slate-400 font-medium text-xs mt-1">{t('Adjust your search criteria or add a new patient.')}</p>
                                                <Link
                                                    href={route('clinic.patients.create')}
                                                    className="mt-4 flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 transition-colors"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    {t('Add New Patient')}
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {patients.links && patients.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Patient Directory')}</p>
                            <Pagination links={patients.links} />
                        </div>
                    )}
                </div>
            </div>
        </ClinicLayout>
    );
}
