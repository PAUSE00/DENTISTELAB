import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
 Plus, Search, Edit, Trash2, Package,
 Clock, X, ChevronRight, Sparkles
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface Service {
 id: number; name: string; description: string | null;
 price: string; production_days: number; is_active: boolean;
 category: string; image_url: string | null;
}
interface Props extends PageProps { services: Service[]; categories: string[]; }

/* ── Category → color/gradient map ─────────────────────────── */
const CAT_META: Record<string, { color: string; glow: string; bg: string }> = {
 'Fixed Prosthetics': { color: '#60ddc6', glow: 'rgba(96,221,198,0.3)', bg: 'rgba(96,221,198,0.06)' },
 'Removable Prosthetics': { color: '#818cf8', glow: 'rgba(129,140,248,0.3)', bg: 'rgba(129,140,248,0.06)' },
 'Implantology': { color: '#c084fc', glow: 'rgba(192,132,252,0.3)', bg: 'rgba(192,132,252,0.06)' },
 'Orthodontics': { color: '#34d399', glow: 'rgba(52,211,153,0.3)', bg: 'rgba(52,211,153,0.06)' },
 'Temporaries': { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.06)' },
 'Other': { color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', bg: 'rgba(148,163,184,0.06)' },
};

const FALLBACK_IMG: Record<string, string> = {
 'Fixed Prosthetics': '/images/services/crown.png',
 'Removable Prosthetics': '/images/services/denture.png',
 'Implantology': '/images/services/implant.png',
 'Orthodontics': '/images/services/aligner.png',
 'Temporaries': '/images/services/crown.png',
 'Other': '/images/services/inlay.png',
};

const getCatMeta = (cat: string) => CAT_META[cat] ?? { color: '#60ddc6', glow: 'rgba(96,221,198,0.3)', bg: 'rgba(96,221,198,0.06)' };

const CATEGORY_ORDER = ['Fixed Prosthetics', 'Removable Prosthetics', 'Implantology', 'Orthodontics', 'Temporaries', 'Other'];

type ViewMode = 'grid' | 'list';

export default function Index({ auth, services }: Props) {
 const { t } = useTranslation();
 const [search, setSearch] = useState('');
 const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
 const [view, setView] = useState<ViewMode>('grid');
 const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

 const deleteService = () => {
 if (deleteTarget !== null)
 router.delete(route('lab.services.destroy', deleteTarget), { onFinish: () => setDeleteTarget(null) });
 };

 const filtered = services.filter(s => {
 const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
 (s.description ?? '').toLowerCase().includes(search.toLowerCase());
 const matchActive = activeFilter === 'all' || (activeFilter === 'active' ? s.is_active : !s.is_active);
 return matchSearch && matchActive;
 });

 const grouped: Record<string, Service[]> = {};
 for (const s of filtered) {
 const cat = s.category || 'Fixed Prosthetics';
 if (!grouped[cat]) grouped[cat] = [];
 grouped[cat].push(s);
 }
 const sortedCats = CATEGORY_ORDER.filter(c => grouped[c]);
 Object.keys(grouped).forEach(c => { if (!CATEGORY_ORDER.includes(c)) sortedCats.push(c); });

 const isOwner = auth.user.role === 'lab_owner';

 return (
 <LabLayout>
 <Head title={t('Service Catalog')} />
 <div className="flex flex-col gap-6">

 {/* ── Hero Header ──────────────────────────────────────── */}
 <div className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-4"
 style={{ background: 'linear-gradient(135deg, rgba(96,221,198,0.08) 0%, rgba(129,140,248,0.06) 50%, rgba(192,132,252,0.04) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
 {/* Ambient orb */}
 <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
 style={{ background: 'radial-gradient(circle, #60ddc6, transparent)', filter: 'blur(40px)' }} />

 <div className="relative z-10">
 <div className="flex items-center gap-2 mb-1">
 <Sparkles size={13} style={{ color: '#60ddc6' }} />
 <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: '#60ddc6' }}>
 {t('Service Catalog')}
 </span>
 </div>
 <h1 className="text-[26px] font-extrabold tracking-tight leading-none" style={{ color: 'var(--txt-1)' }}>
 {t('Our Services')}
 </h1>
 <p className="text-[12px] mt-1.5" style={{ color: 'var(--txt-3)' }}>
 {filtered.length} {t('services')} · {sortedCats.length} {t('categories')}
 </p>
 </div>

 {isOwner && (
 <Link href={route('lab.services.create')} className="btn-primary shrink-0 relative z-10">
 <Plus size={14} /> {t('Add Service')}
 </Link>
 )}
 </div>

 {/* ── Toolbar ──────────────────────────────────────────── */}
 <div className="flex flex-wrap items-center gap-3">
 {/* Search */}
 <div className="relative min-w-[240px] flex-1 max-w-sm">
 <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
 style={{ color: 'var(--txt-3)' }} />
 <input type="text" placeholder={t('Search services...')}
 value={search} onChange={e => setSearch(e.target.value)}
 className="app-input pl-9 rounded-xl" />
 {search && (
 <button onClick={() => setSearch('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
 style={{ color: 'var(--txt-3)' }}>
 <X size={12} />
 </button>
 )}
 </div>

 {/* Active filter pills */}
 <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
 {(['all', 'active', 'inactive'] as const).map(f => (
 <button key={f} onClick={() => setActiveFilter(f)}
 className="px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all duration-200"
 style={activeFilter === f
 ? { background: 'rgba(96,221,198,0.12)', color: '#60ddc6', border: '1px solid rgba(96,221,198,0.2)' }
 : { color: 'var(--txt-3)', border: '1px solid transparent' }}>
 {t(f.charAt(0).toUpperCase() + f.slice(1))}
 </button>
 ))}
 </div>

 {/* View toggle */}
 <div className="ml-auto flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
 {/* Grid */}
 <button onClick={() => setView('grid')} title="Grid view"
 className="p-2 rounded-lg transition-all duration-200"
 style={view === 'grid'
 ? { background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }
 : { color: 'var(--txt-3)' }}>
 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
 <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
 <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
 <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
 <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
 </svg>
 </button>
 {/* List */}
 <button onClick={() => setView('list')} title="List view"
 className="p-2 rounded-lg transition-all duration-200"
 style={view === 'list'
 ? { background: 'rgba(96,221,198,0.1)', color: '#60ddc6' }
 : { color: 'var(--txt-3)' }}>
 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
 <rect x="0" y="1" width="14" height="2" rx="1" fill="currentColor"/>
 <rect x="0" y="6" width="14" height="2" rx="1" fill="currentColor"/>
 <rect x="0" y="11" width="14" height="2" rx="1" fill="currentColor"/>
 </svg>
 </button>
 </div>
 </div>

 {/* ── Content ──────────────────────────────────────────── */}
 {filtered.length === 0 ? (

 /* Empty state */
 <div className="flex flex-col items-center justify-center py-24 rounded-2xl" style={{ border: '1px dashed var(--border-strong)' }}>
 <div className="relative mb-5">
 <Package size={44} style={{ color: 'var(--txt-3)', opacity: 0.4 }} />
 <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: '#60ddc6' }} />
 </div>
 <p className="text-[15px] font-bold" style={{ color: 'var(--txt-2)' }}>{t('No services found')}</p>
 <p className="text-[12px] mt-1.5" style={{ color: 'var(--txt-3)' }}>{t('Try adjusting your search or filters')}</p>
 {search && (
 <button onClick={() => setSearch('')}
 className="mt-4 btn-primary">
 <X size={12} /> {t('Clear search')}
 </button>
 )}
 </div>

 ) : view === 'grid' ? (

 /* ═══════════════ GRID VIEW ═══════════════ */
 <div className="flex flex-col gap-8">
 {sortedCats.map((cat, catIdx) => {
 const meta = getCatMeta(cat);
 return (
 <div key={cat} className="animate-fade-up" style={{ animationDelay: `${catIdx * 80}ms` }}>
 {/* Category header */}
 <div className="flex items-center gap-3 mb-4">
 <div className="flex items-center gap-2.5">
 <span className="w-3 h-3 rounded-full shrink-0 shadow-lg"
 style={{ background: meta.color, boxShadow: `0 0 10px ${meta.glow}` }} />
 <p className="text-[12px] font-black tracking-[0.12em] uppercase"
 style={{ color: meta.color }}>
 {t(cat)}
 </p>
 </div>
 <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${meta.color}40, transparent)` }} />
 <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
 style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
 {grouped[cat].length}
 </span>
 </div>

 {/* Cards grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
 {grouped[cat].map((service, i) => (
 <ServiceCard key={service.id} service={service}
 meta={meta} isOwner={isOwner}
 animDelay={catIdx * 80 + i * 50}
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
 const meta = getCatMeta(cat);
 const img = service.image_url ?? FALLBACK_IMG[cat] ?? '/images/services/crown.png';
 return (
 <tr key={service.id}>
 <td>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
 style={{ background: 'var(--surface)', border: `1px solid ${meta.color}30` }}>
 <img src={img} className="w-full h-full object-cover" alt=""
 onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
 </div>
 <div>
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {service.name}
 </p>
 {service.description && (
 <p className="text-[11px] line-clamp-1 max-w-[200px]" style={{ color: 'var(--txt-3)' }}>
 {service.description}
 </p>
 )}
 </div>
 </div>
 </td>
 <td>
 <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-lg"
 style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}25` }}>
 {t(cat)}
 </span>
 </td>
 <td>
 <span className="text-[14px] font-black" style={{ color: 'var(--txt-1)' }}>
 {parseFloat(service.price).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
 <span className="text-[10px] font-semibold ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
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
 ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', borderColor: 'rgba(52,211,153,0.25)' }
 : { background: 'var(--surface)', color: 'var(--txt-3)', borderColor: 'transparent' }}>
 <span className="dot" style={{ background: service.is_active ? '#34d399' : 'var(--txt-3)' }} />
 {service.is_active ? t('Active') : t('Inactive')}
 </span>
 </td>
 {isOwner && (
 <td>
 <div className="flex items-center justify-end gap-1">
 <Link href={route('lab.services.edit', service.id)}
 className="p-1.5 rounded-lg transition-all duration-200"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => { e.currentTarget.style.color = '#60ddc6'; e.currentTarget.style.background = 'rgba(96,221,198,0.08)'; }}
 onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.background = 'transparent'; }}>
 <Edit size={13} />
 </Link>
 <button onClick={() => setDeleteTarget(service.id)}
 className="p-1.5 rounded-lg transition-all duration-200"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
 onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.background = 'transparent'; }}>
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
/* Premium Service Card with lens-flare & depth */
/* ────────────────────────────────────────────────────── */
function ServiceCard({ service, meta, isOwner, animDelay, onDelete }: {
 service: Service;
 meta: { color: string; glow: string; bg: string };
 isOwner: boolean;
 animDelay: number;
 onDelete: () => void;
}) {
 const img = service.image_url ?? FALLBACK_IMG[service.category] ?? '/images/services/crown.png';
 const cardRef = useRef<HTMLDivElement>(null);

 const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
 const rect = cardRef.current?.getBoundingClientRect();
 if (!rect) return;
 const x = ((e.clientX - rect.left) / rect.width) * 100;
 const y = ((e.clientY - rect.top) / rect.height) * 100;
 cardRef.current!.style.setProperty('--mx', `${x}%`);
 cardRef.current!.style.setProperty('--my', `${y}%`);
 }, []);

 return (
 <div ref={cardRef}
 className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 animate-fade-up"
 style={{
 background: 'var(--bg-raised)',
 border: `1px solid rgba(255,255,255,0.05)`,
 animationDelay: `${animDelay}ms`,
 }}
 onMouseMove={handleMouseMove}
 onMouseEnter={e => {
 e.currentTarget.style.transform = 'translateY(-6px)';
 e.currentTarget.style.borderColor = `${meta.color}40`;
 e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${meta.glow}`;
 }}
 onMouseLeave={e => {
 e.currentTarget.style.transform = 'translateY(0)';
 e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
 e.currentTarget.style.boxShadow = 'none';
 }}>

 {/* Lens-flare overlay — follows mouse */}
 <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
 style={{
 background: `radial-gradient(circle 120px at var(--mx, 50%) var(--my, 50%), ${meta.color}12, transparent 70%)`,
 }} />

 {/* ── Image area ── */}
 <div className="relative overflow-hidden" style={{ height: 180 }}>
 {/* Category bar */}
 <div className="absolute top-0 left-0 right-0 h-0.5 z-10"
 style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}00)` }} />

 {/* Dark gradient bottom fade */}
 <div className="absolute inset-x-0 bottom-0 h-2/3 z-10 pointer-events-none"
 style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-raised))' }} />

 {/* Status badge */}
 <div className="absolute top-2.5 right-2.5 z-20">
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
 style={service.is_active
 ? { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
 : { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
 {service.is_active ? 'Active' : 'Inactive'}
 </span>
 </div>

 {/* Image */}
 <img src={img} alt={service.name}
 className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
 style={{ objectPosition: 'center' }}
 onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />

 {/* Background for when image fails */}
 <div className="absolute inset-0 -z-10 flex items-center justify-center"
 style={{ background: `linear-gradient(135deg, #1a1728, #231f35)` }}>
 <Package size={32} style={{ color: meta.color, opacity: 0.3 }} />
 </div>
 </div>

 {/* ── Card body ── */}
 <div className="relative z-10 flex flex-col flex-1 px-3.5 pt-2 pb-3 gap-2.5">
 {/* Name */}
 <p className="text-[13.5px] font-extrabold leading-snug" style={{ color: 'var(--txt-1)' }}>
 {service.name}
 </p>

 {/* Category micro-tag */}
 <span className="self-start text-[9.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
 style={{ background: meta.bg, color: meta.color }}>
 {service.category}
 </span>

 {/* Description */}
 {service.description && (
 <p className="text-[11px] line-clamp-2 flex-1" style={{ color: 'var(--txt-3)' }}>
 {service.description}
 </p>
 )}

 {/* Divider */}
 <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${meta.color}40, transparent)` }} />

 {/* Price + Days */}
 <div className="flex items-end justify-between gap-2">
 <div>
 <p className="text-[17px] font-black leading-none tabular-nums" style={{ color: 'var(--txt-1)' }}>
 {parseFloat(service.price).toLocaleString('fr-MA', { minimumFractionDigits: 2 })}
 <span className="text-[10px] font-semibold ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
 </p>
 </div>
 <div className="flex items-center gap-1 shrink-0 mb-px">
 <Clock size={10} style={{ color: meta.color }} />
 <span className="text-[11.5px] font-bold" style={{ color: 'var(--txt-2)' }}>
 {service.production_days}d
 </span>
 </div>
 </div>

 {/* Owner actions */}
 {isOwner && (
 <div className="flex items-center gap-1.5 pt-1">
 <Link href={route('lab.services.edit', service.id)}
 className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200"
 style={{ background: 'rgba(96,221,198,0.06)', color: '#60ddc6', border: '1px solid rgba(96,221,198,0.15)' }}
 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,221,198,0.14)'; }}
 onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,221,198,0.06)'; }}>
 <Edit size={11} /> Edit
 </Link>
 <button onClick={onDelete}
 className="p-1.5 rounded-xl transition-all duration-200"
 style={{ color: 'var(--txt-3)', background: 'var(--surface)' }}
 onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
 onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-3)'; e.currentTarget.style.background = 'var(--surface)'; }}>
 <Trash2 size={13} />
 </button>
 </div>
 )}
 </div>
 </div>
 );
}
