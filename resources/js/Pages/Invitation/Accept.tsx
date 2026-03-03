import { Head, useForm } from '@inertiajs/react';
import { ShieldPlus, CheckCircle } from 'lucide-react';

interface Props {
    invitation: {
        id: number;
        token: string;
        lab_name: string;
        expires_at: string;
    };
}

export default function AcceptInvitation({ invitation }: Props) {
    const { post, processing } = useForm({});

    const handleAccept = () => {
        post(route('invitation.accept', invitation.token));
    };

    return (
        <>
            <Head title="Invitation" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-slate-700">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-6">
                        <ShieldPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">DentalLab</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Vous avez été invité(e) à rejoindre le réseau du laboratoire :</p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{invitation.lab_name}</p>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        En acceptant, vous pourrez passer des commandes et communiquer directement avec ce laboratoire.
                    </p>

                    <button
                        onClick={handleAccept}
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Accepter l'invitation
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                        Cette invitation expire le {new Date(invitation.expires_at).toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>
        </>
    );
}
