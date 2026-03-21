import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
 Bookmark, Plus, Trash2, Edit3, Save, 
 X, Info, Package, Building2, Zap,
 Settings2, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import Modal from '@/Components/Modal';

interface Lab {
 id: number;
 name: string;
 services?: { id: number; name: string }[];
}

interface Template {
 id: number;
 name: string;
 lab_id: number | null;
 service_id: number | null;
 teeth_data: number[] | null;
 notes: string | null;
 color: string;
 lab?: Lab;
 service?: { name: string };
}

interface Props extends PageProps {
 templates: Template[];
 labs: Lab[];
}

export default function Index({ auth, templates, labs }: Props) {
 const { t } = useTranslation();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

 const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
 name: '',
 lab_id: '' as any,
 service_id: '' as any,
 teeth_data: [] as number[],
 notes: '',
 color: '#818cf8',
 });

 const openCreateModal = () => {
 setEditingTemplate(null);
 reset();
 setIsModalOpen(true);
 };

 const openEditModal = (template: Template) => {
 setEditingTemplate(template);
 setData({
 name: template.name,
 lab_id: template.lab_id || '',
 service_id: template.service_id || '',
 teeth_data: template.teeth_data || [],
 notes: template.notes || '',
 color: template.color || '#818cf8',
 });
 setIsModalOpen(true);
 };

 const submit = (e: React.FormEvent) => {
 e.preventDefault();
 if (editingTemplate) {
 put(route('clinic.templates.update', editingTemplate.id), {
 onSuccess: () => setIsModalOpen(false)
 });
 } else {
 post(route('clinic.templates.store'), {
 onSuccess: () => setIsModalOpen(false)
 });
 }
 };

 const selectedLab = labs.find(l => l.id === Number(data.lab_id));

 return (
 <ClinicLayout>
 <Head title={t('Order Presets')} />
 
 <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex flex-col gap-1">
 <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Prescription Templates')}</h2>
 <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{t('Save your common prescriptions for 1-click ordering')}</p>
 </div>
 <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-accent">
 <Plus size={18} /> {t('Create Template')}
 </button>
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {templates.length > 0 ? templates.map((template) => (
 <div key={template.id} className="card p-6 flex flex-col gap-5 group hover:border-accent/50 transition-all cursor-default" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: template.color }}>
 <Bookmark size={20} />
 </div>
 <h3 className="font-bold text-lg" style={{ color: 'var(--txt-1)' }}>{template.name}</h3>
 </div>
 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 <button onClick={() => openEditModal(template)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--txt-3)' }}>
 <Edit3 size={16} />
 </button>
 <button onClick={() => { if(confirm(t('Delete this template?'))) destroy(route('clinic.templates.destroy', template.id)) }} className="p-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-colors" style={{ color: 'var(--txt-3)' }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>

 <div className="flex flex-col gap-3">
 <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-3)' }}>
 <Building2 size={14} className="opacity-50" /> {template.lab?.name || t('No Lab Selected')}
 </div>
 <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: 'var(--txt-3)' }}>
 <Package size={14} className="opacity-50" /> {template.service?.name || t('No Service Selected')}
 </div>
 {template.teeth_data && template.teeth_data.length > 0 && (
 <div className="flex items-center gap-2 text-[11px] font-black text-[#60ddc6] bg-[#60ddc6]/10 px-2.5 py-1 rounded-lg w-fit">
 <Zap size={12} /> {template.teeth_data.length} {t('Teeth Targeted')}
 </div>
 )}
 </div>

 <div className="mt-2 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
 <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{t('Auto-fill enabled')}</span>
 <ChevronRight size={16} className="text-accent" />
 </div>
 </div>
 )) : (
 <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-30 grayscale gap-4">
 <Bookmark size={64} />
 <div className="text-center">
 <p className="text-lg font-black uppercase tracking-widest">{t('No templates found')}</p>
 <p className="text-sm font-bold">{t('Create your first prescription preset to speed up ordering')}</p>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Create/Edit Modal */}
 <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
 <form onSubmit={submit} className="p-8 flex flex-col gap-8" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
 <Settings2 size={22} />
 </div>
 <div>
 <h3 className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{editingTemplate ? t('Edit Template') : t('New Template')}</h3>
 <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{t('Define your standard prescription workflow')}</p>
 </div>
 </div>
 <button type="button" onClick={() => setIsModalOpen(false)} style={{ color: 'var(--txt-3)' }}>
 <X size={24} />
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="flex flex-col gap-2">
 <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Template Name')}</label>
 <input 
 type="text"
 value={data.name}
 onChange={e => setData('name', e.target.value)}
 className="premium-input-field"
 placeholder={t('e.g. Standard Zirconia Crown')}
 />
 {errors.name && <span className="text-xs text-rose-500 font-bold">{errors.name}</span>}
 </div>

 <div className="flex flex-col gap-2">
 <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Accent Color')}</label>
 <input 
 type="color"
 value={data.color}
 onChange={e => setData('color', e.target.value)}
 className="w-full h-[46px] rounded-xl cursor-pointer bg-transparent border-2 p-1"
 style={{ borderColor: 'var(--border)' }}
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Preferred Laboratory')}</label>
 <select 
 value={data.lab_id}
 onChange={e => setData('lab_id', e.target.value)}
 className="premium-input-field"
 >
 <option value="">{t('None (Universal)')}</option>
 {labs.map(l => (
 <option key={l.id} value={l.id}>{l.name}</option>
 ))}
 </select>
 </div>

 <div className="flex flex-col gap-2">
 <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Target Service')}</label>
 <select 
 value={data.service_id}
 onChange={e => setData('service_id', e.target.value)}
 className="premium-input-field"
 disabled={!data.lab_id}
 >
 <option value="">{t('Select a service')}</option>
 {selectedLab?.services?.map(s => (
 <option key={s.id} value={s.id}>{s.name}</option>
 ))}
 </select>
 </div>
 </div>

 <div className="flex flex-col gap-2">
 <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Universal Instructions / Notes')}</label>
 <textarea 
 value={data.notes}
 onChange={e => setData('notes', e.target.value)}
 className="premium-input-field min-h-[100px]"
 placeholder={t('Add internal notes or standard instructions for the lab...')}
 />
 </div>

 <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border font-bold text-sm transition-all hover:bg-white/5" style={{ borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
 {t('Cancel')}
 </button>
 <button type="submit" disabled={processing} className="btn-primary flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
 <Save size={18} /> {editingTemplate ? t('Update Template') : t('Save Template')}
 </button>
 </div>
 </form>
 </Modal>
 </ClinicLayout>
 );
}
