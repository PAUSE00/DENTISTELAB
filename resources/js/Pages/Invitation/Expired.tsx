import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

interface Props { labName: string; }

export default function ExpiredInvitation({ labName }: Props) {
 return (
 <>
 <Head title="Invitation expirée" />
 <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
 <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border ">
 <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-6">
 <XCircle className="w-8 h-8" />
 </div>
 <h1 className="text-xl font-bold dark:text-white mb-2">Invitation expirée</h1>
 <p className=" mb-6">
 L'invitation du laboratoire <strong>{labName}</strong> a expiré.
 Veuillez contacter le laboratoire pour une nouvelle invitation.
 </p>
 <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
 Retour à l'accueil
 </Link>
 </div>
 </div>
 </>
 );
}
