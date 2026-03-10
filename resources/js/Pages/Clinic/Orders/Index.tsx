import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Trash2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';

// Shared sub-components
import OrderFilters from '@/Components/Orders/OrderFilters';
import OrderTable from '@/Components/Orders/OrderTable';
import { FilterOption, OrderListItem } from '@/types/order';

interface Props extends PageProps {
    orders: {
        data: OrderListItem[];
        links: any[];
        total: number;
    };
    filters: {
        status?: string;
        priority?: string;
        search?: string;
        lab_id?: string;
        service_id?: string;
        date_from?: string;
        date_to?: string;
        payment_status?: string;
    };
    statusOptions: FilterOption[];
    labs: { id: number; name: string }[];
    services: { id: number; name: string }[];
}

export default function Index({ auth, orders, filters, statusOptions, labs, services }: Props) {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

    const [localFilters, setLocalFilters] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        priority: filters?.priority || '',
        lab_id: filters?.lab_id || '',
        service_id: filters?.service_id || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        payment_status: filters?.payment_status || '',
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localFilters.search !== (filters?.search || '')) {
                applyFilters({ ...localFilters });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [localFilters.search]);

    const applyFilters = (newFilters?: any) => {
        const f = newFilters || localFilters;
        const params: any = {};
        Object.entries(f).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        router.get(route('clinic.orders.index'), params, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        const empty = { search: '', status: '', priority: '', lab_id: '', service_id: '', date_from: '', date_to: '', payment_status: '' };
        setLocalFilters(empty);
        router.get(route('clinic.orders.index'), {}, { preserveState: true });
    };

    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        if (key !== 'search') applyFilters(newFilters);
    };

    const activeFilterCount = Object.entries(localFilters).filter(([key, val]) => val && key !== 'search').length;

    const toggleSelectAll = () => {
        setSelectedOrders(prev => prev.length === orders.data.length ? [] : orders.data.map(o => o.id));
    };

    const toggleSelect = (id: number) => {
        setSelectedOrders(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkCancel = () => {
        if (!confirm(t('Are you sure you want to cancel the selected orders?'))) return;
        router.post(route('clinic.orders.bulk-cancel'), { order_ids: selectedOrders }, {
            onSuccess: () => setSelectedOrders([]),
        });
    };

    const handleBulkExport = () => {
        const params = new URLSearchParams();
        selectedOrders.forEach(id => params.append('order_ids[]', id.toString()));
        window.location.href = route('clinic.orders.bulk-export') + '?' + params.toString();
    };

    const filterFields = [
        { key: 'status', label: t('Status'), type: 'select' as const, options: statusOptions, placeholder: t('All Statuses') },
        { key: 'priority', label: t('Priority'), type: 'select' as const, options: [{ value: 'normal', label: t('Normal') }, { value: 'urgent', label: t('Urgent') }], placeholder: t('All Priorities') },
        { key: 'lab_id', label: t('Lab'), type: 'select' as const, options: labs, placeholder: t('All Labs') },
        { key: 'service_id', label: t('Service'), type: 'select' as const, options: services, placeholder: t('All Services') },
        { key: 'date_from', label: t('From Date'), type: 'date' as const },
        { key: 'date_to', label: t('To Date'), type: 'date' as const },
        { key: 'payment_status', label: t('Payment'), type: 'select' as const, options: [{ value: 'unpaid', label: t('Unpaid') }, { value: 'partial', label: t('Partial') }, { value: 'paid', label: t('Paid') }], placeholder: t('All') },
    ];

    return (
        <ClinicLayout>
            <Head title={t('Orders')} />

            <div className="space-y-6 animate-fade-in pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {t('Order')} <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{t('Management')}</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">{t('Track and manage your dental laboratory orders.')}</p>
                    </div>
                    <Link
                        href={route('clinic.orders.create')}
                        className="group flex items-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all duration-300 transform active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold tracking-tight">{t('New Order')}</span>
                    </Link>
                </div>

                <OrderFilters
                    localFilters={localFilters}
                    showFilters={showFilters}
                    activeFilterCount={activeFilterCount}
                    searchPlaceholder={t('Search by patient, ID or lab...')}
                    filterFields={filterFields}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onUpdateFilter={updateFilter}
                    onClearFilters={clearFilters}
                />

                <OrderTable
                    orders={orders}
                    selectedOrders={selectedOrders}
                    variant="clinic"
                    showRoute={(id) => route('clinic.orders.show', id)}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleSelect={toggleSelect}
                    bulkActions={
                        <>
                            <button onClick={handleBulkExport} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all font-bold text-xs">
                                <Download className="w-3.5 h-3.5" /> {t('Export CSV')}
                            </button>
                            <button onClick={handleBulkCancel} className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all font-bold text-xs shadow-lg shadow-rose-500/25">
                                <Trash2 className="w-3.5 h-3.5" /> {t('Cancel Selected')}
                            </button>
                        </>
                    }
                />
            </div>
        </ClinicLayout>
    );
}
