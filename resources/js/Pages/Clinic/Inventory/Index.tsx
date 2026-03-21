import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
 Package, Plus, Search, AlertTriangle,
 Trash2, Edit2, ChevronUp, ChevronDown,
 Archive, DollarSign, Layers, X, Syringe,
 FlaskConical, Shield, Wind, Cpu, Stethoscope
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';
import Modal from '@/Components/Modal';

// ── Dental-specific constants ──────────────────────────────────
const DENTAL_CATEGORIES = [
 { value: 'Anesthesia', label: 'Anesthesia', icon: Syringe, color: '#f87171' },
 { value: 'Composites & Bonding',label: 'Composites & Bonding', icon: FlaskConical,color: '#818cf8' },
 { value: 'Impression Materials',label: 'Impression Materials', icon: Layers, color: '#c084fc' },
 { value: 'Endodontics', label: 'Endodontics', icon: Stethoscope, color: '#f59e0b' },
 { value: 'Sterilization', label: 'Sterilization', icon: Shield, color: '#34d399' },
 { value: 'Disposables', label: 'Disposables', icon: Wind, color: '#60ddc6' },
 { value: 'Digital / CAD-CAM', label: 'Digital / CAD-CAM', icon: Cpu, color: '#818cf8' },
 { value: 'Other', label: 'Other', icon: Package, color: '#94a3b8' },
];

const DENTAL_UNITS = ['pcs', 'box', 'vial', 'tube', 'ml', 'g', 'pack', 'pair', 'roll', 'kit'];

const CATEGORY_META: Record<string, { color: string; bg: string }> = {
 'Anesthesia': { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
 'Composites & Bonding': { color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
 'Impression Materials': { color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
 'Endodontics': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
 'Sterilization': { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
 'Disposables': { color: '#60ddc6', bg: 'rgba(96,221,198,0.1)' },
 'Digital / CAD-CAM': { color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
 'Other': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const getCategoryMeta = (cat: string | null) =>
 CATEGORY_META[cat ?? ''] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };

// ─────────────────────────────────────────────────────────────
interface InventoryItem {
 id: number;
 name: string;
 category: string | null;
 quantity: number;
 unit: string;
 min_threshold: number;
 supplier: string | null;
 price_per_unit: number | null;
}

interface Props extends PageProps {
 items: InventoryItem[];
 stats: {
 total_items: number;
 low_stock: number;
 categories: string[];
 inventory_value: number;
 };
 filters: { search?: string; category?: string };
}

const fmtCurrency = (v: number) =>
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

// ── Item Form (shared by Add + Edit) ──────────────────────────
function ItemForm({
 data, setData, errors, processing, onSubmit, onClose, isEdit
}: {
 data: any; setData: any; errors: any; processing: boolean;
 onSubmit: (e: React.FormEvent) => void; onClose: () => void; isEdit?: boolean;
}) {
 const { t } = useTranslation();

 return (
 <form onSubmit={onSubmit} className="flex flex-col gap-5">
 {/* Item Name */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Item Name')} *</label>
 <input
 type="text"
 className="app-input"
 placeholder={t('e.g. Lidocaine 2% Cartridges')}
 value={data.name}
 onChange={e => setData('name', e.target.value)}
 required
 autoFocus
 />
 {errors.name && <p className="text-[10px] text-rose-400">{errors.name}</p>}
 </div>

 {/* Category */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Category')}</label>
 <div className="grid grid-cols-4 gap-2">
 {DENTAL_CATEGORIES.map(cat => {
 const Icon = cat.icon;
 const selected = data.category === cat.value;
 return (
 <button
 key={cat.value}
 type="button"
 onClick={() => setData('category', cat.value)}
 className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center"
 style={{
 borderColor: selected ? `${cat.color}60` : 'var(--border)',
 background: selected ? `${cat.color}12` : 'var(--surface)',
 color: selected ? cat.color : 'var(--txt-3)',
 }}
 >
 <Icon size={16} />
 <span className="text-[9px] font-bold leading-tight">{cat.label}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Supplier */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Supplier')}</label>
 <input
 type="text"
 className="app-input"
 placeholder={t('e.g. DentalPlus, Septodont, Dentsply...')}
 value={data.supplier}
 onChange={e => setData('supplier', e.target.value)}
 />
 </div>

 {/* Quantity / Unit / Threshold */}
 <div className="grid grid-cols-3 gap-4">
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Quantity')} *</label>
 <input
 type="number"
 min={0}
 className="app-input"
 value={data.quantity}
 onChange={e => setData('quantity', Number(e.target.value))}
 required
 />
 {errors.quantity && <p className="text-[10px] text-rose-400">{errors.quantity}</p>}
 </div>

 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Unit')} *</label>
 <select
 className="app-input"
 value={data.unit}
 onChange={e => setData('unit', e.target.value)}
 >
 {DENTAL_UNITS.map(u => (
 <option key={u} value={u}>{u}</option>
 ))}
 </select>
 </div>

 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Alert At')} *</label>
 <input
 type="number"
 min={0}
 className="app-input"
 value={data.min_threshold}
 onChange={e => setData('min_threshold', Number(e.target.value))}
 required
 />
 <p className="text-[9px] opacity-30">{t('Send alert when below this')}</p>
 </div>
 </div>

 {/* Unit Cost */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('Unit Cost (MAD)')}</label>
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold opacity-40">MAD</span>
 <input
 type="number"
 min={0}
 step="0.01"
 className="app-input pl-12"
 placeholder="0.00"
 value={data.price_per_unit}
 onChange={e => setData('price_per_unit', e.target.value)}
 />
 </div>
 </div>

 {/* Actions */}
 <div className="flex gap-3 pt-2">
 <button type="button" onClick={onClose}
 className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all hover:bg-white/5"
 style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
 {t('Cancel')}
 </button>
 <button type="submit" disabled={processing}
 className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
 <Plus size={16} />
 {processing ? t('Saving...') : isEdit ? t('Save Changes') : t('Add to Inventory')}
 </button>
 </div>
 </form>
 );
}

// ─────────────────────────────────────────────────────────────
export default function Index({ items, stats, filters }: Props) {
 const { t } = useTranslation();
 const [isAddOpen, setIsAddOpen] = useState(false);
 const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
 const [categoryFilter, setCategoryFilter] = useState(filters.category ?? '');
 const [search, setSearch] = useState(filters.search ?? '');

 // ── Add form ──
 const addForm = useForm({
 name: '', category: '', quantity: 0, unit: 'pcs',
 min_threshold: 5, supplier: '', price_per_unit: '',
 });

 // ── Edit form ──
 const editForm = useForm({
 name: '', category: '', quantity: 0, unit: 'pcs',
 min_threshold: 5, supplier: '', price_per_unit: '',
 });

 const openEdit = (item: InventoryItem) => {
 setEditingItem(item);
 editForm.setData({
 name: item.name,
 category: item.category ?? '',
 quantity: item.quantity,
 unit: item.unit,
 min_threshold: item.min_threshold,
 supplier: item.supplier ?? '',
 price_per_unit: item.price_per_unit?.toString() ?? '',
 });
 };

 const handleAdd = (e: React.FormEvent) => {
 e.preventDefault();
 addForm.post(route('clinic.inventory.store'), {
 onSuccess: () => { setIsAddOpen(false); addForm.reset(); },
 });
 };

 const handleEdit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingItem) return;
 editForm.patch(route('clinic.inventory.update', editingItem.id), {
 onSuccess: () => setEditingItem(null),
 });
 };

 const handleQuickUpdate = (id: number, currentQty: number, delta: number) => {
 router.patch(route('clinic.inventory.update', id), {
 quantity: Math.max(0, currentQty + delta),
 }, { preserveScroll: true });
 };

 const handleDelete = (id: number) => {
 if (confirm(t('Remove this item from inventory?'))) {
 router.delete(route('clinic.inventory.destroy', id), { preserveScroll: true });
 }
 };

 const applyFilters = () => {
 router.get(route('clinic.inventory.index'), { search, category: categoryFilter }, { preserveState: true });
 };

 // Displayed items (locally filtered if needed)
 const displayed = items;

 return (
 <ClinicLayout>
 <Head title={t('Inventory')} />

 <div className="flex flex-col gap-6 pb-12">

 {/* ── Header ──────────────────────────────────────────── */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Clinic Inventory')}
 </h2>
 <p className="text-xs font-bold uppercase tracking-widest mt-0.5 opacity-40">
 {t('Dental supplies & consumables')}
 </p>
 </div>
 <button onClick={() => setIsAddOpen(true)} className="btn-primary flex items-center gap-2 px-5 py-2.5">
 <Plus size={15} /> {t('Add Item')}
 </button>
 </div>

 {/* ── KPI Cards ───────────────────────────────────────── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: t('Total Items'), val: stats.total_items, icon: Package, color: '#818cf8', valStr: String(stats.total_items) },
 { label: t('Low Stock Alerts'), val: stats.low_stock, icon: AlertTriangle, color: stats.low_stock > 0 ? '#f87171' : '#34d399', valStr: String(stats.low_stock) },
 { label: t('Categories'), val: stats.categories.length, icon: Layers, color: '#c084fc', valStr: String(stats.categories.length) },
 { label: t('Total Value'), val: stats.inventory_value, icon: DollarSign,color: '#60ddc6', valStr: fmtCurrency(stats.inventory_value) },
 ].map(({ label, icon: Icon, color, valStr, val }) => (
 <div key={label} className="card p-4 flex items-center gap-4"
 style={{ background: label === t('Low Stock Alerts') && val > 0 ? 'rgba(248,113,113,0.04)' : 'var(--bg-raised)',
 borderColor: label === t('Low Stock Alerts') && val > 0 ? 'rgba(248,113,113,0.2)' : 'var(--border)' }}>
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
 style={{ background: `${color}15`, color }}>
 <Icon size={18} />
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</p>
 <p className="text-[22px] font-black leading-none mt-0.5" style={{ color: label === t('Low Stock Alerts') && val > 0 ? color : 'var(--txt-1)' }}>{valStr}</p>
 </div>
 </div>
 ))}
 </div>

 {/* ── Category Filter Tabs ─────────────────────────────── */}
 <div className="flex items-center gap-2 flex-wrap">
 <button
 onClick={() => { setCategoryFilter(''); router.get(route('clinic.inventory.index'), { search, category: '' }, { preserveState: true }); }}
 className="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all"
 style={{
 background: !categoryFilter ? 'rgba(96,221,198,0.12)' : 'transparent',
 borderColor: !categoryFilter ? '#60ddc6' : 'var(--border)',
 color: !categoryFilter ? '#60ddc6' : 'var(--txt-3)',
 }}>
 {t('All')} ({stats.total_items})
 </button>
 {DENTAL_CATEGORIES.map(cat => {
 const count = items.filter(i => i.category === cat.value).length;
 if (count === 0) return null;
 const active = categoryFilter === cat.value;
 return (
 <button key={cat.value}
 onClick={() => { setCategoryFilter(cat.value); router.get(route('clinic.inventory.index'), { search, category: cat.value }, { preserveState: true }); }}
 className="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all"
 style={{
 background: active ? `${cat.color}12` : 'transparent',
 borderColor: active ? cat.color : 'var(--border)',
 color: active ? cat.color : 'var(--txt-3)',
 }}>
 {cat.label} ({count})
 </button>
 );
 })}
 </div>

 {/* ── Table ───────────────────────────────────────────── */}
 <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>

 {/* toolbar */}
 <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
 <div className="relative flex-1 max-w-xs">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
 <input
 type="text"
 placeholder={t('Search items or supplier...')}
 className="app-input pl-9 h-9 text-sm"
 value={search}
 onChange={e => setSearch(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && applyFilters()}
 />
 </div>
 {stats.low_stock > 0 && (
 <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
 style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
 <AlertTriangle size={11} /> {stats.low_stock} {t('low stock')}
 </span>
 )}
 </div>

 <div className="table-responsive hide-scrollbar">
 <table className="w-full text-left">
 <thead>
 <tr className="text-[10px] font-black uppercase tracking-widest opacity-30 border-b" style={{ borderColor: 'var(--border)' }}>
 <th className="px-5 py-3">{t('Item')}</th>
 <th className="px-5 py-3">{t('Category')}</th>
 <th className="px-5 py-3">{t('Stock Level')}</th>
 <th className="px-5 py-3 text-center">{t('Qty')}</th>
 <th className="px-5 py-3 text-right hidden md:table-cell">{t('Unit Cost')}</th>
 <th className="px-5 py-3 text-right">{t('Actions')}</th>
 </tr>
 </thead>
 <tbody>
 {displayed.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-20 text-center">
 <div className="flex flex-col items-center gap-3 opacity-20">
 <Archive size={36} />
 <p className="text-sm font-bold">{t('No items yet')}</p>
 <button onClick={() => setIsAddOpen(true)} className="text-xs underline">
 {t('Add your first supply item')}
 </button>
 </div>
 </td>
 </tr>
 ) : displayed.map(item => {
 const isLow = item.quantity <= item.min_threshold;
 const pct = item.min_threshold > 0
 ? Math.min((item.quantity / (item.min_threshold * 3)) * 100, 100)
 : 100;
 const catMeta = getCategoryMeta(item.category);

 return (
 <tr key={item.id}
 className="border-b group transition-colors"
 style={{ borderColor: 'var(--border)' }}
 onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

 {/* Item name + supplier */}
 <td className="px-5 py-3.5">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
 style={{ background: catMeta.bg, color: catMeta.color }}>
 {(item.name[0] ?? '?').toUpperCase()}
 </div>
 <div>
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{item.name}</p>
 <p className="text-[10px] opacity-40">{item.supplier ?? t('No supplier')}</p>
 </div>
 </div>
 </td>

 {/* Category pill */}
 <td className="px-5 py-3.5">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
 style={{ background: catMeta.bg, color: catMeta.color }}>
 {item.category ?? t('General')}
 </span>
 </td>

 {/* Stock bar */}
 <td className="px-5 py-3.5 min-w-[120px]">
 <div className="flex flex-col gap-1">
 <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
 <div className="h-full rounded-full transition-all"
 style={{ width: `${pct}%`, background: isLow ? '#f87171' : '#34d399' }} />
 </div>
 {isLow ? (
 <p className="text-[9px] font-bold text-rose-400 flex items-center gap-1">
 <AlertTriangle size={8} /> {t('Low — reorder soon')}
 </p>
 ) : (
 <p className="text-[9px] opacity-30">{t('Min:')} {item.min_threshold} {item.unit}</p>
 )}
 </div>
 </td>

 {/* Quantity stepper */}
 <td className="px-5 py-3.5">
 <div className="flex items-center justify-center gap-2">
 <button
 onClick={() => handleQuickUpdate(item.id, item.quantity, -1)}
 className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
 style={{ color: 'var(--txt-3)' }}>
 <ChevronDown size={13} />
 </button>
 <span className={`text-[14px] font-black min-w-[36px] text-center tabular-nums ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
 {item.quantity}
 <span className="text-[9px] opacity-50 ml-0.5">{item.unit}</span>
 </span>
 <button
 onClick={() => handleQuickUpdate(item.id, item.quantity, 1)}
 className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
 style={{ color: 'var(--txt-3)' }}>
 <ChevronUp size={13} />
 </button>
 </div>
 </td>

 {/* Unit cost */}
 <td className="px-5 py-3.5 text-right hidden md:table-cell">
 <span className="text-[13px] font-bold" style={{ color: 'var(--txt-2)' }}>
 {item.price_per_unit ? fmtCurrency(item.price_per_unit) : '—'}
 </span>
 </td>

 {/* Actions */}
 <td className="px-5 py-3.5 text-right">
 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => openEdit(item)}
 className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[#818cf8]/10"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
 onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
 <Edit2 size={13} />
 </button>
 <button
 onClick={() => handleDelete(item.id)}
 className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/10"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
 onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
 <Trash2 size={13} />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* ── Add Modal ─────────────────────────────────────────── */}
 <Modal show={isAddOpen} onClose={() => setIsAddOpen(false)} maxWidth="lg">
 <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex justify-between items-center mb-6">
 <div>
 <h2 className="text-lg font-black" style={{ color: 'var(--txt-1)' }}>{t('Add Supply Item')}</h2>
 <p className="text-[11px] opacity-40 mt-0.5">{t('Track a new clinical consumable')}</p>
 </div>
 <button onClick={() => setIsAddOpen(false)} style={{ color: 'var(--txt-3)' }}>
 <X size={18} />
 </button>
 </div>
 <ItemForm
 data={addForm.data}
 setData={addForm.setData}
 errors={addForm.errors}
 processing={addForm.processing}
 onSubmit={handleAdd}
 onClose={() => setIsAddOpen(false)}
 />
 </div>
 </Modal>

 {/* ── Edit Modal ─────────────────────────────────────────── */}
 <Modal show={!!editingItem} onClose={() => setEditingItem(null)} maxWidth="lg">
 <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex justify-between items-center mb-6">
 <div>
 <h2 className="text-lg font-black" style={{ color: 'var(--txt-1)' }}>{t('Edit Item')}</h2>
 <p className="text-[11px] opacity-40 mt-0.5">{editingItem?.name}</p>
 </div>
 <button onClick={() => setEditingItem(null)} style={{ color: 'var(--txt-3)' }}>
 <X size={18} />
 </button>
 </div>
 <ItemForm
 data={editForm.data}
 setData={editForm.setData}
 errors={editForm.errors}
 processing={editForm.processing}
 onSubmit={handleEdit}
 onClose={() => setEditingItem(null)}
 isEdit
 />
 </div>
 </Modal>

 </ClinicLayout>
 );
}
