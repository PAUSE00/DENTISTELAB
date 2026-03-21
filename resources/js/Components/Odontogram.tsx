import React, { useState } from 'react';

interface OdontogramProps {
 selectedTeeth?: number[];
 toothTreatments?: Record<number, string>;
 onToggle?: (toothNumber: number) => void;
 onAssignTreatment?: (toothNumber: number, treatment: string | null) => void;
 readOnly?: boolean;
}

function ToothShape({ type, selected, hovered, treatment }: { type: string; selected: boolean; hovered: boolean; treatment?: string }) {
 let tFill = '#2dd4bf';
 let tStroke = '#0f766e';
 
 if (treatment === 'Crown') { tFill = '#f59e0b'; tStroke = '#b45309'; }
 else if (treatment === 'Implant') { tFill = '#3b82f6'; tStroke = '#1d4ed8'; }
 else if (treatment === 'Extraction') { tFill = '#ef4444'; tStroke = '#b91c1c'; }
 else if (treatment === 'Veneer') { tFill = '#d946ef'; tStroke = '#a21caf'; }
 else if (treatment === 'Bridge') { tFill = '#8b5cf6'; tStroke = '#6d28d9'; }

 const isActive = selected || !!treatment;
 const fill = isActive ? tFill : hovered ? '#f1f5f9' : '#ffffff';
 const fillBottom = isActive ? tStroke : '#cbd5e1';
 const stroke = isActive ? tStroke : '#94a3b8';
 
 // Precise bounds inside 100x100 relative viewBox
 const rW = type === 'molar' ? 88 : type === 'premolar' ? 70 : type === 'canine' ? 58 : type === 'incisor_central' ? 62 : 54;
 const rH = type === 'molar' ? 62 : type === 'premolar' ? 54 : type === 'canine' ? 76 : type === 'incisor_central' ? 88 : 78;
 const rx = type === 'molar' ? 24 : type === 'premolar' ? 27 : type === 'canine' ? 29 : type === 'incisor_central' ? 31 : 27;
 
 const x = 50 - rW / 2;
 const y = 50 - rH / 2;
 const depth = 11; // 3D block thickness
 
 return (
 <g>
 {/* Bottom 3D face */}
 <rect x={x} y={y + depth} width={rW} height={rH} rx={rx} fill={fillBottom} stroke={stroke} strokeWidth={2.5} />
 {/* Top face */}
 <rect x={x} y={y} width={rW} height={rH} rx={rx} fill={fill} stroke={stroke} strokeWidth={2.5} />
 
 {/* Soft highlight reflection */}
 <ellipse cx={50 - rW / 4 + 2} cy={50 - rH / 3 + 4} rx={rW / 5} ry={rH / 8} fill="#ffffff" opacity={isActive ? 0.35 : 0.7} />

 {/* Fissures/lines on top face */}
 {type === 'molar' && (
 <>
 <path d={`M 50 ${y + 12} V ${y + rH - 12}`} stroke={fillBottom} strokeWidth={3} strokeLinecap="round" />
 <path d={`M ${x + 18} ${50} Q 50 ${60} ${x + rW - 18} ${50}`} stroke={fillBottom} strokeWidth={2.5} fill="none" />
 </>
 )}
 {type === 'premolar' && (
 <path d={`M 50 ${y + 14} V ${y + rH - 14}`} stroke={fillBottom} strokeWidth={3} strokeLinecap="round" />
 )}

 {/* Extraction X */}
 {treatment === 'Extraction' && (
 <path d={`M ${x+10} ${y+10} L ${x+rW-10} ${y+rH-10} M ${x+rW-10} ${y+10} L ${x+10} ${y+rH-10}`} stroke="#ffffff" strokeWidth={6} strokeLinecap="round" />
 )}
 </g>
 );
}

const SZ: Record<string, [number, number]> = {
 molar: [32, 38],
 premolar: [24, 30],
 canine: [22, 32],
 incisor_central: [22, 36],
 incisor_lateral: [20, 32],
};

const UPPER = [
 { id: 18, t: 'molar', a: 185 }, { id: 17, t: 'molar', a: 196 },
 { id: 16, t: 'molar', a: 208 }, { id: 15, t: 'premolar', a: 220 },
 { id: 14, t: 'premolar', a: 232 }, { id: 13, t: 'canine', a: 243 },
 { id: 12, t: 'incisor_lateral', a: 254 }, { id: 11, t: 'incisor_central', a: 265 },
 { id: 21, t: 'incisor_central', a: 275 }, { id: 22, t: 'incisor_lateral', a: 286 },
 { id: 23, t: 'canine', a: 297 }, { id: 24, t: 'premolar', a: 308 },
 { id: 25, t: 'premolar', a: 320 }, { id: 26, t: 'molar', a: 332 },
 { id: 27, t: 'molar', a: 344 }, { id: 28, t: 'molar', a: 355 },
];

const LOWER = [
 { id: 48, t: 'molar', a: 175 }, { id: 47, t: 'molar', a: 164 },
 { id: 46, t: 'molar', a: 152 }, { id: 45, t: 'premolar', a: 140 },
 { id: 44, t: 'premolar', a: 128 }, { id: 43, t: 'canine', a: 117 },
 { id: 42, t: 'incisor_lateral', a: 106 }, { id: 41, t: 'incisor_central', a: 95 },
 { id: 31, t: 'incisor_central', a: 85 }, { id: 32, t: 'incisor_lateral', a: 74 },
 { id: 33, t: 'canine', a: 63 }, { id: 34, t: 'premolar', a: 52 },
 { id: 35, t: 'premolar', a: 40 }, { id: 36, t: 'molar', a: 28 },
 { id: 37, t: 'molar', a: 16 }, { id: 38, t: 'molar', a: 5 },
];

const TEETH = [...UPPER, ...LOWER];
const TREATMENTS = ['Crown', 'Implant', 'Extraction', 'Veneer', 'Bridge'];

export default function Odontogram({ selectedTeeth = [], toothTreatments = {}, onToggle, onAssignTreatment, readOnly = false }: OdontogramProps) {
 const [hov, setHov] = useState<number | null>(null);
 const [activeTooth, setActiveTooth] = useState<number | null>(null);

 const W = 420;
 const H = 460;
 const cx = W / 2;
 const cy = H / 2;
 const rx = 140;
 const ry = 180;

 const handleToothClick = (tooth: number) => {
 if (readOnly) return;
 if (onAssignTreatment) {
 setActiveTooth((prev) => (prev === tooth ? null : tooth));
 } else if (onToggle) {
 onToggle(tooth);
 }
 };

 return (
 <div className="relative" style={{ width: '100%', maxWidth: 420, margin: '0 auto', userSelect: 'none' }}>
 {activeTooth && (
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-white border rounded-xl shadow-2xl z-10 p-2 animate-fade-in-up">
 <div className="flex justify-between items-center mb-2 px-1">
 <span className="text-[11px] font-bold uppercase tracking-wider">Tooth {activeTooth}</span>
 <button type="button" onClick={() => setActiveTooth(null)} className=" hover: dark:hover: transition-colors pointer">&times;</button>
 </div>
 <div className="flex flex-col gap-1">
 {TREATMENTS.map(t => (
 <button type="button" key={t} onClick={() => { onAssignTreatment?.(activeTooth, t); setActiveTooth(null); }} className="text-left px-3 py-1.5 text-xs font-semibold rounded-md hover: dark:hover: transition-colors">
 {t}
 </button>
 ))}
 <div className="h-px my-1"></div>
 <button type="button" onClick={() => { onAssignTreatment?.(activeTooth, null); setActiveTooth(null); }} className="text-left px-3 py-1.5 text-xs font-bold rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
 Clear Treatment
 </button>
 </div>
 </div>
 )}

 <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
 {TEETH.map(tooth => {
 const rad = (tooth.a * Math.PI) / 180;
 const x = cx + rx * Math.cos(rad);
 const y = cy + ry * Math.sin(rad);

 const [tw, th] = SZ[tooth.t] ?? [24, 24];
 const isSelected = selectedTeeth.includes(tooth.id);
 const isHovered = hov === tooth.id;
 const treatment = toothTreatments[tooth.id];
 const rotDeg = tooth.a - 90;

 const L_OFFSET = 36;
 const lx = cx + (rx + L_OFFSET) * Math.cos(rad);
 const ly = cy + (ry + L_OFFSET) * Math.sin(rad);

 return (
 <g key={tooth.id}
 style={{ cursor: readOnly ? 'default' : 'pointer', filter: activeTooth && activeTooth !== tooth.id ? 'brightness(0.6) opacity(0.5)' : 'none', transition: 'all 0.3s' }}
 onClick={() => handleToothClick(tooth.id)}
 onMouseEnter={() => !readOnly && !activeTooth && setHov(tooth.id)}
 onMouseLeave={() => setHov(null)}>
 
 <g transform={`translate(${x},${y}) rotate(${rotDeg}) translate(${-tw / 2},${-th / 2}) scale(${tw / 100},${th / 100})`}>
 <ToothShape type={tooth.t} selected={isSelected} hovered={isHovered} treatment={treatment} />
 </g>

 <text x={lx} y={ly - (treatment ? 4 : 0)}
 textAnchor="middle" dominantBaseline="middle"
 fontSize={10.5} fontWeight={700}
 fill={(isSelected || treatment) ? (treatment ? '#e2e8f0' : '#2dd4bf') : 'rgba(148,163,184,0.8)'}
 style={{ fontFamily: 'system-ui, sans-serif', transition: 'fill 0.2s', pointerEvents: 'none' }}>
 {tooth.id}
 </text>
 
 {treatment && (
 <text x={lx} y={ly + 6}
 textAnchor="middle" dominantBaseline="middle"
 fontSize={6.5} fontWeight={800}
 fill={(isSelected || treatment) ? (treatment ? '#e2e8f0' : '#2dd4bf') : 'rgba(148,163,184,0.8)'}
 style={{ fontFamily: 'system-ui, sans-serif', transition: 'fill 0.2s', pointerEvents: 'none', opacity: 0.8, textTransform: 'uppercase' }}>
 {treatment.substring(0, 3)}
 </text>
 )}
 </g>
 );
 })}
 </svg>
 </div>
 );
}
