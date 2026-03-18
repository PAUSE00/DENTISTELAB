import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Trash2, Download, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import OrderFilters from '@/Components/Orders/OrderFilters';
import OrderTable from '@/Components/Orders/OrderTable';
import { FilterOption, OrderListItem } from '@/types/order';

interface Props extends PageProps {
    orders: { data: OrderListItem[]; links: any[]; total: number };
    filters: { status?: string; priority?: string; search?: string; lab_id?: string; service_id?: string; date_from?: string; date_to?: string; payment_status?: string };
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
            if (localFilters.search !== (filters?.search || '')) applyFilters({ ...localFilters });
        }, 400);
        return () => clearTimeout(timeout);
    }, [localFilters.search]);

    const applyFilters = (newFilters?: any) => {
        const f = newFilters || localFilters;
        const params: any = {};
        Object.entries(f).forEach(([key, value]) => { if (value) params[key] = value; });
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
    const toggleSelectAll = () => setSelectedOrders(prev => prev.length === orders.data.length ? [] : orders.data.map(o => o.id));
    const toggleSelect = (id: number) => setSelectedOrders(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const handleBulkCancel = () => {
        if (!confirm(t('Are you sure you want to cancel the selected orders?'))) return;
        router.post(route('clinic.orders.bulk-cancel'), { order_ids: selectedOrders }, { onSuccess: () => setSelectedOrders([]) });
    };

    const handleBulkExport = () => {
        const params = new URLSearchParams();
        selectedOrders.forEach(id => params.append('order_ids[]', id.toString()));
        window.location.href = route('clinic.orders.bulk-export') + '?' + params.toString();
    };

    const filterFields = [
        { key: 'status',         label: t('Status'),   type: 'select' as const, options: statusOptions, placeholder: t('All Statuses') },
        { key: 'priority',       label: t('Priority'), type: 'select' as const, options: [{ value: 'normal', label: t('Normal') }, { value: 'urgent', label: t('Urgent') }], placeholder: t('All Priorities') },
        { key: 'lab_id',         label: t('Lab'),      type: 'select' as const, options: labs, placeholder: t('All Labs') },
        { key: 'service_id',     label: t('Service'),  type: 'select' as const, options: services, placeholder: t('All Services') },
        { key: 'date_from',      label: t('From Date'),type: 'date' as const },
        { key: 'date_to',        label: t('To Date'),  type: 'date' as const },
        { key: 'payment_status', label: t('Payment'),  type: 'select' as const, options: [{ value: 'unpaid', label: t('Unpaid') }, { value: 'partial', label: t('Partial') }, { value: 'paid', label: t('Paid') }], placeholder: t('All') },
    ];

    return (
        <ClinicLayout>
            <Head title={t('Orders')} />
            <div className="flex flex-col gap-5 pb-10">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }}>
                            <ClipboardList size={18} />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                                {t('Order Management')}
                            </h1>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                {orders.total} {t('total orders')}
                            </p>
                        </div>
                    </div>
                    <Link href={route('clinic.orders.create')} className="btn-primary">
                        <Plus size={13} /> {t('New Order')}
                    </Link>
                </div>

                {/* Filters */}
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

                {/* Table */}
                <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                    <OrderTable
                        orders={orders}
                        selectedOrders={selectedOrders}
                        variant="clinic"
                        showRoute={(id) => route('clinic.orders.show', id)}
                        onToggleSelectAll={toggleSelectAll}
                        onToggleSelect={toggleSelect}
                        bulkActions={
                            <>
                                <button onClick={handleBulkExport} className="btn-ghost text-[12px] !py-1.5">
                                    <Download size={12} /> {t('Export CSV')}
                                </button>
                                <button onClick={handleBulkCancel}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                                    style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                                    <Trash2 size={12} /> {t('Cancel Selected')}
                                </button>
                            </>
                        }
                    />
                </div>
            </div>
        </ClinicLayout>
    );
}
