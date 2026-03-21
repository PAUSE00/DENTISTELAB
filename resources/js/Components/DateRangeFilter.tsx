
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar, Filter, X } from 'lucide-react';

interface Props {
 startDate: string;
 endDate: string;
 className?: string;
}

export default function DateRangeFilter({ startDate, endDate, className = '' }: Props) {
 const [values, setValues] = useState({
 start_date: startDate,
 end_date: endDate,
 });

 const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
 setValues({ start_date: startDate, end_date: endDate });
 }, [startDate, endDate]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const { name, value } = e.target;
 setValues(prev => ({ ...prev, [name]: value }));
 };

 const applyFilter = () => {
 router.get(
 route(route().current() as string),
 values,
 {
 preserveState: true,
 preserveScroll: true,
 replace: true,
 }
 );
 setIsOpen(false);
 };

 const resetFilter = () => {
 // Reset to current month logic or just remove params
 // Ideally we'd remove params, but controller defaults to current month, which is fine.
 const now = new Date();
 const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
 const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

 setValues({ start_date: start, end_date: end });

 router.get(
 route(route().current() as string),
 {}, // Empty params triggers controller default
 {
 preserveState: true,
 preserveScroll: true,
 replace: true,
 }
 );
 setIsOpen(false);
 };

 return (
 <div className={`relative ${className}`}>
 {/* Desktop View: Inline inputs */}
 <div className="hidden md:flex items-center gap-2 p-1.5 rounded-xl border shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-2 px-2">
 <Calendar className="w-4 h-4 " style={{ color: 'var(--txt-2)' }} />
 <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>Period:</span>
 </div>
 <input
 type="date"
 name="start_date"
 value={values.start_date}
 onChange={handleChange}
 className="border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 py-1.5"
 style={{ background: 'transparent', color: 'var(--txt-1)' }}
 />
 <span className="" style={{ color: 'var(--txt-3)' }}>-</span>
 <input
 type="date"
 name="end_date"
 value={values.end_date}
 onChange={handleChange}
 className="border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 py-1.5"
 style={{ background: 'transparent', color: 'var(--txt-1)' }}
 />
 <button
 onClick={applyFilter}
 className="p-1.5 rounded-lg transition-colors flex items-center justify-center"
 style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}
 title="Apply Filter"
 >
 <Filter className="w-4 h-4" />
 </button>
 <button
 onClick={resetFilter}
 className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
 title="Reset"
 style={{ color: 'var(--txt-3)' }}
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Mobile View: Toggle Button & Dropdown (Simplified for now, just same as desktop but stacked or scrollable) */}
 <div className="md:hidden">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium"
 style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}
 >
 <Calendar className="w-4 h-4" style={{ color: 'var(--txt-3)' }} />
 <span>Filter Date</span>
 </button>

 {isOpen && (
 <div className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl border p-4 z-50 space-y-3" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
 <div className="space-y-1">
 <label className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>Start Date</label>
 <input
 type="date"
 name="start_date"
 value={values.start_date}
 onChange={handleChange}
 className="w-full rounded-lg text-sm border focus:ring-1 focus:ring-indigo-500"
 style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--txt-1)' }}
 />
 </div>
 <div className="space-y-1">
 <label className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>End Date</label>
 <input
 type="date"
 name="end_date"
 value={values.end_date}
 onChange={handleChange}
 className="w-full rounded-lg text-sm border focus:ring-1 focus:ring-indigo-500"
 style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--txt-1)' }}
 />
 </div>
 <div className="flex items-center gap-2 pt-2">
 <button
 onClick={applyFilter}
 className="flex-1 text-[13px] font-semibold text-white py-2 rounded-lg transition-colors"
 style={{ background: 'var(--txt-accent)', color: 'var(--bg)' }}
 >
 Apply
 </button>
 <button
 onClick={resetFilter}
 className="flex-1 text-[13px] font-semibold py-2 rounded-lg transition-colors border"
 style={{ background: 'var(--surface)', color: 'var(--txt-2)', borderColor: 'var(--border)' }}
 >
 Reset
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
