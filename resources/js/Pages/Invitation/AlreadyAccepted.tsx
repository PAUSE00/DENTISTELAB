import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

interface Props { labName: string; }

export default function AlreadyAccepted({ labName }: Props) {
    return (
        <>
            <Head title="Invitation déjà acceptée" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-slate-700">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Déjà connecté(e)</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Vous êtes déjà connecté(e) au laboratoire <strong>{labName}</strong>.
                    </p>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Aller au tableau de bord
                    </Link>
                </div>
            </div>
        </>
    );
}
