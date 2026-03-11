import { Search, SlidersHorizontal, FilterX } from 'lucide-react';
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
    localFilters,
    showFilters,
    activeFilterCount,
    searchPlaceholder,
    filterFields,
    onToggleFilters,
    onUpdateFilter,
    onClearFilters,
}: OrderFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="card p-3 space-y-3">
            <div className="flex gap-2">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--txt-3)' }}
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={localFilters.search}
                        onChange={(e) => onUpdateFilter('search', e.target.value)}
                        className="app-input pl-9"
                    />
                </div>

                {/* Filter toggle */}
                <button
                    onClick={onToggleFilters}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12.5px] font-medium transition-colors"
                    style={{
                        background: showFilters || activeFilterCount > 0 ? 'var(--teal-10)' : 'var(--surface)',
                        border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--teal-20)' : 'var(--border-strong)'}`,
                        color: showFilters || activeFilterCount > 0 ? 'var(--txt-accent)' : 'var(--txt-2)',
                    }}
                >
                    <SlidersHorizontal size={13} />
                    {t('Filters')}
                    {activeFilterCount > 0 && (
                        <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                            style={{ background: 'var(--txt-accent)', color: 'var(--bg)' }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12.5px] font-medium transition-colors"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: '#f87171' }}
                    >
                        <FilterX size={13} />
                        {t('Clear')}
                    </button>
                )}
            </div>

            {/* Advanced filters */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    {filterFields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--txt-3)' }}>
                                {field.label}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    value={localFilters[field.key] || ''}
                                    onChange={(e) => onUpdateFilter(field.key, e.target.value)}
                                    className="app-input"
                                    style={{ paddingTop: '5px', paddingBottom: '5px' }}
                                >
                                    <option value="">{field.placeholder || t('All')}</option>
                                    {field.options?.map((opt: any) => (
                                        <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                                            {opt.label ?? opt.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="date"
                                    value={localFilters[field.key] || ''}
                                    onChange={(e) => onUpdateFilter(field.key, e.target.value)}
                                    className="app-input"
                                    style={{ paddingTop: '5px', paddingBottom: '5px' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
