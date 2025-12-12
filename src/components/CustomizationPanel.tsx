'use client';

import { useRef } from 'react';
import { Image, Palette, Shield, Maximize2 } from 'lucide-react';
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
    { value: 'L', label: 'Baixo' },
    { value: 'M', label: 'Médio' },
    { value: 'Q', label: 'Alto' },
    { value: 'H', label: 'Máximo' },
];

export default function CustomizationPanel({
    config,
    onConfigChange,
    onLogoChange,
    logoPreview,
}: CustomizationPanelProps) {
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
        <div className="space-y-8">
            {/* Colors Section */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Cores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                        <span className="text-xs text-white/60">Pontos</span>
                        <div className="flex items-center gap-2 p-2 bg-black/20 border border-white/10 rounded-lg transition-colors hover:border-purple-500/50">
                            <input
                                type="color"
                                value={config.dotColor}
                                onChange={(e) => updateConfig('dotColor', e.target.value)}
                                className="w-8 h-8 rounded bg-transparent cursor-pointer"
                            />
                            <span className="text-xs text-white/60 font-mono hidden sm:inline">{config.dotColor}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs text-white/60">Cantos</span>
                        <div className="flex items-center gap-2 p-2 bg-black/20 border border-white/10 rounded-lg transition-colors hover:border-purple-500/50">
                            <input
                                type="color"
                                value={config.cornerColor}
                                onChange={(e) => updateConfig('cornerColor', e.target.value)}
                                className="w-8 h-8 rounded bg-transparent cursor-pointer"
                            />
                            <span className="text-xs text-white/60 font-mono hidden sm:inline">{config.cornerColor}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs text-white/60">Fundo</span>
                        <div className="flex items-center gap-2 p-2 bg-black/20 border border-white/10 rounded-lg transition-colors hover:border-purple-500/50">
                            <input
                                type="color"
                                value={config.bgColor}
                                onChange={(e) => updateConfig('bgColor', e.target.value)}
                                className="w-8 h-8 rounded bg-transparent cursor-pointer"
                            />
                            <span className="text-xs text-white/60 font-mono hidden sm:inline">{config.bgColor}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Style & Shape Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-white/90 mb-4">Estilo dos Pontos</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {DOT_STYLES.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => updateConfig('dotStyle', style.value)}
                                className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                  ${config.dotStyle === style.value
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white/90 mb-4">Estilo dos Cantos</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {CORNER_STYLES.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => updateConfig('cornerStyle', style.value)}
                                className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-all
                  ${config.cornerStyle === style.value
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Logo & Advanced */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                        <Image className="w-4 h-4 text-purple-400" />
                        Logo Central
                    </h3>
                    <div className="flex gap-4 items-center">
                        <div
                            className={`w-16 h-16 flex items-center justify-center bg-black/20 
                border-2 border-dashed rounded-xl overflow-hidden transition-all relative group
                ${logoPreview ? 'border-purple-500' : 'border-white/20 hover:border-purple-400/50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-white/30 group-hover:text-white/50">
                                    <span className="text-[10px] uppercase">Upload</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-xs font-medium text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                            >
                                Escolher Arquivo
                            </button>
                            {logoPreview && (
                                <button
                                    onClick={() => onLogoChange(null)}
                                    className="px-4 py-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
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

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                            <Shield className="w-4 h-4 text-purple-400" />
                            Margem de Segurança
                        </h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={config.margin}
                                onChange={(e) => updateConfig('margin', parseInt(e.target.value))}
                                className="flex-1 h-2 bg-black/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <span className="text-xs font-mono text-white/60 w-8 text-right">{config.margin}px</span>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-sm font-medium text-white/70 mb-3">
                            <span className="flex items-center gap-2">
                                <Maximize2 className="w-4 h-4 text-purple-400" />
                                Qualidade (Download)
                            </span>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                {config.downloadSize}px
                            </span>
                        </label>
                        <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={config.downloadSize}
                            onChange={(e) => updateConfig('downloadSize', parseInt(e.target.value))}
                            className="w-full h-2 bg-black/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
