import React from 'react';

interface TooltipPayload {
 name: string;
 value: number;
 color: string;
 dataKey: string;
}

interface CustomTooltipProps {
 active?: boolean;
 payload?: TooltipPayload[];
 label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
 if (!active || !payload?.length) return null;

 return (
 <div className="bg-white rounded-2xl shadow-2xl border p-4 min-w-[180px]">
 <p className="text-[10px] font-black uppercase tracking-widest mb-3">{label}</p>
 <div className="space-y-2">
 {payload.map((entry, index) => (
 <div key={index} className="flex items-center justify-between gap-4">
 <div className="flex items-center gap-2">
 <div
 className="w-2.5 h-2.5 rounded-full shadow-sm"
 style={{ backgroundColor: entry.color }}
 />
 <span className="text-xs font-bold capitalize">
 {entry.name}
 </span>
 </div>
 <span className="text-sm font-black dark:text-white tracking-tight">
 {typeof entry.value === 'number'
 ? entry.dataKey === 'revenue' || entry.dataKey === 'spend'
 ? `${entry.value.toLocaleString()} DH`
 : entry.value.toLocaleString()
 : entry.value
 }
 </span>
 </div>
 ))}
 </div>
 </div>
 );
};

export default CustomTooltip;
