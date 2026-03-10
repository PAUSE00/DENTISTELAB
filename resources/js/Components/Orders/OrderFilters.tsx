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
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={localFilters.search}
                        onChange={(e) => onUpdateFilter('search', e.target.value)}
                        className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400 text-sm"
                    />
                </div>
                {/* Filter Toggle */}
                <button
                    onClick={onToggleFilters}
                    className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border transition-all font-bold text-sm ${showFilters || activeFilterCount > 0
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-blue-500'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {t('Filters')}
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-5 py-3.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 transition-all font-bold text-sm"
                    >
                        <FilterX className="w-4 h-4" />
                        {t('Clear All')}
                    </button>
                )}
            </div>

            {/* Advanced Filter Dropdowns */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    {filterFields.map((field) => (
                        <div key={field.key}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    value={localFilters[field.key] || ''}
                                    onChange={(e) => onUpdateFilter(field.key, e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
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
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
