import React, { useState } from 'react';

interface OdontogramProps {
    selectedTeeth?: number[];
    onToggle?: (toothNumber: number) => void;
    readOnly?: boolean;
}

function ToothShape({ type, selected, hovered, id }: { type: string; selected: boolean; hovered: boolean; id: number }) {
    // Beautiful 3D pill coloring
    const fill = selected ? '#2dd4bf' : hovered ? '#f1f5f9' : '#ffffff';
    const fillBottom = selected ? '#0f766e' : '#cbd5e1';
    const stroke = selected ? '#0f766e' : '#94a3b8';
    
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
            <ellipse cx={50 - rW / 4 + 2} cy={50 - rH / 3 + 4} rx={rW / 5} ry={rH / 8} fill="#ffffff" opacity={selected ? 0.35 : 0.7} />

            {/* Fissures/lines on top face to differentiate teeth types */}
            {type === 'molar' && (
                <>
                    <path d={`M 50 ${y + 12} V ${y + rH - 12}`} stroke={fillBottom} strokeWidth={3} strokeLinecap="round" />
                    <path d={`M ${x + 18} ${50} Q 50 ${60} ${x + rW - 18} ${50}`} stroke={fillBottom} strokeWidth={2.5} fill="none" />
                </>
            )}
            {type === 'premolar' && (
                <path d={`M 50 ${y + 14} V ${y + rH - 14}`} stroke={fillBottom} strokeWidth={3} strokeLinecap="round" />
            )}
        </g>
    );
}

// Fixed dimensions in pixels per tooth
const SZ: Record<string, [number, number]> = {
    molar:           [32, 38],
    premolar:        [24, 30],
    canine:          [22, 32],
    incisor_central: [22, 36],
    incisor_lateral: [20, 32],
};

// Angles for the perfect, single continuous horseshoe curve
const UPPER = [
    { id: 18, t: 'molar',           a: 185 },
    { id: 17, t: 'molar',           a: 196 },
    { id: 16, t: 'molar',           a: 208 },
    { id: 15, t: 'premolar',        a: 220 },
    { id: 14, t: 'premolar',        a: 232 },
    { id: 13, t: 'canine',          a: 243 },
    { id: 12, t: 'incisor_lateral', a: 254 },
    { id: 11, t: 'incisor_central', a: 265 },
    { id: 21, t: 'incisor_central', a: 275 },
    { id: 22, t: 'incisor_lateral', a: 286 },
    { id: 23, t: 'canine',          a: 297 },
    { id: 24, t: 'premolar',        a: 308 },
    { id: 25, t: 'premolar',        a: 320 },
    { id: 26, t: 'molar',           a: 332 },
    { id: 27, t: 'molar',           a: 344 },
    { id: 28, t: 'molar',           a: 355 },
];

const LOWER = [
    { id: 48, t: 'molar',           a: 175 },
    { id: 47, t: 'molar',           a: 164 },
    { id: 46, t: 'molar',           a: 152 },
    { id: 45, t: 'premolar',        a: 140 },
    { id: 44, t: 'premolar',        a: 128 },
    { id: 43, t: 'canine',          a: 117 },
    { id: 42, t: 'incisor_lateral', a: 106 },
    { id: 41, t: 'incisor_central', a: 95 },
    { id: 31, t: 'incisor_central', a: 85 },
    { id: 32, t: 'incisor_lateral', a: 74 },
    { id: 33, t: 'canine',          a: 63 },
    { id: 34, t: 'premolar',        a: 52 },
    { id: 35, t: 'premolar',        a: 40 },
    { id: 36, t: 'molar',           a: 28 },
    { id: 37, t: 'molar',           a: 16 },
    { id: 38, t: 'molar',           a: 5 },
];

const TEETH = [...UPPER, ...LOWER];

export default function Odontogram({ selectedTeeth = [], onToggle, readOnly = false }: OdontogramProps) {
    const [hov, setHov] = useState<number | null>(null);

    // Bounding canvas
    const W = 420;
    const H = 460;
    const cx = W / 2;
    const cy = H / 2;

    // Radii of the perfect oval
    const rx = 140;
    const ry = 180;

    return (
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', userSelect: 'none' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                
                {/* Optional subtle trace of the arch
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                */}

                {TEETH.map(tooth => {
                    // Convert degrees to radians (0° is 3 o'clock, 90° is bottom in SVG)
                    const rad = (tooth.a * Math.PI) / 180;
                    
                    // Center point of the tooth on the arch
                    const x = cx + rx * Math.cos(rad);
                    const y = cy + ry * Math.sin(rad);

                    // Size scaling
                    const [tw, th] = SZ[tooth.t] ?? [24, 24];
                    const isSelected = selectedTeeth.includes(tooth.id);
                    const isHovered = hov === tooth.id;

                    // Crown Rotation: We want SVG's UP (y=-1, which is -90°) to point inwards to `cx,cy`
                    // Radially inward is `a - 180`. So `-90 => a - 180` means rotation = `a - 90`.
                    const rotDeg = tooth.a - 90;

                    // Label offset radially outward
                    const L_OFFSET = 36;
                    const lx = cx + (rx + L_OFFSET) * Math.cos(rad);
                    const ly = cy + (ry + L_OFFSET) * Math.sin(rad);

                    return (
                        <g key={tooth.id}
                            style={{ cursor: readOnly ? 'default' : 'pointer' }}
                            onClick={() => !readOnly && onToggle?.(tooth.id)}
                            onMouseEnter={() => !readOnly && setHov(tooth.id)}
                            onMouseLeave={() => setHov(null)}>
                            
                            {/* Tooth Wrapper */}
                            <g transform={`translate(${x},${y}) rotate(${rotDeg}) translate(${-tw / 2},${-th / 2}) scale(${tw / 100},${th / 100})`}>
                                <ToothShape type={tooth.t} selected={isSelected} hovered={isHovered} id={tooth.id} />
                            </g>

                            {/* Standard Number Plate */}
                            <text x={lx} y={ly}
                                textAnchor="middle" dominantBaseline="middle"
                                fontSize={10.5} fontWeight={700}
                                fill={isSelected ? '#2dd4bf' : 'rgba(148,163,184,0.8)'}
                                style={{ fontFamily: 'system-ui, sans-serif', transition: 'fill 0.2s', pointerEvents: 'none' }}>
                                {tooth.id}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
