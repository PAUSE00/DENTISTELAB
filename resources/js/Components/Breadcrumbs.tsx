import { Link } from '@inertiajs/react';

interface BreadcrumbItem {
 label: string;
 href?: string;
}

interface Props {
 items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
 return (
 <nav className="flex" aria-label="Breadcrumb">
 <ol className="inline-flex items-center space-x-1 md:space-x-3">
 {items.map((item, index) => (
 <li key={index} className="inline-flex items-center">
 {index > 0 && (
 <svg className="w-3 h-3 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
 </svg>
 )}
 {item.href ? (
 <Link
 href={item.href}
 className={`inline-flex items-center text-sm font-medium hover:text-blue-600 dark:hover:text-white ${index === 0 ? '' : 'ml-1 md:ml-2'}`}
 >
 {item.label}
 </Link>
 ) : (
 <span className="ml-1 text-sm font-medium md:ml-2 ">
 {item.label}
 </span>
 )}
 </li>
 ))}
 </ol>
 </nav>
 );
}
