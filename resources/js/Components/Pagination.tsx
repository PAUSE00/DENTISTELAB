import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, key) => {
                let label = link.label;
                if (label.includes('&laquo;')) label = 'Previous';
                if (label.includes('&raquo;')) label = 'Next';

                return link.url === null ? (
                    <div
                        key={key}
                        className="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-sub rounded border border-transparent opacity-50 cursor-not-allowed"
                    >
                        {label === 'Previous' ? <ChevronLeft className="w-4 h-4" /> : label === 'Next' ? <ChevronRight className="w-4 h-4" /> : <div dangerouslySetInnerHTML={{ __html: label }} />}
                    </div>
                ) : (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-2 text-sm leading-4 rounded border focus:border-brand focus:text-brand transition-colors ${link.active
                                ? 'bg-brand text-text border-brand'
                                : 'bg-surface hover:bg-bg dark:bg-surface dark:hover:bg-sidebar text-text border-border'
                            }`}
                        href={link.url}
                    >
                        {label === 'Previous' ? <ChevronLeft className="w-4 h-4" /> : label === 'Next' ? <ChevronRight className="w-4 h-4" /> : <div dangerouslySetInnerHTML={{ __html: label }} />}
                    </Link>
                );
            })}
        </div>
    );
}
