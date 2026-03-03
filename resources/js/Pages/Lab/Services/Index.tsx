import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Search, Edit, Trash2, Package, CheckCircle2, XCircle, Clock, DollarSign, FilterX } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface Service {
    id: number;
    name: string;
    description: string | null;
    price: string;
    production_days: number;
    is_active: boolean;
}

interface Props extends PageProps {
    services: Service[];
}

export default function Index({ auth, services }: Props) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

    const deleteService = () => {
        if (deleteTarget !== null) {
            router.delete(route('lab.services.destroy', deleteTarget), {
                onFinish: () => setDeleteTarget(null),
            });
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <LabLayout>
            <Head title={t('Service Catalog')} />

            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Service')} <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{t('Catalog')}</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">{t("Manage your lab's services and pricing.")}</p>
                    </div>
                    <Link
                        href={route('lab.services.create')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">{t('Add New Service')}</span>
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('Search services...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500/20 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-[1.5rem] transition-colors"
                        title={t('Clear')}
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
                                    <th className="px-8 py-6">{t('Service')}</th>
                                    <th className="px-6 py-6">{t('Price')}</th>
                                    <th className="px-6 py-6">{t('Turnaround')}</th>
                                    <th className="px-6 py-6">{t('Status')}</th>
                                    <th className="px-8 py-6 text-right">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <tr key={service.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                                                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white tracking-tight">{service.name}</p>
                                                        {service.description && (
                                                            <span className="text-[10px] text-slate-400 font-bold line-clamp-1 max-w-sm">{service.description}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="font-black text-slate-900 dark:text-white tracking-tight">
                                                        {parseFloat(service.price).toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MAD</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {service.production_days} {t('days')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {service.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('Active')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-500/20 text-slate-500 bg-slate-500/10">
                                                        <XCircle className="w-3.5 h-3.5" /> {t('Inactive')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                                    <Link
                                                        href={route('lab.services.edit', service.id)}
                                                        className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all shadow-sm"
                                                        title={t('Edit Service')}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteTarget(service.id)}
                                                        className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 transition-all shadow-sm"
                                                        title={t('Delete Service')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                    <Package className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('No Services Found')}</h3>
                                                <p className="text-slate-400 font-medium text-xs mt-1">{t('Add a new service to get started.')}</p>
                                                <Link
                                                    href={route('lab.services.create')}
                                                    className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm hover:text-emerald-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    {t('Add New Service')}
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={deleteService}
                title={t('Delete Service')}
                message={t('Are you sure you want to delete this service? Existing orders will not be affected.')}
                confirmText={t('Delete')}
                variant="danger"
            />
        </LabLayout>
    );
}
