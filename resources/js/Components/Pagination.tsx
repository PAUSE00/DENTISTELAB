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
 <div className="flex items-center gap-1">
 {links.map((link, key) => {
 let label = link.label;
 const isPrev = label.includes('&laquo;');
 const isNext = label.includes('&raquo;');

 const baseStyle: React.CSSProperties = {
 display: 'inline-flex',
 alignItems: 'center',
 justifyContent: 'center',
 minWidth: isPrev || isNext ? '32px' : '32px',
 height: '32px',
 padding: isPrev || isNext ? '0 8px' : '0',
 borderRadius: '8px',
 fontSize: '12.5px',
 fontWeight: 500,
 transition: 'all 0.15s',
 cursor: link.url ? 'pointer' : 'not-allowed',
 opacity: link.url ? 1 : 0.35,
 };

 const activeStyle: React.CSSProperties = {
 ...baseStyle,
 background: 'var(--teal)',
 color: 'var(--bg)',
 fontWeight: 700,
 boxShadow: '0 0 10px rgba(96,221,198,0.35)',
 };

 const inactiveStyle: React.CSSProperties = {
 ...baseStyle,
 background: 'var(--surface)',
 color: 'var(--txt-2)',
 border: '1px solid var(--border)',
 };

 const content = isPrev
 ? <ChevronLeft size={14} />
 : isNext
 ? <ChevronRight size={14} />
 : <span dangerouslySetInnerHTML={{ __html: label }} />;

 if (!link.url) {
 return (
 <div key={key} style={inactiveStyle}>
 {content}
 </div>
 );
 }

 return (
 <Link key={key} href={link.url}
 style={link.active ? activeStyle : inactiveStyle}
 onMouseEnter={e => {
 if (!link.active) {
 e.currentTarget.style.borderColor = 'var(--teal-20)';
 e.currentTarget.style.color = 'var(--txt-accent)';
 e.currentTarget.style.background = 'var(--teal-10)';
 }
 }}
 onMouseLeave={e => {
 if (!link.active) {
 e.currentTarget.style.borderColor = 'var(--border)';
 e.currentTarget.style.color = 'var(--txt-2)';
 e.currentTarget.style.background = 'var(--surface)';
 }
 }}>
 {content}
 </Link>
 );
 })}
 </div>
 );
}
