import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
 label: string;
 value: string;
}

interface FilterGroup {
 key: string;
 label: string;
 options: FilterOption[];
}

interface Props {
 search: string;
 onSearchChange: (value: string) => void;
 filters?: FilterGroup[];
 activeFilters?: Record<string, string>;
 onFilterChange?: (key: string, value: string) => void;
 placeholder?: string;
}

export default function FilterBar({
 search,
 onSearchChange,
 filters = [],
 activeFilters = {},
 onFilterChange,
 placeholder = 'Rechercher...'
}: Props) {
 return (
 <div className="flex flex-col sm:flex-row gap-4 mb-6">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
 <input
 type="text"
 placeholder={placeholder}
 value={search}
 onChange={(e) => onSearchChange(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
 />
 </div>

 {filters.length > 0 && (
 <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
 {filters.map((group) => (
 <div key={group.key} className="relative">
 <select
 value={activeFilters[group.key] || ''}
 onChange={(e) => onFilterChange?.(group.key, e.target.value)}
 className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-w-[140px]"
 >
 <option value="">{group.label}</option>
 {group.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
 </div>
 ))}

 {/* Clear Filters Button */}
 {Object.values(activeFilters).some(Boolean) && (
 <button
 onClick={() => filters.forEach(f => onFilterChange?.(f.key, ''))}
 className="p-2.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
 title="Effacer les filtres"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>
 )}
 </div>
 );
}
