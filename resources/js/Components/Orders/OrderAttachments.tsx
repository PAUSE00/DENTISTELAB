import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, Paperclip, Upload, Download, Eye, Trash2, Box, X } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/Components/ConfirmModal';
import FilePreviewModal from '@/Components/FilePreviewModal';
import { OrderFile } from '@/types/order';
import ThreeDViewer from '@/Components/ThreeDViewer';

interface OrderAttachmentsProps {
 orderId: number;
 files: OrderFile[];
 uploadRoute: string;
 deleteRoute: (orderId: number, fileId: number) => string;
}

export default function OrderAttachments({ orderId, files, uploadRoute, deleteRoute }: OrderAttachmentsProps) {
 const { t } = useTranslation();
 const [processing, setProcessing] = useState(false);
 const [fileToDelete, setFileToDelete] = useState<number | null>(null);
 const [previewFile, setPreviewFile] = useState<OrderFile | null>(null);
 const [active3DUrl, setActive3DUrl] = useState<string | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setProcessing(true);
 router.post(uploadRoute, { file }, {
 preserveScroll: true,
 forceFormData: true,
 onFinish: () => {
 setProcessing(false);
 if (fileInputRef.current) fileInputRef.current.value = '';
 }
 });
 };

 const handleDeleteFile = () => {
 if (!fileToDelete) return;
 setProcessing(true);
 router.delete(deleteRoute(orderId, fileToDelete), {
 preserveScroll: true,
 onSuccess: () => {
 toast.success(t('File deleted successfully'));
 setFileToDelete(null);
 },
 onFinish: () => setProcessing(false)
 });
 };

 return (
 <>
 <div 
 className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-400 transition-all border-2 flex flex-col h-full"
 style={{ borderColor: 'transparent' }}
 onDragOver={(e) => {
 e.preventDefault();
 e.currentTarget.style.borderColor = 'var(--teal)';
 e.currentTarget.style.background = 'var(--teal-10)';
 }}
 onDragLeave={(e) => {
 e.preventDefault();
 e.currentTarget.style.borderColor = 'transparent';
 e.currentTarget.style.background = '';
 }}
 onDrop={(e) => {
 e.preventDefault();
 e.currentTarget.style.borderColor = 'transparent';
 e.currentTarget.style.background = '';
 const file = e.dataTransfer.files?.[0];
 if (file) {
 setProcessing(true);
 router.post(uploadRoute, { file }, {
 preserveScroll: true,
 forceFormData: true,
 onFinish: () => setProcessing(false)
 });
 }
 }}
 >
 <div className="flex justify-between items-center mb-5 shrink-0">
 <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
 <Paperclip className="w-4 h-4 text-primary-500" />
 {t('Attachments')}
 <span className=" text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">{files.length}</span>
 </h3>
 <div>
 <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.stl,.dcm,.zip" />
 <button
 onClick={() => fileInputRef.current?.click()}
 disabled={processing}
 className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center gap-1.5"
 >
 <Upload className="w-3 h-3" />
 {t('Add')}
 </button>
 </div>
 </div>

 {active3DUrl && (
 <div className="w-full h-[320px] rounded-xl overflow-hidden mb-6 relative animate-fade-in-up border shrink-0">
 <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none">
 <div className="flex items-center gap-2 text-white">
 <Box className="w-4 h-4" />
 <span className="text-[11px] font-bold uppercase tracking-widest">{t('3D Viewer')}</span>
 </div>
 <button onClick={() => setActive3DUrl(null)} className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white pointer-events-auto transition-colors">
 <X className="w-4 h-4" />
 </button>
 </div>
 <ThreeDViewer url={active3DUrl} color="#e8d2ac" />
 </div>
 )}

 <div className="flex-1 overflow-y-auto min-h-[150px] no-scrollbar">
 {files && files.length > 0 ? (
 <div className="space-y-2.5">
 {files.map(file => (
 <div key={file.id} 
 className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active3DUrl === `/storage/${file.path}` ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 shadow-sm' : ' hover: dark:hover:'}`}>
 <div className="flex items-center gap-3">
 <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm border ${active3DUrl === `/storage/${file.path}` ? 'bg-primary-100 dark:bg-primary-800 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-300' : 'bg-white text-primary-500 dark:text-primary-400'}`}>
 <FileText className="w-4 h-4" />
 </div>
 <div>
 <p className={`text-xs font-bold ${active3DUrl === `/storage/${file.path}` ? 'text-primary-700 dark:text-primary-300' : ' '}`}>{file.name}</p>
 <span className="text-[10px] font-medium font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
 </div>
 </div>
 <div className="flex items-center gap-1">
 {file.name.toLowerCase().endsWith('.stl') ? (
 <button onClick={() => { active3DUrl === `/storage/${file.path}` ? setActive3DUrl(null) : setActive3DUrl(`/storage/${file.path}`) }} className={`p-2 rounded-lg transition-all border ${active3DUrl === `/storage/${file.path}` ? 'bg-primary-500 text-white border-primary-600 shadow-md' : 'text-primary-500 hover:text-primary-600 border-transparent hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-sm'}`} title={t('View 3D Model')}>
 <Box className="w-4 h-4 flex-shrink-0" />
 </button>
 ) : (
 <button onClick={() => setPreviewFile(file)} className="p-2 text-primary-500 hover:text-primary-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-900/50 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-sm" title={t('Preview File')}>
 <Eye className="w-4 h-4" />
 </button>
 )}
 <a href={`/storage/${file.path}`} target="_blank" className="p-2 hover:text-primary-600 rounded-lg transition-all hover:bg-white dark:hover:" title={t('Download')}>
 <Download className="w-4 h-4" />
 </a>
 <button
 onClick={() => setFileToDelete(file.id)}
 className="p-2 hover:text-red-600 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm"
 title={t('Delete File')}
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-8 pointer-events-none">
 <p className="text-[11px] font-bold uppercase tracking-widest ">{t('No attachments found.')}</p>
 <p className="text-[10px] mt-2">{t('Drag files here to upload')}</p>
 </div>
 )}
 </div>
 </div>

 {previewFile && (
 <FilePreviewModal
 file={previewFile}
 isOpen={true}
 onClose={() => setPreviewFile(null)}
 />
 )}

 <ConfirmModal
 isOpen={!!fileToDelete}
 onClose={() => setFileToDelete(null)}
 onConfirm={handleDeleteFile}
 title={t('Delete Attachment')}
 message={t('Are you sure you want to delete this file? This action cannot be undone.')}
 processing={processing}
 variant="danger"
 />
 </>
 );
}
