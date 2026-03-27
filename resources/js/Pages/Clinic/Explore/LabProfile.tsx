import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
 ArrowLeft, MapPin, Star, Clock, Globe, 
 Phone, Mail, Package, ShieldCheck, Zap,
 ChevronRight, ExternalLink, Calendar
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Service {
 id: number;
 name: string;
 description: string;
 price: number;
 production_days: number;
}

interface Lab {
 id: number;
 name: string;
 email: string;
 phone: string;
 city: string;
 address: string;
 rating: number;
 delivery_speed: string;
 specialties: string[];
 services: Service[];
}

interface Props extends PageProps {
 lab: Lab;
}

export default function LabProfile({ auth, lab }: Props) {
 const { t } = useTranslation();

 const formatCurrency = (val: number) => 
 new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(val);

 return (
 <ClinicLayout>
 <Head title={`${lab.name} - ${t('Laboratory Catalog')}`} />
 
 <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
 
 {/* Profile Header */}
 <div className="flex flex-col gap-6">
 <div className="flex items-center gap-4">
 <Link href={route('clinic.explore.index')} className="p-2.5 rounded-xl border hover:bg-white/5 transition-all outline-none" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
 <ArrowLeft size={18} />
 </Link>
 <div className="text-[12px] font-bold uppercase tracking-widest text-[#818cf8]">
 {t('Laboratory Catalog')}
 </div>
 </div>

 <div className="card p-8 lg:p-10 relative overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
 {/* Background glow */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-[#818cf8] opacity-5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />

 <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-500/40">
                            {lab.name[0]}
                        </div>
 
 <div className="flex-1">
 <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{lab.name}</h1>
 <div className="flex flex-wrap items-center gap-4 mt-3 text-sm" style={{ color: 'var(--txt-3)' }}>
 <span className="flex items-center gap-1.5"><MapPin size={14} className="text-rose-400" /> {lab.city}, {lab.address || 'Morocco'}</span>
 <span className="opacity-30">|</span>
 <span className="flex items-center gap-1.5 text-amber-400 font-bold"><Star size={14} fill="currentColor" /> {lab.rating} {t('Service Score')}</span>
 <span className="opacity-30">|</span>
 <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#60ddc6]" /> {lab.delivery_speed}</span>
 </div>
 <div className="flex flex-wrap gap-2 mt-4">
 {lab.specialties.map((s, i) => (
 <span key={i} className="px-3 py-1 rounded-lg text-[11px] font-bold border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
 {s}
 </span>
 ))}
 </div>
 </div>

 <div className="flex flex-col gap-3 shrink-0">
 <Link href={route('clinic.orders.create', { lab_id: lab.id })} className="btn-primary flex items-center justify-center gap-2 group px-8">
 {t('Start Collaboration')} <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
 </Link>
 <div className="flex gap-2">
 <button className="flex-1 p-2.5 rounded-xl border flex items-center justify-center hover:bg-white/5 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
 <Globe size={16} />
 </button>
 <button className="flex-1 p-2.5 rounded-xl border flex items-center justify-center hover:bg-white/5 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
 <Phone size={16} />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Catalog Sections */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* Catalog List */}
 <div className="lg:col-span-2 flex flex-col gap-6">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
 <Package size={20} className="text-[#818cf8]" /> {t('Service Catalog')}
 </h2>
 <div className="text-xs font-bold opacity-50 uppercase tracking-widest">{lab.services.length} {t('Items available')}</div>
 </div>

 <div className="grid grid-cols-1 gap-4">
 {lab.services.map((service) => (
 <div key={service.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#818cf8]/50 transition-all" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex-1">
 <div className="flex items-center gap-3">
 <h4 className="font-bold text-lg group-hover:text-[#818cf8] transition-colors" style={{ color: 'var(--txt-1)' }}>{service.name}</h4>
 <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest" style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}>
 {service.production_days} {t('Days')}
 </span>
 </div>
 <p className="text-sm mt-1.5 line-clamp-2" style={{ color: 'var(--txt-3)' }}>{service.description || t('High-quality dental appliance manufactured with precision and biocompatible materials.')}</p>
 </div>
 <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pr-2">
 <span className="text-xl font-black" style={{ color: '#60ddc6' }}>{formatCurrency(service.price)}</span>
 <Link href={route('clinic.orders.create', { lab_id: lab.id, service_id: service.id })} className="text-[12px] font-bold flex items-center gap-1.5 transition-all text-[#818cf8] hover:gap-2">
 {t('Order now')} <ChevronRight size={14} />
 </Link>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Sidebar / Info Sidebar */}
 <div className="flex flex-col gap-6">
 
 {/* Quality Badges */}
 <div className="card p-6 flex flex-col gap-6" style={{ background: 'var(--bg-raised)' }}>
 <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-1)' }}>{t('Why partner with them?')}</h3>
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-[#60ddc6]/10 flex items-center justify-center shrink-0" style={{ color: '#60ddc6' }}>
 <ShieldCheck size={20} />
 </div>
 <div>
 <h5 className="text-[13px] font-bold" style={{ color: 'var(--txt-2)' }}>{t('Certified Excellence')}</h5>
 <p className="text-[11px] mt-1" style={{ color: 'var(--txt-4)' }}>{t('All materials used are medically certified and bio-compatible.')}</p>
 </div>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0" style={{ color: '#f97316' }}>
 <Zap size={20} />
 </div>
 <div>
 <h5 className="text-[13px] font-bold" style={{ color: 'var(--txt-2)' }}>{t('Digital Workflow')}</h5>
 <p className="text-[11px] mt-1" style={{ color: 'var(--txt-4)' }}>{t('Supports STL file imports and full CAD/CAM integration.')}</p>
 </div>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0" style={{ color: '#3b82f6' }}>
 <Calendar size={20} />
 </div>
 <div>
 <h5 className="text-[13px] font-bold" style={{ color: 'var(--txt-2)' }}>{t('On-time Guarantee')}</h5>
 <p className="text-[11px] mt-1" style={{ color: 'var(--txt-4)' }}>{t('Strict adherence to production timelines across all orders.')}</p>
 </div>
 </div>
 </div>

 {/* Lab Stats */}
 <div className="card p-6 border-none" style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(96, 221, 198, 0.1) 100%)' }}>
 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-[#818cf8]">{t('Performance Pulse')}</h3>
 <div className="space-y-4">
 <div>
 <div className="flex justify-between text-[11px] font-bold mb-1.5" style={{ color: 'var(--txt-3)' }}>
 <span>{t('Consistency')}</span>
 <span>98%</span>
 </div>
 <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
 <div className="h-full bg-[#818cf8] rounded-full" style={{ width: '98%' }} />
 </div>
 </div>
 <div>
 <div className="flex justify-between text-[11px] font-bold mb-1.5" style={{ color: 'var(--txt-3)' }}>
 <span>{t('Support Speed')}</span>
 <span>{t('Fast')}</span>
 </div>
 <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
 <div className="h-full bg-[#60ddc6] rounded-full" style={{ width: '90%' }} />
 </div>
 </div>
 </div>
 <div className="mt-6 flex flex-col gap-2">
 <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>
 <Mail size={14} className="opacity-50" /> {lab.email}
 </div>
 <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>
 <Phone size={14} className="opacity-50" /> {lab.phone}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </ClinicLayout>
 );
}
