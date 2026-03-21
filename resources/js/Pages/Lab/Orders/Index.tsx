import LabLayout from '@/Layouts/LabLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import OrderFilters from '@/Components/Orders/OrderFilters';
import OrderTable from '@/Components/Orders/OrderTable';
import { FilterOption, OrderListItem } from '@/types/order';

interface Props extends PageProps {
 orders: { data: OrderListItem[]; links: any[]; total?: number; };
 filters: { status?: string; priority?: string; search?: string; clinic_id?: string; date_from?: string; date_to?: string; payment_status?: string; };
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
 Object.entries(f).forEach(([key, value]) => { if (value) params[key] = value; });
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

 const toggleSelectAll = () => setSelectedOrders(prev =>
 prev.length === orders.data.length ? [] : orders.data.map(o => o.id)
 );
 const toggleSelect = (id: number) => setSelectedOrders(prev =>
 prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
 );

 const handleBulkStatusUpdate = () => {
 if (!confirm(t('Are you sure you want to update the selected orders?'))) return;
 router.post(route('lab.orders.bulk-status-update'), { order_ids: selectedOrders, status: 'in_progress' }, {
 onSuccess: () => setSelectedOrders([]),
 });
 };

 const filterFields = [
 { key: 'status', label: t('Status'), type: 'select' as const, options: statusOptions, placeholder: t('All Statuses') },
 { key: 'priority', label: t('Priority'), type: 'select' as const, options: [{ value: 'normal', label: t('Normal') }, { value: 'urgent', label: t('Urgent') }], placeholder: t('All') },
 { key: 'clinic_id', label: t('Clinic'), type: 'select' as const, options: clinics, placeholder: t('All Clinics') },
 { key: 'date_from', label: t('From'), type: 'date' as const },
 { key: 'date_to', label: t('To'), type: 'date' as const },
 { key: 'payment_status', label: t('Payment'), type: 'select' as const, options: [{ value: 'unpaid', label: t('Unpaid') }, { value: 'partial', label: t('Partial') }, { value: 'paid', label: t('Paid') }], placeholder: t('All') },
 ];

 return (
 <LabLayout>
 <Head title={t('Orders')} />
 <div className="flex flex-col gap-4">
 {/* Page header */}
 <div>
 <h2 className="text-[17px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('Order Management')}
 </h2>
 <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
 {orders.total ?? orders.data.length} {t('total orders')}
 </p>
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
 <button
 onClick={handleBulkStatusUpdate}
 className="btn-primary text-[12px]"
 >
 <Play size={12} /> {t('Start Production')}
 </button>
 }
 />
 </div>
 </LabLayout>
 );
}
