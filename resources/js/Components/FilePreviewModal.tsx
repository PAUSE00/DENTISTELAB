import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, Box, Image as ImageIcon } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface FileInfo {
 id: number;
 name: string;
 path: string;
 type: string;
 size: number;
}

interface Props {
 file: FileInfo;
 isOpen: boolean;
 onClose: () => void;
}

export default function FilePreviewModal({ file, isOpen, onClose }: Props) {
 const { t } = useTranslation();
 const [zoom, setZoom] = useState(1);
 const [rotation, setRotation] = useState(0);

 if (!isOpen) return null;

 const fileUrl = `/storage/${file.path}`;
 const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name) || file.type?.startsWith('image/');
 const isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
 const isStl = /\.stl$/i.test(file.name);

 const formatSize = (bytes: number) => {
 if (bytes < 1024) return `${bytes} B`;
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
 return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
 };

 const handleBackdropClick = (e: React.MouseEvent) => {
 if (e.target === e.currentTarget) onClose();
 };

 return (
 <div
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
 onClick={handleBackdropClick}
 >
 {/* Header Bar */}
 <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
 <div className="flex items-center justify-between max-w-7xl mx-auto">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
 {isImage ? <ImageIcon className="w-5 h-5 text-white" /> :
 isPdf ? <FileText className="w-5 h-5 text-white" /> :
 isStl ? <Box className="w-5 h-5 text-white" /> :
 <FileText className="w-5 h-5 text-white" />}
 </div>
 <div>
 <p className="text-white font-bold text-sm truncate max-w-xs">{file.name}</p>
 <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">{formatSize(file.size)}</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 {isImage && (
 <>
 <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md" title={t('Zoom In')}>
 <ZoomIn className="w-4 h-4" />
 </button>
 <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.25))} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md" title={t('Zoom Out')}>
 <ZoomOut className="w-4 h-4" />
 </button>
 <button onClick={() => setRotation(r => r + 90)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md" title={t('Rotate')}>
 <RotateCw className="w-4 h-4" />
 </button>
 </>
 )}
 <a href={fileUrl} download className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md" title={t('Download')}>
 <Download className="w-4 h-4" />
 </a>
 <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-xl transition-all backdrop-blur-md" title={t('Close')}>
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="w-full h-full flex items-center justify-center p-16">
 {isImage && (
 <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
 <img
 src={fileUrl}
 alt={file.name}
 className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
 style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
 />
 </div>
 )}

 {isPdf && (
 <iframe
 src={fileUrl}
 className="w-full h-full max-w-5xl rounded-2xl shadow-2xl bg-white"
 title={file.name}
 />
 )}

 {isStl && (
 <div className="bg-white rounded-3xl p-8 max-w-lg text-center shadow-2xl">
 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
 <Box className="w-10 h-10 text-white" />
 </div>
 <h3 className="text-lg font-black dark:text-white">{t('3D Model File')}</h3>
 <p className="text-sm mt-2">{file.name}</p>
 <p className="text-xs mt-1">{formatSize(file.size)}</p>
 <a
 href={fileUrl}
 download
 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all"
 >
 <Download className="w-4 h-4" />
 {t('Download 3D Model')}
 </a>
 </div>
 )}

 {!isImage && !isPdf && !isStl && (
 <div className="bg-white rounded-3xl p-8 max-w-lg text-center shadow-2xl">
 <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
 <FileText className="w-10 h-10 text-white" />
 </div>
 <h3 className="text-lg font-black dark:text-white">{file.name}</h3>
 <p className="text-xs mt-1">{formatSize(file.size)} • {file.type || t('Unknown type')}</p>
 <a
 href={fileUrl}
 download
 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all"
 >
 <Download className="w-4 h-4" />
 {t('Download File')}
 </a>
 </div>
 )}
 </div>
 </div>
 );
}
