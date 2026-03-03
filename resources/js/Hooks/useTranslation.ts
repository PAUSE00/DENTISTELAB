
import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    const { translations } = usePage().props as any;

    const t = (key: string): string => {
        return translations?.[key] || key;
    };

    return { t };
}
