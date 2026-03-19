import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, Paperclip, Upload, Download, Eye, Trash2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/Components/ConfirmModal';
import FilePreviewModal from '@/Components/FilePreviewModal';
import { OrderFile } from '@/types/order';

interface OrderAttachmentsProps {
    orderId: number;
    files: OrderFile[];
    uploadRoute: string;
    deleteRoute: (orderId: number, fileId: number) => string;
    onViewStl?: (url: string) => void;
}

export default function OrderAttachments({ orderId, files, uploadRoute, deleteRoute, onViewStl }: OrderAttachmentsProps) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<number | null>(null);
    const [previewFile, setPreviewFile] = useState<OrderFile | null>(null);
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
                className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-400 transition-all border-2"
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
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 uppercase tracking-wider">
                        <Paperclip className="w-4 h-4 text-primary-500" />
                        {t('Attachments')}
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">{files.length}</span>
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

                {files && files.length > 0 ? (
                    <div className="space-y-2.5">
                        {files.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-700/50 group hover:border-gray-300 dark:hover:border-slate-600 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary-500 dark:text-primary-400 flex items-center justify-center shadow-sm">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{file.name}</p>
                                        <span className="text-[10px] text-gray-400 font-medium font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {file.name.toLowerCase().endsWith('.stl') && onViewStl ? (
                                        <button onClick={() => onViewStl(`/storage/${file.path}`)} className="p-2 text-primary-500 hover:text-primary-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-900/50 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-sm" title={t('View 3D Model')}>
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button onClick={() => setPreviewFile(file)} className="p-2 text-primary-500 hover:text-primary-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-900/50 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-sm" title={t('Preview File')}>
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}
                                    <a href={`/storage/${file.path}`} target="_blank" className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-all hover:bg-white dark:hover:bg-slate-800" title={t('Download')}>
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => setFileToDelete(file.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm"
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
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{t('No attachments found.')}</p>
                        <p className="text-[10px] text-gray-400 mt-2">{t('Drag files here to upload')}</p>
                    </div>
                )}
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
