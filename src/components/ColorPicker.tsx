'use client';

import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, Pipette } from 'lucide-react';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#F87171', '#FB923C', '#FACC15',
    '#4ADE80', '#38BDF8', '#818CF8', '#C084FC', '#F472B6'
];

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 relative" ref={popoverRef}>
            <span className="text-xs text-white/60 font-medium">{label}</span>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 bg-black/20 border border-white/10 rounded-lg hover:border-purple-500/50 transition-all group w-full"
            >
                <div
                    className="w-8 h-8 rounded-md border border-white/10 shadow-sm"
                    style={{ backgroundColor: color }}
                />
                <span className="flex-1 text-left text-sm font-mono text-white/80 group-hover:text-white uppercase">
                    {color}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-full sm:w-64 animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-4">
                        <HexColorPicker color={color} onChange={onChange} style={{ width: '100%', height: '150px' }} />
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {PRESET_COLORS.map((preset) => (
                            <button
                                key={preset}
                                className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                                style={{ backgroundColor: preset }}
                                onClick={() => onChange(preset)}
                                title={preset}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-white/40">#</span>
                        <input
                            type="text"
                            value={color.replace('#', '')}
                            onChange={(e) => onChange(`#${e.target.value}`)}
                            className="w-full bg-transparent text-sm text-white font-mono outline-none uppercase"
                            maxLength={6}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
