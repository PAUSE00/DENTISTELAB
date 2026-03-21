export default function SkeletonLoader({ className = '', count = 1 }: { className?: string, count?: number }) {
 if (count > 1) {
 return (
 <>
 {Array.from({ length: count }).map((_, i) => (
 <div key={i} className={`animate-pulse rounded ${className}`} />
 ))}
 </>
 );
 }

 return <div className={`animate-pulse rounded ${className}`} />;
}
