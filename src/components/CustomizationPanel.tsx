'use client';

import { useState, useRef } from 'react';
import { Settings, ChevronDown, Image, Palette, Shield, Maximize2 } from 'lucide-react';
import { QRConfig } from '@/types';

interface CustomizationPanelProps {
    config: QRConfig;
    onConfigChange: (config: QRConfig) => void;
    onLogoChange: (logo: string | null) => void;
    logoPreview: string | null;
}

const DOT_STYLES = [
    { value: 'rounded', label: 'Arredondado' },
    { value: 'dots', label: 'Círculos' },
    { value: 'classy', label: 'Clássico' },
    { value: 'classy-rounded', label: 'Clássico Arredondado' },
    { value: 'square', label: 'Quadrado' },
    { value: 'extra-rounded', label: 'Extra Arredondado' },
];

const CORNER_STYLES = [
    { value: 'extra-rounded', label: 'Extra Arredondado' },
    { value: 'dot', label: 'Círculo' },
    { value: 'square', label: 'Quadrado' },
];

const ERROR_LEVELS = [
    { value: 'L', label: 'L (7%)' },
    { value: 'M', label: 'M (15%)' },
    { value: 'Q', label: 'Q (25%)' },
    { value: 'H', label: 'H (30%)' },
];

export default function CustomizationPanel({
    config,
    onConfigChange,
    onLogoChange,
    logoPreview,
}: CustomizationPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target?.result as string;

            // Optimize logo
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxSize = 150;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                }

                const optimizedDataUrl = canvas.toDataURL('image/png', 0.85);
                onLogoChange(optimizedDataUrl);

                // Auto-set high error correction when logo is added
                onConfigChange({ ...config, errorCorrectionLevel: 'H' });
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const updateConfig = (key: keyof QRConfig, value: string | number) => {
        onConfigChange({ ...config, [key]: value });
    };

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium 
          text-white/70 bg-white/[0.03] border border-white/[0.08] rounded-lg cursor-pointer
          transition-all duration-200 hover:bg-white/[0.06] hover:border-purple-500/40 hover:text-white
          ${isOpen ? 'bg-white/[0.06] border-purple-500 rounded-b-none' : ''}`}
            >
                <div className="flex items-center gap-2">
                    <Settings className="w-[18px] h-[18px] text-purple-400" />
                    Personalização
                </div>
                <ChevronDown className={`w-[18px] h-[18px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 bg-white/[0.03] border border-purple-500 border-t-0 rounded-b-lg animate-in slide-in-from-top-2 duration-200">
                    {/* Logo Upload */}
                    <div className="mb-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <Image className="w-4 h-4 text-purple-400" />
                            Logo Central
                        </label>
                        <div className="flex gap-3 items-start">
                            <div
                                className={`w-20 h-20 flex items-center justify-center bg-white/[0.03] 
                  border-2 border-dashed rounded-lg overflow-hidden transition-all
                  ${logoPreview ? 'border-solid border-purple-500' : 'border-white/[0.08] hover:border-purple-500'}`}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Image className="w-6 h-6 text-white/30" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-400 
                    bg-purple-500/10 border border-purple-500/30 rounded-md hover:bg-purple-500/20 transition-all"
                                >
                                    Carregar
                                </button>
                                {logoPreview && (
                                    <button
                                        onClick={() => onLogoChange(null)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 
                      bg-red-500/10 border border-red-500/30 rounded-md hover:bg-red-500/20 transition-all"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Margin */}
                    <div className="mb-5">
                        <label className="flex items-center justify-between text-sm font-medium text-white/70 mb-3">
                            <span>Margem</span>
                            <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded">
                                {config.margin}px
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={config.margin}
                            onChange={(e) => updateConfig('margin', parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Dot Style */}
                    <div className="mb-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            Estilo dos Pontos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {DOT_STYLES.map((style) => (
                                <button
                                    key={style.value}
                                    onClick={() => updateConfig('dotStyle', style.value)}
                                    className={`px-3 py-2 text-xs font-medium rounded-md border transition-all
                    ${config.dotStyle === style.value
                                            ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                                            : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-purple-500/40'}`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Corner Style */}
                    <div className="mb-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            Estilo dos Cantos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CORNER_STYLES.map((style) => (
                                <button
                                    key={style.value}
                                    onClick={() => updateConfig('cornerStyle', style.value)}
                                    className={`px-3 py-2 text-xs font-medium rounded-md border transition-all
                    ${config.cornerStyle === style.value
                                            ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                                            : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-purple-500/40'}`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="mb-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <Palette className="w-4 h-4 text-purple-400" />
                            Cores
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-white/40">Pontos</span>
                                <div className="flex items-center gap-2 p-2 bg-white/[0.03] border border-white/[0.08] rounded-md">
                                    <input
                                        type="color"
                                        value={config.dotColor}
                                        onChange={(e) => updateConfig('dotColor', e.target.value)}
                                    />
                                    <span className="text-xs text-white/40 font-mono">{config.dotColor}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-white/40">Cantos</span>
                                <div className="flex items-center gap-2 p-2 bg-white/[0.03] border border-white/[0.08] rounded-md">
                                    <input
                                        type="color"
                                        value={config.cornerColor}
                                        onChange={(e) => updateConfig('cornerColor', e.target.value)}
                                    />
                                    <span className="text-xs text-white/40 font-mono">{config.cornerColor}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-white/40">Fundo</span>
                                <div className="flex items-center gap-2 p-2 bg-white/[0.03] border border-white/[0.08] rounded-md">
                                    <input
                                        type="color"
                                        value={config.bgColor}
                                        onChange={(e) => updateConfig('bgColor', e.target.value)}
                                    />
                                    <span className="text-xs text-white/40 font-mono">{config.bgColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Correction */}
                    <div className="mb-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <Shield className="w-4 h-4 text-purple-400" />
                            Correção de Erros
                            <span className="ml-auto text-xs text-white/30 cursor-help" title="Maior nível = mais resistente a danos">?</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ERROR_LEVELS.map((level) => (
                                <label
                                    key={level.value}
                                    className={`flex items-center px-3 py-2 text-xs font-medium rounded-md border cursor-pointer transition-all
                    ${config.errorCorrectionLevel === level.value
                                            ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                                            : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-purple-500/40'}`}
                                >
                                    <input
                                        type="radio"
                                        name="errorCorrection"
                                        value={level.value}
                                        checked={config.errorCorrectionLevel === level.value}
                                        onChange={(e) => updateConfig('errorCorrectionLevel', e.target.value)}
                                        className="hidden"
                                    />
                                    {level.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Download Size */}
                    <div>
                        <label className="flex items-center justify-between text-sm font-medium text-white/70 mb-3">
                            <span className="flex items-center gap-2">
                                <Maximize2 className="w-4 h-4 text-purple-400" />
                                Tamanho do Download
                            </span>
                            <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded">
                                {config.downloadSize}px
                            </span>
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={config.downloadSize}
                            onChange={(e) => updateConfig('downloadSize', parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
