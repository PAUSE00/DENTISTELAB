import LabLayout from '@/Layouts/LabLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

// Shared sub-components
import OrderFilters from '@/Components/Orders/OrderFilters';
import OrderTable from '@/Components/Orders/OrderTable';
import { FilterOption, OrderListItem } from '@/types/order';

interface Props extends PageProps {
    orders: {
        data: OrderListItem[];
        links: any[];
    };
    filters: {
        status?: string;
        priority?: string;
        search?: string;
        clinic_id?: string;
        date_from?: string;
        date_to?: string;
        payment_status?: string;
    };
    statusOptions: FilterOption[];
    clinics: { id: number; name: string }[];
}

export default function Index({ auth, orders, filters, statusOptions, clinics }: Props) {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

    const [localFilters, setLocalFilters] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        priority: filters?.priority || '',
        clinic_id: filters?.clinic_id || '',
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
        router.get(route('lab.orders.index'), params, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        const empty = { search: '', status: '', priority: '', clinic_id: '', date_from: '', date_to: '', payment_status: '' };
        setLocalFilters(empty);
        router.get(route('lab.orders.index'), {}, { preserveState: true });
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

    const handleBulkStatusUpdate = () => {
        if (!confirm(t('Are you sure you want to update the selected orders?'))) return;
        router.post(route('lab.orders.bulk-status-update'), { order_ids: selectedOrders, status: 'in_progress' }, {
            onSuccess: () => setSelectedOrders([]),
        });
    };

    const filterFields = [
        { key: 'status', label: t('Status'), type: 'select' as const, options: statusOptions, placeholder: t('All Statuses') },
        { key: 'priority', label: t('Priority'), type: 'select' as const, options: [{ value: 'normal', label: t('Normal') }, { value: 'urgent', label: t('Urgent') }], placeholder: t('All Priorities') },
        { key: 'clinic_id', label: t('Clinic'), type: 'select' as const, options: clinics, placeholder: t('All Clinics') },
        { key: 'date_from', label: t('From Date'), type: 'date' as const },
        { key: 'date_to', label: t('To Date'), type: 'date' as const },
        { key: 'payment_status', label: t('Payment'), type: 'select' as const, options: [{ value: 'unpaid', label: t('Unpaid') }, { value: 'partial', label: t('Partial') }, { value: 'paid', label: t('Paid') }], placeholder: t('All') },
    ];

    return (
        <LabLayout>
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
                </div>

                <OrderFilters
                    localFilters={localFilters}
                    showFilters={showFilters}
                    activeFilterCount={activeFilterCount}
                    searchPlaceholder={t('Search by patient, ID or clinic...')}
                    filterFields={filterFields}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onUpdateFilter={updateFilter}
                    onClearFilters={clearFilters}
                />

                <OrderTable
                    orders={orders}
                    selectedOrders={selectedOrders}
                    variant="lab"
                    showRoute={(id) => route('lab.orders.show', id)}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleSelect={toggleSelect}
                    bulkActions={
                        <>
                            <button onClick={handleBulkStatusUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-bold text-xs shadow-lg shadow-blue-500/25">
                                <Download className="w-3.5 h-3.5" /> {t('Start Production')}
                            </button>
                        </>
                    }
                />
            </div>
        </LabLayout>
    );
}
