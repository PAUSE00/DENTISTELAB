import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
 Search, MapPin, Star, ChevronRight, 
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
 
 <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 
 {/* Hero / Search Section */}
 <div className="relative overflow-hidden rounded-2xl px-6 py-12 lg:py-16 flex flex-col items-center text-center gap-6"
 style={{ background: 'linear-gradient(135deg, rgba(96,221,198,0.06) 0%, rgba(129,140,248,0.05) 100%)', border: '1px solid var(--border)' }}>
 
 {/* Abstract background elements */}
 <div className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[100px] pointer-events-none" style={{ background: '#818cf8' }} />
 <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20 blur-[100px] pointer-events-none" style={{ background: '#60ddc6' }} />

 <div className="relative z-10 flex flex-col items-center gap-3 max-w-2xl px-4">
 <div className="px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-widest"
 style={{ background: 'var(--surface)', color: 'var(--txt-3)', border: '1px solid var(--border)' }}>
 {t('Marketplace')}
 </div>
 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Find your next')} <span style={{ color: '#60ddc6' }}>{t('perfect')}</span> {t('Lab partner')}
 </h1>
 <p className="text-sm md:text-base leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--txt-3)' }}>
 {t('Discover certified dental laboratories, browse their full catalogs, and start collaborating in seconds.')}
 </p>
 </div>

 <form onSubmit={handleSearch} className="relative z-10 w-full max-w-xl group mt-2">
 <div className="relative flex items-center">
 <Search className="absolute left-5 text-[18px]" style={{ color: 'var(--txt-4)' }} />
 <input 
 type="text" 
 className="w-full rounded-2xl py-4 pl-12 pr-32 text-sm outline-none transition-all"
 placeholder={t('Search by name, city or specialty...')}
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 style={{ 
 background: 'var(--bg)', 
 border: '1px solid var(--border-strong)',
 color: 'var(--txt-1)'
 }}
 onFocus={e => {
 e.currentTarget.style.borderColor = '#818cf8';
 e.currentTarget.style.boxShadow = '0 0 0 4px rgba(129,140,248,0.1)';
 }}
 onBlur={e => {
 e.currentTarget.style.borderColor = 'var(--border-strong)';
 e.currentTarget.style.boxShadow = 'none';
 }}
 />
 <div className="absolute right-2 top-1/2 -translate-y-1/2">
 <button type="submit" className="flex items-center justify-center bg-[#818cf8] hover:bg-[#6366f1] text-white px-6 h-10 rounded-xl text-sm font-bold shadow-lg shadow-accent transition-all hover:scale-105 active:scale-95">
 {t('Explore')}
 </button>
 </div>
 </div>
 </form>
 </div>

 {/* Main Content */}
 <div className="flex flex-col gap-4 mt-2">
 <div className="flex items-center justify-between px-1">
 <div className="flex items-center gap-3">
 <h2 className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Recommended Laboratories')}
 </h2>
 <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold" 
 style={{ background: 'var(--surface)', color: 'var(--txt-3)', border: '1px solid var(--border)' }}>
 {labs.length} {t('Results')}
 </span>
 </div>
 <button className="flex items-center gap-2 h-9 px-4 rounded-xl border text-[13px] font-medium transition-all hover:opacity-80" 
 style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
 <Filter size={14} /> {t('Filters')}
 </button>
 </div>

 {/* Labs Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
 {labs.map((lab) => (
 <Link 
 key={lab.id} 
 href={route('clinic.explore.show', lab.id)}
 className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
 style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
 >
 {/* Lab Image Placeholder/Gradient */}
 <div className="h-24 w-full px-5 flex items-end relative overflow-hidden" 
 style={{ background: 'var(--surface)' }}>
 <div className="absolute inset-0 opacity-20 pointer-events-none">
 <div className="h-full w-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(129, 140, 248, 0.4) 0%, transparent 70%)' }} />
 </div>
 <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative z-10 transition-transform group-hover:scale-110 translate-y-4"
 style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
 <Building2 size={24} style={{ color: '#818cf8' }} />
 </div>
 </div>

 <div className="p-5 pt-8 flex flex-col flex-1">
 <h3 className="text-lg font-bold group-hover:text-[#818cf8] transition-colors line-clamp-1" style={{ color: 'var(--txt-1)' }}>
 {lab.name}
 </h3>
 
 <div className="flex items-center gap-1.5 text-[12.5px] mt-1.5 font-medium" style={{ color: 'var(--txt-3)' }}>
 <MapPin size={13} style={{ color: '#f87171' }} />
 <span>{lab.city || 'Remote Partner'}</span>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="flex flex-col gap-1 text-center border-r" style={{ borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-center gap-1.5 text-[14px] font-black" style={{ color: '#fbbf24' }}>
 <Star size={13} fill="currentColor" /> {lab.rating}
 </div>
 <span className="text-[10px] uppercase font-bold tracking-widest pl-1" style={{ color: 'var(--txt-4)' }}>
 {lab.order_count}+ {t('Jobs')}
 </span>
 </div>
 <div className="flex flex-col gap-0.5 text-center">
 <span className="text-[15px] font-black" style={{ color: 'var(--txt-1)' }}>{lab.services_count}</span>
 <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--txt-4)' }}>
 {t('Products')}
 </span>
 </div>
 </div>

 <div className="mt-auto pt-6 flex items-center justify-between">
 <div className="flex gap-1.5">
 {[Truck, ShieldCheck, Sparkles].map((Icon, idx) => (
 <div key={idx} className="w-7 h-7 rounded-[9px] flex items-center justify-center transition-colors" 
 style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}
 onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--txt-1)'; }}
 onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--txt-3)'; }}>
 <Icon size={14} />
 </div>
 ))}
 </div>
 <div className="flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-all"
 style={{ color: '#818cf8' }}>
 {t('View Catalog')} <ChevronRight size={14} />
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>

 {labs.length === 0 && (
 <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
 <Search size={48} className="mb-4" />
 <h3 className="text-lg font-bold" style={{ color: 'var(--txt-1)' }}>{t('No laboratories found')}</h3>
 <p className="text-sm mt-1" style={{ color: 'var(--txt-3)' }}>{t('Try searching with different keywords or location.')}</p>
 </div>
 )}
 </div>
 </div>
 </ClinicLayout>
 );
}
