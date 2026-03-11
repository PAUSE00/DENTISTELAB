import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import {
    Package, DollarSign, Clock, ChevronLeft, Save,
    Eye, AlertCircle, ToggleLeft, ToggleRight,
    Upload, X, ImageIcon, Tag, CheckCircle2, Info
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

/* ════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════ */
const CATEGORY_COLORS: Record<string, string> = {
    'Fixed Prosthetics':    '#60ddc6',
    'Removable Prosthetics':'#818cf8',
    'Implantology':         '#c084fc',
    'Orthodontics':         '#34d399',
    'Temporaries':          '#f59e0b',
    'Other':                '#94a3b8',
};
const CATEGORY_IMAGES: Record<string, string> = {
    'Fixed Prosthetics':    '/images/services/crown.png',
    'Removable Prosthetics':'/images/services/denture.png',
    'Implantology':         '/images/services/implant.png',
    'Orthodontics':         '/images/services/aligner.png',
    'Temporaries':          '/images/services/crown.png',
    'Other':                '/images/services/inlay.png',
};
const CATEGORY_ICONS: Record<string, string> = {
    'Fixed Prosthetics':    '🦷',
    'Removable Prosthetics':'🪥',
    'Implantology':         '🔩',
    'Orthodontics':         '😁',
    'Temporaries':          '⏱',
    'Other':                '📦',
};

/* ════════════════════════════════════════════════════
   SMALL SHARED COMPONENTS
════════════════════════════════════════════════════ */
function SectionHeader({ icon, label, sub, color = 'var(--txt-accent)' }: {
    icon: React.ReactNode; label: string; sub?: string; color?: string;
}) {
    return (
        <div className="flex items-center gap-3 pb-4 mb-1 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}18`, color }}>
                {icon}
            </div>
            <div>
                <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{label}</p>
                {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{sub}</p>}
            </div>
        </div>
    );
}

function Field({ label, error, children, hint }: {
    label: string; error?: string; children: React.ReactNode; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--txt-2)' }}>{label}</label>
            {children}
            {hint && !error && <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{hint}</p>}
            {error && (
                <div className="flex items-center gap-1.5">
                    <AlertCircle size={10} style={{ color: '#f87171' }} />
                    <p className="text-[11px]" style={{ color: '#f87171' }}>{error}</p>
                </div>
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════════
   IMAGE UPLOAD ZONE
════════════════════════════════════════════════════ */
function ImageUploadZone({ preview, onFile, onRemove }: {
    preview: string | null; onFile: (f: File) => void; onRemove: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) onFile(f);
    };

    return preview ? (
        <div className="relative rounded-xl overflow-hidden group"
            style={{ height: 200, background: 'linear-gradient(145deg,#1e1a2e,#13111d)' }}>
            <img src={preview} alt="Preview" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Upload size={11} /> Change
                </button>
                <button type="button" onClick={onRemove}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold"
                    style={{ background: 'rgba(248,113,113,0.2)', backdropFilter: 'blur(8px)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.3)' }}>
                    <X size={11} /> Remove
                </button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
    ) : (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
            style={{
                height: 200,
                borderColor: dragging ? 'var(--txt-accent)' : 'var(--border-strong)',
                background: dragging ? 'var(--teal-10)' : 'var(--surface)',
            }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>
                <ImageIcon size={20} />
            </div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                {dragging ? 'Drop image here' : 'Upload service photo'}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--txt-3)' }}>
                Drag & drop or click to browse
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                JPG, PNG, WebP · max 4 MB
            </p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
    );
}

/* ════════════════════════════════════════════════════
   CATEGORY SELECTOR — 2-col pill grid
════════════════════════════════════════════════════ */
function CategorySelector({ categories, selected, onSelect }: {
    categories: string[]; selected: string; onSelect: (c: string) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => {
                const color = CATEGORY_COLORS[cat] ?? '#94a3b8';
                const active = selected === cat;
                return (
                    <button type="button" key={cat} onClick={() => onSelect(cat)}
                        className="flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all duration-150"
                        style={active
                            ? { background: `${color}12`, borderColor: `${color}60`, boxShadow: `0 0 0 1px ${color}30` }
                            : { background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <span className="text-[18px] leading-none shrink-0">{CATEGORY_ICONS[cat] ?? '📦'}</span>
                        <span className="text-[12px] font-semibold truncate"
                            style={{ color: active ? color : 'var(--txt-2)' }}>
                            {cat}
                        </span>
                        {active && (
                            <CheckCircle2 size={13} className="ml-auto shrink-0" style={{ color }} />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/* ════════════════════════════════════════════════════
   RICH RIGHT PANEL — full-width live preview
════════════════════════════════════════════════════ */
function RightPanel({ name, price, days, isActive, category, imagePreview, description }: {
    name: string; price: string; days: string; isActive: boolean;
    category: string; imagePreview: string | null; description: string;
}) {
    const color    = CATEGORY_COLORS[category] ?? '#60ddc6';
    const img      = imagePreview ?? CATEGORY_IMAGES[category] ?? '/images/services/crown.png';
    const priceNum = parseFloat(price) || 0;
    const daysNum  = parseInt(days)    || 1;

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Eye size={13} style={{ color: 'var(--txt-3)' }} />
                <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>
                    Live Preview
                </p>
            </div>

            {/* ── Grid Card Preview ── */}
            <div>
                <p className="text-[10.5px] font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>
                    Grid view
                </p>
                <div className="rounded-2xl overflow-hidden border w-full"
                    style={{ background: 'var(--bg-raised)', borderColor: `${color}40` }}>
                    {/* Image area */}
                    <div className="relative overflow-hidden w-full"
                        style={{ background: 'linear-gradient(145deg,#1d1829,#12101c)', height: 200 }}>
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />
                        {/* Status badge */}
                        <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={isActive
                                ? { background: 'rgba(52,211,153,0.18)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)', backdropFilter: 'blur(4px)' }
                                : { background: 'rgba(248,113,113,0.18)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)', backdropFilter: 'blur(4px)' }}>
                            {isActive ? '● Active' : '○ Inactive'}
                        </span>
                        {/* Category emoji */}
                        <span className="absolute top-3 left-3 text-[18px]">
                            {CATEGORY_ICONS[category] ?? '🦷'}
                        </span>
                        <img src={img} alt="" className="w-full h-full object-contain"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
                    </div>
                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-2.5">
                        <p className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>
                            {name || <span style={{ color: 'var(--txt-3)' }}>Service Name</span>}
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="text-[18px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>
                                {priceNum > 0 ? priceNum.toLocaleString('fr-MA', { minimumFractionDigits: 2 }) : '0.00'}
                                <span className="text-[11px] font-medium ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
                            </p>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                                style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                                <Clock size={11} style={{ color }} />
                                <span className="text-[12px] font-bold" style={{ color }}>
                                    {daysNum} Days
                                </span>
                            </div>
                        </div>
                        <div className="h-px" style={{ background: `linear-gradient(90deg,${color}70,transparent)` }} />
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold" style={{ color }}>{category}</span>
                            {description && (
                                <span className="text-[11px] truncate max-w-[160px]" style={{ color: 'var(--txt-3)' }}>
                                    {description}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── List Row Preview ── */}
            <div>
                <p className="text-[10.5px] font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>
                    List view row
                </p>
                <div className="rounded-xl border px-4 py-3 flex items-center gap-3"
                    style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                        style={{ background: 'linear-gradient(145deg,#1d1829,#12101c)' }}>
                        <img src={img} alt="" className="w-full h-full object-contain"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--txt-1)' }}>
                            {name || 'Service Name'}
                        </p>
                        <p className="text-[11px] truncate" style={{ color }}>{category}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                            {priceNum > 0 ? priceNum.toLocaleString('fr-MA', { minimumFractionDigits: 2 }) : '—'}
                            <span className="text-[10px] ml-1" style={{ color: 'var(--txt-3)' }}>MAD</span>
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{daysNum} days</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={isActive
                            ? { background: 'rgba(52,211,153,0.12)', color: '#34d399' }
                            : { background: 'var(--surface)', color: 'var(--txt-3)' }}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* ── Tips ── */}
            <div className="rounded-xl border p-4 flex flex-col gap-3"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                    <Info size={13} style={{ color: 'var(--txt-accent)' }} />
                    <p className="text-[11.5px] font-bold" style={{ color: 'var(--txt-2)' }}>Tips</p>
                </div>
                {[
                    'Upload a real product photo for best catalog appearance.',
                    'Use the exact service name as it will appear on invoices.',
                    'Production days are shown to clinics as estimated delivery.',
                ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-px"
                            style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>{i + 1}</span>
                        <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   FORM DATA & PROPS
════════════════════════════════════════════════════ */
interface ServiceFormData {
    name: string; description: string; price: string;
    production_days: string; is_active: boolean;
    category: string; image: File | null; remove_image: boolean;
}
interface ServiceFormProps {
    mode: 'create' | 'edit';
    categories: string[];
    initialValues?: Partial<ServiceFormData> & { image_url?: string };
    onSubmit: (data: ServiceFormData, go: () => void) => void;
    processing: boolean;
    errors: Partial<Record<keyof ServiceFormData, string>>;
    serviceId?: number;
}

/* ════════════════════════════════════════════════════
   MAIN LAYOUT
════════════════════════════════════════════════════ */
function ServiceFormLayout({ mode, categories, initialValues, onSubmit, processing, errors }: ServiceFormProps) {
    const { t } = useTranslation();
    const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

    const [form, setForm] = useState<ServiceFormData>({
        name:            initialValues?.name            ?? '',
        description:     initialValues?.description     ?? '',
        price:           initialValues?.price           ?? '',
        production_days: initialValues?.production_days ?? '7',
        is_active:       initialValues?.is_active       ?? true,
        category:        initialValues?.category        ?? 'Fixed Prosthetics',
        image:           null,
        remove_image:    false,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialValues?.image_url ?? null
    );
    const set = <K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) =>
        setForm(prev => ({ ...prev, [k]: v }));

    const handleFile = (f: File) => {
        set('image', f); set('remove_image', false);
        setImagePreview(URL.createObjectURL(f));
    };
    const handleRemoveImage = () => {
        set('image', null); set('remove_image', true);
        setImagePreview(null);
    };
    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        onSubmit(form, () => router.visit(route('lab.services.index')));
    };

    const accentColor = CATEGORY_COLORS[form.category] ?? '#60ddc6';

    return (
        /* Remove max-w so it fills the full content area */
        <div className="flex flex-col gap-4">

            {/* ── Page header ────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={route('lab.services.index')}
                        className="btn-ghost w-8 h-8 !p-0 flex items-center justify-center">
                        <ChevronLeft size={16} />
                    </Link>
                    <div>
                        <h2 className="text-[18px] font-bold" style={{ color: 'var(--txt-1)' }}>
                            {mode === 'create' ? t('Add New Service') : t('Edit Service')}
                        </h2>
                        <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>
                            {mode === 'create' ? t('Add a new service to your catalog') : form.name}
                        </p>
                    </div>
                </div>
                {/* Mobile tab pills */}
                <div className="flex lg:hidden gap-1 p-1 rounded-lg"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {(['form', 'preview'] as const).map(tab => (
                        <button key={tab} type="button" onClick={() => setMobileTab(tab)}
                            className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors"
                            style={mobileTab === tab
                                ? { background: 'var(--bg-raised)', color: 'var(--txt-1)' }
                                : { color: 'var(--txt-3)' }}>
                            {tab === 'form' ? 'Form' : 'Preview'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Two-column body: 3fr / 2fr ──────────────── */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5" style={{ alignItems: 'start' }}>

                    {/* ══ LEFT — 3 columns ══ */}
                    <div className={`lg:col-span-3 flex flex-col gap-4 ${mobileTab === 'preview' ? 'hidden lg:flex' : ''}`}>

                        {/* Image */}
                        <div className="card p-5">
                            <SectionHeader icon={<ImageIcon size={15} />} label={t('Service Image')}
                                sub={t('Optional — JPG, PNG, WebP up to 4 MB')} color={accentColor} />
                            <ImageUploadZone preview={imagePreview} onFile={handleFile} onRemove={handleRemoveImage} />
                        </div>

                        {/* Category */}
                        <div className="card p-5">
                            <SectionHeader icon={<Tag size={15} />} label={t('Category')}
                                sub={t('Choose how this service will be grouped in the catalog')} color="#818cf8" />
                            <CategorySelector categories={categories} selected={form.category}
                                onSelect={c => set('category', c)} />
                            {errors.category && (
                                <p className="text-[11px] mt-2" style={{ color: '#f87171' }}>{errors.category}</p>
                            )}
                        </div>

                        {/* Details */}
                        <div className="card p-5 flex flex-col gap-4">
                            <SectionHeader icon={<Package size={15} />} label={t('Service Details')}
                                sub={t('Name and description visible on orders and invoices')} color={accentColor} />
                            <Field label={t('Service Name')} error={errors.name}>
                                <input type="text" className="app-input" autoFocus
                                    placeholder="e.g. Couronne Zircone"
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)} />
                            </Field>
                            <Field label={t('Description / Material')} error={errors.description}
                                hint={t('Material, technique, clinical notes for clinics')}>
                                <textarea className="app-input resize-none" rows={4}
                                    placeholder="e.g. Full contour zirconia, BruxZir grade, shade matching available..."
                                    value={form.description}
                                    onChange={e => set('description', e.target.value)} />
                            </Field>
                        </div>

                        {/* Pricing */}
                        <div className="card p-5 flex flex-col gap-4">
                            <SectionHeader icon={<DollarSign size={15} />} label={t('Pricing & Timing')}
                                sub={t('Cost and turnaround time shown to clinics on new orders')} color="#34d399" />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label={t('Price (MAD)')} error={errors.price}>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold"
                                            style={{ color: 'var(--txt-3)' }}>MAD</span>
                                        <input type="number" step="0.01" min="0" className="app-input pl-12"
                                            placeholder="0.00" value={form.price}
                                            onChange={e => set('price', e.target.value)} />
                                    </div>
                                </Field>
                                <Field label={t('Production Days')} error={errors.production_days}>
                                    <div className="relative">
                                        <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                                            style={{ color: 'var(--txt-3)' }} />
                                        <input type="number" min="1" className="app-input pl-9"
                                            placeholder="7" value={form.production_days}
                                            onChange={e => set('production_days', e.target.value)} />
                                    </div>
                                </Field>
                            </div>
                            {parseInt(form.production_days) > 0 && parseFloat(form.price) > 0 && (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                                    style={{ background: `${accentColor}0d`, border: `1px solid ${accentColor}25` }}>
                                    <Clock size={12} style={{ color: accentColor }} />
                                    <span className="text-[12px]" style={{ color: accentColor }}>
                                        {t('Clinics will be quoted')}{' '}
                                        <strong>{parseInt(form.production_days)} {t('business days')}</strong>
                                        {' '}{t('at')}{' '}
                                        <strong>{(parseFloat(form.price) || 0).toFixed(2)} MAD</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="card p-4">
                            <button type="button" onClick={() => set('is_active', !form.is_active)}
                                className="w-full flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                    style={form.is_active
                                        ? { background: 'rgba(52,211,153,0.12)', color: '#34d399' }
                                        : { background: 'var(--surface)', color: 'var(--txt-3)' }}>
                                    {form.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                        {t('Service Status')}
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                        {form.is_active
                                            ? t('Visible to clinics — available for new orders')
                                            : t('Hidden from clinics — no new orders possible')}
                                    </p>
                                </div>
                                {/* Animated pill toggle */}
                                <div className="relative w-12 h-[26px] rounded-full shrink-0 transition-colors duration-200"
                                    style={{ background: form.is_active ? '#34d399' : 'var(--surface)', border: '1px solid var(--border-strong)' }}>
                                    <div className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full shadow-md transition-transform duration-200"
                                        style={{
                                            background: 'white',
                                            transform: form.is_active ? 'translateX(22px)' : 'translateX(0)',
                                        }} />
                                </div>
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pb-6">
                            <Link href={route('lab.services.index')} className="btn-ghost">
                                {t('Cancel')}
                            </Link>
                            <button type="submit" disabled={processing}
                                className="btn-primary" style={processing ? { opacity: 0.65, cursor: 'not-allowed' } : {}}>
                                <Save size={13} />
                                {processing ? t('Saving…')
                                    : mode === 'create' ? t('Create Service') : t('Save Changes')}
                            </button>
                        </div>
                    </div>

                    {/* ══ RIGHT — 2 columns, sticky ══ */}
                    <div className={`lg:col-span-2 ${mobileTab === 'form' ? 'hidden lg:block' : ''}`}
                        style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
                        <RightPanel
                            name={form.name} price={form.price} days={form.production_days}
                            isActive={form.is_active} category={form.category}
                            imagePreview={imagePreview} description={form.description}
                        />
                    </div>

                </div>
            </form>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   CREATE PAGE
════════════════════════════════════════════════════ */
interface CreateProps { categories: string[]; }
export function CreateService({ categories }: CreateProps) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const handleSubmit = (data: ServiceFormData) => {
        setProcessing(true);
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('description', data.description);
        fd.append('price', data.price);
        fd.append('production_days', data.production_days);
        fd.append('is_active', data.is_active ? '1' : '0');
        fd.append('category', data.category);
        if (data.image) fd.append('image', data.image);

        router.post(route('lab.services.store'), fd as any, {
            forceFormData: true,
            onError: e => { setErrors(e); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    };

    return (
        <LabLayout>
            <Head title={t('Add Service')} />
            <ServiceFormLayout mode="create" categories={categories}
                onSubmit={handleSubmit} processing={processing} errors={errors} />
        </LabLayout>
    );
}

/* ════════════════════════════════════════════════════
   EDIT PAGE
════════════════════════════════════════════════════ */
interface EditProps {
    categories: string[];
    service: {
        id: number; name: string; description: string | null;
        price: string; production_days: number; is_active: boolean;
        category: string; image_url: string | null;
    };
}
export function EditService({ categories, service }: EditProps) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const handleSubmit = (data: ServiceFormData) => {
        setProcessing(true);
        const fd = new FormData();
        fd.append('_method', 'PATCH');
        fd.append('name', data.name);
        fd.append('description', data.description);
        fd.append('price', data.price);
        fd.append('production_days', data.production_days);
        fd.append('is_active', data.is_active ? '1' : '0');
        fd.append('category', data.category);
        fd.append('remove_image', data.remove_image ? '1' : '0');
        if (data.image) fd.append('image', data.image);

        router.post(route('lab.services.update', service.id), fd as any, {
            forceFormData: true,
            onError: e => { setErrors(e); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    };

    return (
        <LabLayout>
            <Head title={`${t('Edit')} — ${service.name}`} />
            <ServiceFormLayout mode="edit" categories={categories}
                initialValues={{
                    name:            service.name,
                    description:     service.description ?? '',
                    price:           service.price,
                    production_days: String(service.production_days),
                    is_active:       service.is_active,
                    category:        service.category,
                    image_url:       service.image_url ?? undefined,
                }}
                onSubmit={handleSubmit} processing={processing} errors={errors}
                serviceId={service.id}
            />
        </LabLayout>
    );
}

export default CreateService;
