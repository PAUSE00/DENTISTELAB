import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus, Search, Edit, Trash2, Package,
    Clock, SlidersHorizontal, X, CheckCircle2, XCircle
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface Service {
    id: number; name: string; description: string | null;
    price: string; production_days: number; is_active: boolean;
    category: string; image_url: string | null;
}
interface Props extends PageProps { services: Service[]; categories: string[]; }

/* ── Category → color map (matches ServiceForm) ─────────────── */
const CATEGORY_COLORS: Record<string, string> = {
    'Fixed Prosthetics':    '#60ddc6',
    'Removable Prosthetics':'#818cf8',
    'Implantology':         '#c084fc',
    'Orthodontics':         '#34d399',
    'Temporaries':          '#f59e0b',
    'Other':                '#94a3b8',
};
const CATEGORY_FALLBACK_IMG: Record<string, string> = {
    'Fixed Prosthetics':    '/images/services/crown.png',
    'Removable Prosthetics':'/images/services/denture.png',
    'Implantology':         '/images/services/implant.png',
    'Orthodontics':         '/images/services/aligner.png',
    'Temporaries':          '/images/services/crown.png',
    'Other':                '/images/services/inlay.png',
};

const CATEGORY_ORDER = ['Fixed Prosthetics', 'Removable Prosthetics', 'Implantology', 'Orthodontics', 'Temporaries', 'Other'];
const CATEGORY_COLOR: Record<string, string> = CATEGORY_COLORS;

/* ── View toggle ─────────────────────────────────────────────── */
type ViewMode = 'grid' | 'list';

export default function Index({ auth, services }: Props) {
    const { t } = useTranslation();
    const [search, setSearch]           = useState('');
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [view, setView]               = useState<ViewMode>('grid');
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

    const deleteService = () => {
        if (deleteTarget !== null)
            router.delete(route('lab.services.destroy', deleteTarget), { onFinish: () => setDeleteTarget(null) });
    };

    /* Filter + Search */
    const filtered = services.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.description ?? '').toLowerCase().includes(search.toLowerCase());
        const matchActive = filterActive === 'all' || (filterActive === 'active' ? s.is_active : !s.is_active);
        return matchSearch && matchActive;
    });

    /* Group by REAL category from DB */
    const grouped: Record<string, Service[]> = {};
    for (const s of filtered) {
        const cat = s.category || 'Fixed Prosthetics';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(s);
    }
    const sortedCats = CATEGORY_ORDER.filter(c => grouped[c]);
    // Also add any uncategorized or dynamic
    Object.keys(grouped).forEach(c => { if (!CATEGORY_ORDER.includes(c)) sortedCats.push(c); });

    const isOwner = auth.user.role === 'lab_owner';

    return (
        <LabLayout>
            <Head title={t('Service Catalog')} />
            <div className="flex flex-col gap-5">

                {/* ── Header ─────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-[20px] font-bold" style={{ color: 'var(--txt-1)' }}>
                            {t('Service Catalog')}
                        </h2>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {filtered.length} {t('services')}
                        </p>
                    </div>
                    {isOwner && (
                        <Link href={route('lab.services.create')} className="btn-primary shrink-0">
                            <Plus size={13} /> {t('Add Service')}
                        </Link>
                    )}
                </div>

                {/* ── Toolbar ────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--txt-3)' }} />
                        <input type="text" placeholder={t('Search services...')}
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="app-input pl-8" />
                    </div>

                    {/* Active filter pills */}
                    <div className="flex items-center gap-1.5 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        {(['all','active','inactive'] as const).map(f => (
                            <button key={f}
                                onClick={() => setFilterActive(f)}
                                className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors"
                                style={filterActive === f
                                    ? { background: 'var(--bg-raised)', color: 'var(--txt-1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
                                    : { color: 'var(--txt-3)' }}>
                                {t(f.charAt(0).toUpperCase() + f.slice(1))}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <button onClick={() => setView('grid')}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ background: view === 'grid' ? 'var(--bg-raised)' : 'transparent', color: view === 'grid' ? 'var(--txt-accent)' : 'var(--txt-3)' }}
                            title="Grid view">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
                                <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
                                <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
                                <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
                            </svg>
                        </button>
                        <button onClick={() => setView('list')}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ background: view === 'list' ? 'var(--bg-raised)' : 'transparent', color: view === 'list' ? 'var(--txt-accent)' : 'var(--txt-3)' }}
                            title="List view">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="0" y="1" width="14" height="2" rx="1" fill="currentColor"/>
                                <rect x="0" y="6" width="14" height="2" rx="1" fill="currentColor"/>
                                <rect x="0" y="11" width="14" height="2" rx="1" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Content ────────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="card py-20 text-center" style={{ color: 'var(--txt-3)' }}>
                        <Package size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[14px] font-semibold" style={{ color: 'var(--txt-2)' }}>{t('No services found')}</p>
                        <p className="text-[12px] mt-1">{t('Try adjusting your search or filters')}</p>
                        {search && (
                            <button onClick={() => setSearch('')}
                                className="mt-3 flex items-center gap-1.5 mx-auto text-[12px] font-medium transition-colors"
                                style={{ color: 'var(--txt-accent)' }}>
                                <X size={12} /> {t('Clear search')}
                            </button>
                        )}
                    </div>
                ) : view === 'grid' ? (

                    /* ═══════════════ GRID VIEW ═══════════════ */
                    <div className="flex flex-col gap-6">
                        {sortedCats.map(cat => {
                            const color = CATEGORY_COLOR[cat] ?? '#60ddc6';
                            return (
                                <div key={cat}>
                                    {/* Category header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                                        <p className="text-[11px] font-black tracking-[0.1em] uppercase"
                                            style={{ color: 'var(--txt-3)' }}>
                                            {t(cat)}
                                        </p>
                                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                                            style={{ background: `${color}15`, color }}>
                                            {grouped[cat].length}
                                        </span>
                                    </div>

                                    {/* Cards grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {grouped[cat].map(service => (
                                            <ServiceCard key={service.id} service={service}
                                                catColor={color} isOwner={isOwner}
                                                onDelete={() => setDeleteTarget(service.id)} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                ) : (

                    /* ═══════════════ LIST VIEW ═══════════════ */
                    <div className="card overflow-hidden">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('Service')}</th>
                                    <th>{t('Category')}</th>
                                    <th>{t('Price')}</th>
                                    <th>{t('Turnaround')}</th>
                                    <th>{t('Status')}</th>
                                    {isOwner && <th className="w-20" />}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(service => {
                                    const cat = service.category || 'Fixed Prosthetics';
                                    const color = CATEGORY_COLOR[cat] ?? '#60ddc6';
                                    const img = service.image_url ?? CATEGORY_FALLBACK_IMG[cat] ?? '/images/services/crown.png';
                                    return (
                                        <tr key={service.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0"
                                                        style={{ background: 'var(--surface)' }}>
                                                        <img src={img}
                                                            className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                                            {service.name}
                                                        </p>
                                                        {service.description && (
                                                            <p className="text-[11px] line-clamp-1 max-w-[240px]" style={{ color: 'var(--txt-3)' }}>
                                                                {service.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-[11.5px] font-semibold"
                                                    style={{ color }}>{t(cat)}</span>
                                            </td>
                                            <td>
                                                <span className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                                    {parseFloat(service.price).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
                                                    <span className="text-[10.5px] font-normal ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={11} style={{ color: 'var(--txt-3)' }} />
                                                    <span className="text-[12.5px]" style={{ color: 'var(--txt-2)' }}>
                                                        {service.production_days} {t('days')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="status-pill"
                                                    style={service.is_active
                                                        ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', borderColor: 'transparent' }
                                                        : { background: 'var(--surface)', color: 'var(--txt-3)', borderColor: 'transparent' }}>
                                                    <span className="dot" style={{ background: service.is_active ? '#34d399' : 'var(--txt-3)' }} />
                                                    {service.is_active ? t('Active') : t('Inactive')}
                                                </span>
                                            </td>
                                            {isOwner && (
                                                <td>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={route('lab.services.edit', service.id)}
                                                            className="p-1.5 rounded-md transition-colors"
                                                            style={{ color: 'var(--txt-3)' }}
                                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--txt-accent)')}
                                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
                                                            <Edit size={13} />
                                                        </Link>
                                                        <button onClick={() => setDeleteTarget(service.id)}
                                                            className="p-1.5 rounded-md transition-colors"
                                                            style={{ color: 'var(--txt-3)' }}
                                                            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
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

/* ────────────────────────────────────────────────────── */
/* Service Card component                                 */
/* ────────────────────────────────────────────────────── */
function ServiceCard({ service, catColor, isOwner, onDelete }: {
    service: Service; catColor: string; isOwner: boolean; onDelete: () => void;
}) {
    const img = service.image_url ?? CATEGORY_FALLBACK_IMG[service.category] ?? '/images/services/crown.png';

    return (
        <div className="group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200"
            style={{
                background: 'var(--bg-raised)',
                borderColor: 'var(--border)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = catColor + '55')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

            {/* ── Image area ── */}
            <div className="relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #1e1a2e, #13111d)', height: 160 }}>

                {/* Category color accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: catColor }} />

                {/* Status badge */}
                <div className="absolute top-2 right-2 z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={service.is_active
                            ? { background: 'rgba(52,211,153,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
                            : { background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                        {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Product image */}
                <img src={img} alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            </div>

            {/* ── Card body ── */}
            <div className="flex flex-col flex-1 p-3 gap-2">
                {/* Name */}
                <p className="text-[13px] font-bold leading-tight line-clamp-2" style={{ color: 'var(--txt-1)' }}>
                    {service.name}
                </p>

                {/* Price + Days row */}
                <div className="flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[15px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>
                            {parseFloat(service.price).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
                            <span className="text-[10px] font-semibold ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Clock size={10} style={{ color: catColor }} />
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--txt-2)' }}>
                            {service.production_days} Days
                        </span>
                    </div>
                </div>

                {/* Accent line */}
                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${catColor}60, transparent)` }} />

                {/* Description / material */}
                {service.description ? (
                    <p className="text-[10.5px] line-clamp-1" style={{ color: 'var(--txt-3)' }}>
                        {service.description}
                    </p>
                ) : (
                    <p className="text-[10.5px]" style={{ color: 'var(--txt-3)' }}>—</p>
                )}
            </div>

            {/* ── Actions footer ── */}
            {isOwner && (
                <div className="flex items-center justify-end gap-1 px-3 pb-3">
                    <Link href={route('lab.services.edit', service.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors"
                        style={{ color: 'var(--txt-3)', background: 'var(--surface)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; }}>
                        <Edit size={11} /> Edit
                    </Link>
                    <button onClick={onDelete}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors"
                        style={{ color: 'var(--txt-3)', background: 'var(--surface)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.background = 'var(--surface)'; }}>
                        <Trash2 size={11} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}
