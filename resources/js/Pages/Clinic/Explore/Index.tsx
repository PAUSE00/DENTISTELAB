import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Search, MapPin, Star, Package, ChevronRight, 
    Filter, Building2, Truck, ShieldCheck, Sparkles 
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';

interface Lab {
    id: number;
    name: string;
    city: string;
    services_count: number;
    rating: number;
    order_count: number;
}

interface Props extends PageProps {
    labs: Lab[];
    filters: { search: string };
}

export default function Index({ auth, labs, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('clinic.explore.index'), { search }, { preserveState: true });
    };

    return (
        <ClinicLayout>
            <Head title={t('Explore Laboratories')} />
            
            <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Hero / Search Section */}
                <div className="relative rounded-[32px] overflow-hidden p-10 lg:p-16 flex flex-col items-center text-center gap-6"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
                    
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#818cf8] opacity-10 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#60ddc6] opacity-10 blur-[100px]" />

                    <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl px-4">
                        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                            {t('Marketplace')}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {t('Find your next')} <span className="text-[#60ddc6]">{t('perfect')}</span> {t('Lab partner')}
                        </h1>
                        <p className="text-indigo-100/70 text-sm md:text-base leading-relaxed">
                            {t('Discover certified dental laboratories, browse their full catalogs, and start collaborating in seconds.')}
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="relative z-10 w-full max-w-xl group">
                        <input 
                            type="text" 
                            className="w-full bg-white/10 border border-white/20 rounded-[22px] py-4 pl-14 pr-6 text-white placeholder-white/40 focus:bg-white/15 focus:border-[#818cf8] focus:ring-4 focus:ring-[#818cf8]/10 transition-all outline-none"
                            placeholder={t('Search by name, city or specialty...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#818cf8] transition-colors" size={20} />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#818cf8] hover:bg-[#6366f1] text-white px-6 py-2 rounded-[14px] text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
                            {t('Explore')}
                        </button>
                    </form>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{t('Recommended Laboratories')}</h2>
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: 'var(--surface)', color: 'var(--txt-3)', border: '1px solid var(--border)' }}>
                                {labs.length} {t('Results')}
                            </span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all hover:bg-white/5" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                            <Filter size={14} /> {t('Filters')}
                        </button>
                    </div>

                    {/* Labs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {labs.map((lab) => (
                            <Link 
                                key={lab.id} 
                                href={route('clinic.explore.show', lab.id)}
                                className="group relative card overflow-hidden border transition-all duration-300 hover:border-[#818cf8]/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
                                style={{ background: 'var(--bg-raised)' }}
                            >
                                {/* Lab Image Placeholder/Gradient */}
                                <div className="h-32 w-full p-4 flex items-end relative overflow-hidden" 
                                     style={{ background: 'linear-gradient(to top right, #1e1b4b, #312e81)' }}>
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="h-full w-full opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(96, 221, 198, 0.2) 0%, transparent 50%)' }} />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-110">
                                        <Building2 className="text-indigo-600" size={24} />
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-bold group-hover:text-[#818cf8] transition-colors" style={{ color: 'var(--txt-1)' }}>{lab.name}</h3>
                                    
                                    <div className="flex items-center gap-2 text-[12px] mt-2" style={{ color: 'var(--txt-3)' }}>
                                        <MapPin size={12} className="text-rose-400" />
                                        <span>{lab.city || 'Remote Partner'}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex flex-col gap-1 text-center border-r" style={{ borderColor: 'var(--border)' }}>
                                            <div className="flex items-center justify-center gap-1 text-[13px] font-bold text-amber-400">
                                                <Star size={12} fill="currentColor" /> {lab.rating}
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-tighter opacity-100" style={{ color: 'var(--txt-4)' }}>
                                                {lab.order_count}+ {t('Jobs')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-center">
                                            <span className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{lab.services_count}</span>
                                            <span className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: 'var(--txt-4)' }}>
                                                {t('Products')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[Truck, ShieldCheck, Sparkles].map((Icon, idx) => (
                                                <div key={idx} className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                                                    <Icon size={14} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-[#818cf8] group-hover:gap-2 transition-all">
                                            {t('View Catalog')} <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {labs.length === 0 && (
                        <div className="p-20 flex flex-col items-center justify-center text-center opacity-30 grayscale">
                            <Search size={64} className="mb-4" />
                            <h3 className="text-xl font-bold">{t('No laboratories found')}</h3>
                            <p className="text-sm mt-2">{t('Try searching with different keywords or location.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </ClinicLayout>
    );
}
