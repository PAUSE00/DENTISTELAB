import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Search, Package, X, ArrowRight } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Result {
    type: string; id: number; label: string; sub: string;
    status: string; url: string;
}

const STATUS_DOT: Record<string, string> = {
    new: '#60ddc6', in_progress: '#818cf8', fitting: '#c084fc',
    finished: '#34d399', shipped: '#60ddc6', delivered: '#34d399',
    rejected: '#f87171', cancelled: '#f87171',
};

export default function GlobalSearch() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounce = useRef<ReturnType<typeof setTimeout>>();

    // Ctrl+K / Cmd+K to open
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setResults([]);
            setSelected(0);
        }
    }, [open]);

    useEffect(() => {
        if (!query.trim() || query.length < 2) { setResults([]); return; }
        clearTimeout(debounce.current);
        setLoading(true);
        debounce.current = setTimeout(async () => {
            try {
                const res = await fetch(route('lab.search') + '?q=' + encodeURIComponent(query));
                const data = await res.json();
                setResults(data.results || []);
                setSelected(0);
            } catch (_) {}
            finally { setLoading(false); }
        }, 200);
    }, [query]);

    const navigate = useCallback((url: string) => {
        setOpen(false);
        router.visit(url);
    }, []);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
        if (e.key === 'Enter' && results[selected]) navigate(results[selected].url);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-[12px]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-3)', minWidth: 140 }}
                title="Ctrl+K">
                <Search size={12} />
                <span className="hidden sm:block">{t('Search')}...</span>
                <kbd className="hidden sm:flex items-center gap-0.5 ml-auto text-[10px] px-1 rounded"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--txt-3)' }}>
                    ⌘K
                </kbd>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}>
            <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}
                onClick={e => e.stopPropagation()}>

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <Search size={15} style={{ color: 'var(--txt-3)' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={t('Search orders, patients, clinics...')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        className="flex-1 bg-transparent outline-none text-[14px]"
                        style={{ color: 'var(--txt-1)' }}
                    />
                    {query && (
                        <button onClick={() => setQuery('')} style={{ color: 'var(--txt-3)' }}>
                            <X size={14} />
                        </button>
                    )}
                    <kbd className="text-[10px] px-1.5 py-px rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-3)' }}>ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto no-scrollbar">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="w-5 h-5 rounded-full border-2 animate-spin"
                                style={{ borderColor: 'var(--border)', borderTopColor: 'var(--txt-accent)' }} />
                        </div>
                    )}

                    {!loading && results.length === 0 && query.length >= 2 && (
                        <div className="py-10 text-center">
                            <Package size={24} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--txt-3)' }} />
                            <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('No results found')}</p>
                        </div>
                    )}

                    {!loading && results.length === 0 && query.length < 2 && (
                        <div className="py-8 text-center">
                            <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('Type to search...')}</p>
                        </div>
                    )}

                    {!loading && results.map((r, i) => (
                        <button
                            key={r.id}
                            onClick={() => navigate(r.url)}
                            onMouseEnter={() => setSelected(i)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                            style={{
                                background: i === selected ? 'var(--surface)' : 'transparent',
                                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                            }}>
                            <span className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: STATUS_DOT[r.status] ?? '#60ddc6' }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--txt-1)' }}>{r.label}</p>
                                <p className="text-[11px] truncate" style={{ color: 'var(--txt-3)' }}>{r.sub}</p>
                            </div>
                            <ArrowRight size={13} style={{ color: 'var(--txt-3)', opacity: i === selected ? 1 : 0 }} />
                        </button>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="flex items-center gap-4 px-4 py-2 border-t text-[10.5px]"
                    style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                    <span>↑↓ {t('navigate')}</span>
                    <span>↵ {t('open')}</span>
                    <span>ESC {t('close')}</span>
                </div>
            </div>
        </div>
    );
}
