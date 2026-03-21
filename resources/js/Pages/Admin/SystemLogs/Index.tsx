import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Activity, Search, FilterX, Clock } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';

interface Log {
    id: number;
    action: string;
    description: string;
    ip_address: string;
    created_at: string;
    user?: { name: string, email: string };
}

interface Props extends PageProps {
    logs: { data: Log[], links: any[], total?: number };
    filters: { search?: string };
}

export default function SystemLogs({ logs, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.system-logs.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout header={t('System Audit Logs')}>
            <Head title={t('Audit Logs')} />

            <div className="animate-fade-in space-y-6 pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                            {t('Security & Audits')}
                        </p>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('System')} <span style={{ color: 'var(--accent)' }}>{t('Audit Logs')}</span>
                        </h2>
                    </div>
                </div>

                {/* Search / Filters */}
                <div className="flex gap-3 items-center">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('Search action, IP or user...')}
                            className="w-full pl-11 pr-5 py-3 rounded-xl text-[13px] outline-none transition-all"
                            style={{ background: 'var(--bg-raised)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                        />
                    </form>
                    <button
                        onClick={() => { setSearch(''); router.get(route('admin.system-logs.index')); }}
                        className="p-3 rounded-xl border transition-all hover:bg-[var(--surface)]"
                        style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}
                        title={t('Clear filters')}
                    >
                        <FilterX className="w-5 h-5" />
                    </button>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px] border-collapse">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                                    {['Timestamp', 'Action', 'Initiator', 'Network IP'].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60 ${i === 3 ? 'text-right' : ''}`}
                                            style={{ color: 'var(--txt-2)' }}
                                        >{t(h)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.length > 0 ? logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="group border-b transition-colors hover:bg-[var(--surface-hover)] last:border-0"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--txt-3)' }} />
                                                <span className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>
                                                    {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent-10)', border: '1px solid var(--border)' }}>
                                                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{log.action}</p>
                                                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{log.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {log.user ? (
                                                <div>
                                                    <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{log.user.name}</p>
                                                    <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{log.user.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                                                    System Auto
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="text-[12px] font-mono tracking-wider" style={{ color: 'var(--txt-2)' }}>
                                                {log.ip_address || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                                                    <Activity className="w-7 h-7" style={{ color: 'var(--txt-3)' }} />
                                                </div>
                                                <p className="font-bold text-[13px]" style={{ color: 'var(--txt-1)' }}>{t('No Logs Found')}</p>
                                                <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('No system events recorded yet.')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {logs.links && logs.links.length > 3 && (
                        <div className="px-6 py-4 border-t flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                {t('Showing')} <span className="font-bold" style={{ color: 'var(--txt-2)' }}>{logs.data.length}</span> {t('of')} {logs.total ?? logs.data.length} {t('logs')}
                            </p>
                            <Pagination links={logs.links} />
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
