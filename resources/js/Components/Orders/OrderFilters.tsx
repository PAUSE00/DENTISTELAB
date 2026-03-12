import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { FilterOption } from '@/types/order';

interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'date';
    options?: { id: number; name: string }[] | FilterOption[];
    placeholder?: string;
}

interface OrderFiltersProps {
    localFilters: Record<string, string>;
    showFilters: boolean;
    activeFilterCount: number;
    searchPlaceholder: string;
    filterFields: FilterField[];
    onToggleFilters: () => void;
    onUpdateFilter: (key: string, value: string) => void;
    onClearFilters: () => void;
}

export default function OrderFilters({
    localFilters, showFilters, activeFilterCount, searchPlaceholder,
    filterFields, onToggleFilters, onUpdateFilter, onClearFilters,
}: OrderFiltersProps) {
    const { t } = useTranslation();
    const hasActive = activeFilterCount > 0;

    const inputStyle: React.CSSProperties = {
        width: '100%',
        height: '34px',
        padding: '0 10px',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'var(--txt-1)',
        background: 'rgba(15,23,42,0.2)',
        border: '1px solid #312e81',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Search + toggle row */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'var(--txt-3)' }} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={localFilters.search}
                        onChange={e => onUpdateFilter('search', e.target.value)}
                        className="w-full h-9 pl-9 pr-8 rounded-lg text-[13px] outline-none transition-colors"
                        style={{
                            background: 'rgba(15,23,42,0.2)',
                            border: '1px solid #312e81',
                            color: 'var(--txt-1)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                        onBlur={e => e.currentTarget.style.borderColor = '#312e81'}
                    />
                    {localFilters.search && (
                        <button onClick={() => onUpdateFilter('search', '')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--txt-3)' }}>
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Filter toggle */}
                <button onClick={onToggleFilters}
                    className="flex items-center gap-2 h-9 px-3.5 rounded-lg text-[12.5px] font-medium transition-all"
                    style={{
                        background: showFilters || hasActive ? 'var(--teal-10)' : 'var(--surface)',
                        border: `1px solid ${showFilters || hasActive ? 'var(--teal-20)' : 'var(--border)'}`,
                        color: showFilters || hasActive ? 'var(--txt-accent)' : 'var(--txt-2)',
                    }}
                    onMouseEnter={e => {
                        if (!showFilters && !hasActive) {
                            e.currentTarget.style.borderColor = 'var(--teal-20)';
                            e.currentTarget.style.color = 'var(--txt-accent)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!showFilters && !hasActive) {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--txt-2)';
                        }
                    }}>
                    <SlidersHorizontal size={13} />
                    {t('Filters')}
                    {hasActive && (
                        <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                            style={{ background: 'var(--txt-accent)', color: 'var(--bg)' }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {hasActive && (
                    <button onClick={onClearFilters}
                        className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium transition-all"
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(248,113,113,0.2)',
                            color: '#f87171',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}>
                        <X size={12} />
                        {t('Clear')}
                    </button>
                )}
            </div>

            {/* Advanced filter panel */}
            {showFilters && (
                <div className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid #312e81', background: 'transparent' }}>
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b"
                        style={{ borderColor: '#312e81', background: 'rgba(15,23,42,0.1)' }}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--txt-3)' }}>
                            {t('Filter Options')}
                        </span>
                        {hasActive && (
                            <button onClick={onClearFilters}
                                className="text-[11px] font-medium"
                                style={{ color: '#f87171' }}>
                                {t('Clear all')}
                            </button>
                        )}
                    </div>

                    {/* Fields grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x"
                        style={{ borderColor: '#312e81' }}>
                        {filterFields.map((field, i) => {
                            const isActive = !!localFilters[field.key];
                            return (
                                <div key={field.key} className="px-4 py-3"
                                    style={{
                                        borderRight: i < filterFields.length - 1 ? '1px solid #312e81' : 'none',
                                    }}>
                                    <label className="block text-[10.5px] font-semibold uppercase tracking-wide mb-1.5"
                                        style={{ color: isActive ? 'var(--txt-accent)' : 'var(--txt-3)' }}>
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        {field.type === 'select' ? (
                                            <>
                                                <select
                                                    value={localFilters[field.key] || ''}
                                                    onChange={e => onUpdateFilter(field.key, e.target.value)}
                                                    style={{
                                                        ...inputStyle,
                                                        color: isActive ? 'var(--txt-1)' : 'var(--txt-3)',
                                                        borderColor: isActive ? '#4f46e5' : '#312e81',
                                                        paddingRight: '28px',
                                                    }}>
                                                    <option value="">{field.placeholder || t('All')}</option>
                                                    {field.options?.map((opt: any) => (
                                                        <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                                                            {opt.label ?? opt.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={11}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                                    style={{ color: 'var(--txt-3)' }} />
                                            </>
                                        ) : (
                                            <input
                                                type="date"
                                                value={localFilters[field.key] || ''}
                                                onChange={e => onUpdateFilter(field.key, e.target.value)}
                                                style={{
                                                    ...inputStyle,
                                                    borderColor: isActive ? '#4f46e5' : '#312e81',
                                                }} />
                                        )}
                                    </div>
                                    {isActive && (
                                        <button
                                            onClick={() => onUpdateFilter(field.key, '')}
                                            className="mt-1.5 text-[10px] font-medium flex items-center gap-1"
                                            style={{ color: 'var(--txt-3)' }}>
                                            <X size={9} />
                                            {t('Clear')}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
