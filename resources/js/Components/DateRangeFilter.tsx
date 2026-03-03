
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
            <div className="hidden md:flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 px-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">Period:</span>
                </div>
                <input
                    type="date"
                    name="start_date"
                    value={values.start_date}
                    onChange={handleChange}
                    className="border-none bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:ring-primary-500 py-1.5"
                />
                <span className="text-gray-400">-</span>
                <input
                    type="date"
                    name="end_date"
                    value={values.end_date}
                    onChange={handleChange}
                    className="border-none bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:ring-primary-500 py-1.5"
                />
                <button
                    onClick={applyFilter}
                    className="p-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                    title="Apply Filter"
                >
                    <Filter className="w-4 h-4" />
                </button>
                <button
                    onClick={resetFilter}
                    className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reset"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Mobile View: Toggle Button & Dropdown (Simplified for now, just same as desktop but stacked or scrollable) */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium"
                >
                    <Calendar className="w-4 h-4" />
                    <span>Filter Date</span>
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 z-50 space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={values.start_date}
                                onChange={handleChange}
                                className="w-full border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={values.end_date}
                                onChange={handleChange}
                                className="w-full border-gray-200 dark:border-slate-700 rounded-lg text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={applyFilter}
                                className="flex-1 bg-primary-600 text-white text-sm py-2 rounded-lg"
                            >
                                Apply
                            </button>
                            <button
                                onClick={resetFilter}
                                className="flex-1 bg-gray-100 text-gray-700 text-sm py-2 rounded-lg"
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
