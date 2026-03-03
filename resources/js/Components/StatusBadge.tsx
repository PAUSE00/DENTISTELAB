import { Check, Activity, Clock, Package, Truck, Flag, Archive, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type StatusType = 'order' | 'payment';

interface StatusConfig {
    label: string;
    icon: LucideIcon | null;
    classes: string;
}

interface Props {
    status: string;
    type?: StatusType;
    className?: string;
}

const orderConfigs: Record<string, StatusConfig> = {
    new: {
        label: 'Nouveau',
        icon: Check,
        classes: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    },
    in_progress: {
        label: 'En production',
        icon: Activity,
        classes: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
    },
    fitting: {
        label: 'Essayage',
        icon: Clock,
        classes: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
    },
    finished: {
        label: 'Terminé',
        icon: CheckCircle2,
        classes: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
    },
    shipped: {
        label: 'Expédié',
        icon: Truck,
        classes: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
    },
    delivered: {
        label: 'Livré',
        icon: Flag,
        classes: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
    },
    rejected: {
        label: 'Rejeté',
        icon: XCircle,
        classes: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
    },
    archived: {
        label: 'Archivé',
        icon: Archive,
        classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
    },
};

const paymentConfigs: Record<string, StatusConfig> = {
    paid: {
        label: 'Payé',
        icon: CheckCircle2,
        classes: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
    },
    partial: {
        label: 'Partiel',
        icon: Clock,
        classes: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    },
    unpaid: {
        label: 'Impayé',
        icon: AlertCircle,
        classes: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
    },
};

const defaultConfig: StatusConfig = {
    label: '',
    icon: null,
    classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
};

export default function StatusBadge({ status, type = 'order', className = '' }: Props) {
    const configs = type === 'order' ? orderConfigs : paymentConfigs;
    const config = configs[status] || { ...defaultConfig, label: status };
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.classes} ${className}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {config.label}
        </span>
    );
}
