import React from 'react';
import classNames from 'classnames';

interface OdontogramProps {
    selectedTeeth?: number[];
    onToggle?: (toothNumber: number) => void;
    readOnly?: boolean;
}

const getToothShape = (type: string, isSelected: boolean) => {
    const baseClasses = "transition-all duration-300";
    // Transparent fill, very thin dark slate lines. Selected is filled.
    const shapeClasses = isSelected
        ? "fill-primary-500/20 stroke-primary-500 dark:fill-primary-500/20 dark:stroke-primary-500"
        : "fill-transparent stroke-slate-500 dark:stroke-slate-500 hover:stroke-slate-400 dark:hover:stroke-slate-400";

    const lineClasses = isSelected
        ? "stroke-primary-500 dark:stroke-primary-500"
        : "stroke-slate-500 dark:stroke-slate-500";

    if (type === 'incisor_central') {
        return <ellipse cx="50" cy="50" rx="30" ry="38" className={classNames(baseClasses, shapeClasses)} strokeWidth="2" />;
    }
    if (type === 'incisor_lateral') {
        return <ellipse cx="50" cy="50" rx="25" ry="32" className={classNames(baseClasses, shapeClasses)} strokeWidth="2" />;
    }
    if (type === 'canine') {
        return (
            <g>
                <ellipse cx="50" cy="50" rx="28" ry="35" className={classNames(baseClasses, shapeClasses)} strokeWidth="2" />
                <path d="M 50 35 L 50 65" className={lineClasses} strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }
    if (type === 'premolar') {
        return (
            <g>
                <ellipse cx="50" cy="50" rx="32" ry="32" className={classNames(baseClasses, shapeClasses)} strokeWidth="2" />
                <path d="M 35 35 L 65 65" className={lineClasses} strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }
    // Molar - pure rounded square with the fence pattern
    return (
        <g>
            <rect x="18" y="18" width="64" height="64" rx="20" className={classNames(baseClasses, shapeClasses)} strokeWidth="2" />
            {/* Central vertical straight line */}
            <path d="M 50 25 V 75" className={lineClasses} strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Two horizontal curves curving inward slightly */}
            <path d="M 32 40 Q 50 45 68 40 M 32 60 Q 50 55 68 60" className={lineClasses} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
    );
};

const ToothArchItem = React.memo(({
    number, dx, y, r, type, isSelected, isReadOnly, onToggle
}: {
    number: number; dx: number; y: number; r: number; type: string; isSelected: boolean; isReadOnly: boolean; onToggle: () => void;
}) => {
    return (
        <div
            className={classNames(
                "absolute flex items-center justify-center transition-all duration-300 group",
                isReadOnly ? "cursor-default" : "cursor-pointer"
            )}
            style={{
                left: `calc(50% + ${dx}%)`,
                top: `${y}%`,
                transform: `translate(-50%, -50%)`,
            }}
            onClick={() => !isReadOnly && onToggle()}
        >
            <div
                className="relative flex items-center justify-center transition-all duration-300"
                style={{ transform: `rotate(${r}deg)` }}
            >
                {/* Push numbers much further outside */}
                <div className="absolute -top-6 sm:-top-8 md:-top-10 flex items-center justify-center origin-center">
                    <span
                        className={classNames(
                            "font-bold text-[9px] sm:text-[10px] md:text-xs transition-colors duration-300 tracking-wide",
                            isSelected ? "text-primary-500 scale-110" : "text-slate-500 group-hover:text-slate-400"
                        )}
                        style={{ transform: `rotate(${-r}deg)` }}
                    >
                        {number}
                    </span>
                </div>
                <div
                    className={classNames(
                        "relative transition-all duration-300",
                        // Scaled down sizes significantly
                        type === 'molar' ? "w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" :
                            type === 'premolar' ? "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" :
                                type === 'canine' ? "w-4 h-5 sm:w-5 sm:h-6 md:w-6 md:h-7" :
                                    type === 'incisor_central' ? "w-5 h-6 sm:w-6 sm:h-7 md:w-7 md:h-8" :
                                        "w-3 h-5 sm:w-4 sm:h-6 md:w-5 md:h-7", // incisor_lateral
                        !isReadOnly && "hover:scale-110",
                        isSelected ? "scale-110 z-10" : "z-0"
                    )}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {getToothShape(type, isSelected)}
                    </svg>
                </div>
            </div>
        </div>
    );
});

export default function Odontogram({
    selectedTeeth = [],
    onToggle,
    readOnly = false
}: OdontogramProps) {

    const handleToggle = (tooth: number) => {
        if (readOnly || !onToggle) return;
        onToggle(tooth);
    };

    // Adjusted positions to create a slightly wider, more parabolic U-shape
    const UPPER_ARCH = [
        { id: 18, type: 'molar', dx: -46, y: 92, r: -100 },
        { id: 17, type: 'molar', dx: -47, y: 72, r: -90 },
        { id: 16, type: 'molar', dx: -45, y: 52, r: -75 },
        { id: 15, type: 'premolar', dx: -38, y: 35, r: -55 },
        { id: 14, type: 'premolar', dx: -30, y: 22, r: -40 },
        { id: 13, type: 'canine', dx: -21, y: 12, r: -25 },
        { id: 12, type: 'incisor_lateral', dx: -12, y: 6, r: -10 },
        { id: 11, type: 'incisor_central', dx: -4, y: 4, r: -2 },

        { id: 21, type: 'incisor_central', dx: 4, y: 4, r: 2 },
        { id: 22, type: 'incisor_lateral', dx: 12, y: 6, r: 10 },
        { id: 23, type: 'canine', dx: 21, y: 12, r: 25 },
        { id: 24, type: 'premolar', dx: 30, y: 22, r: 40 },
        { id: 25, type: 'premolar', dx: 38, y: 35, r: 55 },
        { id: 26, type: 'molar', dx: 45, y: 52, r: 75 },
        { id: 27, type: 'molar', dx: 47, y: 72, r: 90 },
        { id: 28, type: 'molar', dx: 46, y: 92, r: 100 },
    ];

    const LOWER_ARCH = [
        { id: 48, type: 'molar', dx: -43, y: 8, r: -80 },
        { id: 47, type: 'molar', dx: -44, y: 28, r: -90 },
        { id: 46, type: 'molar', dx: -42, y: 48, r: -105 },
        { id: 45, type: 'premolar', dx: -35, y: 65, r: -120 },
        { id: 44, type: 'premolar', dx: -27, y: 78, r: -140 },
        { id: 43, type: 'canine', dx: -18, y: 88, r: -155 },
        { id: 42, type: 'incisor_lateral', dx: -9, y: 94, r: -170 },
        { id: 41, type: 'incisor_central', dx: -3, y: 96, r: -178 },

        { id: 31, type: 'incisor_central', dx: 3, y: 96, r: 178 },
        { id: 32, type: 'incisor_lateral', dx: 9, y: 94, r: 170 },
        { id: 33, type: 'canine', dx: 18, y: 88, r: 155 },
        { id: 34, type: 'premolar', dx: 27, y: 78, r: 140 },
        { id: 35, type: 'premolar', dx: 35, y: 65, r: 120 },
        { id: 36, type: 'molar', dx: 42, y: 48, r: 105 },
        { id: 37, type: 'molar', dx: 44, y: 28, r: 90 },
        { id: 38, type: 'molar', dx: 43, y: 8, r: 80 },
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center relative pt-12 pb-14 px-8 select-none">
            {/* Container max-width controls the overall size of the chart */}
            <div className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[360px] mx-auto flex flex-col gap-4 sm:gap-6">

                {/* UPPER ARCH */}
                <div className="relative w-full aspect-[5/3.2]">
                    {UPPER_ARCH.map(tooth => (
                        <ToothArchItem
                            key={tooth.id}
                            number={tooth.id}
                            dx={tooth.dx}
                            y={tooth.y}
                            r={tooth.r}
                            type={tooth.type}
                            isSelected={selectedTeeth.includes(tooth.id)}
                            isReadOnly={readOnly}
                            onToggle={() => handleToggle(tooth.id)}
                        />
                    ))}
                </div>

                {/* LOWER ARCH */}
                <div className="relative w-full aspect-[5/3.2]">
                    {LOWER_ARCH.map(tooth => (
                        <ToothArchItem
                            key={tooth.id}
                            number={tooth.id}
                            dx={tooth.dx}
                            y={tooth.y}
                            r={tooth.r}
                            type={tooth.type}
                            isSelected={selectedTeeth.includes(tooth.id)}
                            isReadOnly={readOnly}
                            onToggle={() => handleToggle(tooth.id)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
