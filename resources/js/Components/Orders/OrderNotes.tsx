import { useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, Check, Trash2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/Components/ConfirmModal';
import { OrderNote } from '@/types/order';

interface OrderNotesProps {
 orderId: number;
 notes: OrderNote[];
}

export default function OrderNotes({ orderId, notes }: OrderNotesProps) {
 const { t } = useTranslation();
 const [processing, setProcessing] = useState(false);
 const [noteContent, setNoteContent] = useState('');
 const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

 const handleAddNote = (e: React.FormEvent) => {
 e.preventDefault();
 if (!noteContent.trim()) return;
 setProcessing(true);
 router.post(route('orders.notes.store', orderId), {
 content: noteContent
 }, {
 preserveScroll: true,
 onSuccess: () => {
 setNoteContent('');
 toast.success(t('Note added'));
 },
 onFinish: () => setProcessing(false)
 });
 };

 const handleDeleteNote = () => {
 if (!deletingNoteId) return;
 setProcessing(true);
 router.delete(route('orders.notes.destroy', [orderId, deletingNoteId]), {
 preserveScroll: true,
 onSuccess: () => {
 setDeletingNoteId(null);
 toast.success(t('Note deleted'));
 },
 onFinish: () => setProcessing(false)
 });
 };

 return (
 <>
 <div className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-400">
 <h3 className="text-xs font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
 <FileText className="w-4 h-4 text-amber-500" />
 {t('Internal Lab Notes')}
 <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">
 {notes?.length || 0}
 </span>
 </h3>

 <form onSubmit={handleAddNote} className="mb-6">
 <div className="relative group">
 <textarea
 value={noteContent}
 onChange={(e) => setNoteContent(e.target.value)}
 placeholder={t('Add internal note for the team...')}
 className="w-full border rounded-xl p-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-[100px] resize-none"
 />
 <button
 type="submit"
 disabled={processing || !noteContent.trim()}
 className="absolute bottom-3 right-3 p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:translate-y-0 transform hover:-translate-y-0.5"
 >
 <Check className="w-4 h-4" />
 </button>
 </div>
 </form>

 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
 {notes && notes.length > 0 ? (
 notes.map((note) => (
 <div key={note.id} className="relative group p-4 bg-white/50 rounded-xl border hover:border-amber-200 dark:hover:border-amber-900/30 transition-all">
 <div className="flex justify-between items-start mb-2">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold">
 {note.user.name[0]}
 </div>
 <span className="text-xs font-bold ">{note.user.name}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] ">{new Date(note.created_at).toLocaleDateString()}</span>
 <button
 onClick={() => setDeletingNoteId(note.id)}
 className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
 </div>
 ))
 ) : (
 <div className="text-center py-6 border-2 border-dashed rounded-2xl">
 <p className="text-xs italic">{t('No internal notes yet.')}</p>
 </div>
 )}
 </div>
 </div>

 <ConfirmModal
 isOpen={!!deletingNoteId}
 onClose={() => setDeletingNoteId(null)}
 onConfirm={handleDeleteNote}
 title={t('Delete Note')}
 message={t('Are you sure you want to delete this internal note?')}
 processing={processing}
 variant="danger"
 />
 </>
 );
}
