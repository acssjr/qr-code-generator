'use client';

import { useRef } from 'react';
import { Image, Palette, Shield, Maximize2, Sparkles } from 'lucide-react';
import { QRConfig } from '@/types';
import ColorPicker from './ColorPicker';

interface CustomizationPanelProps {
    config: QRConfig;
    onConfigChange: (config: QRConfig) => void;
    onLogoChange: (logo: string | null) => void;
    logoPreview: string | null;
}

const PRESETS = [
    {
        name: 'Instagram',
        config: {
            dotStyle: 'extra-rounded',
            cornerStyle: 'extra-rounded',
            dotColor: '#E1306C',
            cornerColor: '#833AB4',
            bgColor: '#FFFFFF',
            margin: 10,
        }
    },
    {
        name: 'Tech Dark',
        config: {
            dotStyle: 'square',
            cornerStyle: 'square',
            dotColor: '#00FF94',
            cornerColor: '#00FF94',
            bgColor: '#111111',
            margin: 0,
        }
    },
    {
        name: 'Corporativo',
        config: {
            dotStyle: 'classy',
            cornerStyle: 'square',
            dotColor: '#1E40AF',
            cornerColor: '#1E3A8A',
            bgColor: '#FFFFFF',
            margin: 10,
        }
    },
    {
        name: 'Minimal',
        config: {
            dotStyle: 'rounded',
            cornerStyle: 'dot',
            dotColor: '#333333',
            cornerColor: '#000000',
            bgColor: '#F3F4F6',
            margin: 20,
        }
    }
];

const DOT_STYLES = [
    { value: 'rounded', label: 'Arredondado' },
    { value: 'dots', label: 'Círculos' },
    { value: 'classy', label: 'Clássico' },
    { value: 'classy-rounded', label: 'Smooth' },
    { value: 'square', label: 'Quadrado' },
    { value: 'extra-rounded', label: 'Super Round' },
];

const CORNER_STYLES = [
    { value: 'extra-rounded', label: 'Redondo' },
    { value: 'dot', label: 'Ponto' },
    { value: 'square', label: 'Quadrado' },
];

export default function CustomizationPanel({
    config,
    onConfigChange,
    onLogoChange,
    logoPreview,
}: CustomizationPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePresetApply = (presetConfig: any) => {
        onConfigChange({
            ...config,
            ...presetConfig,
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            onLogoChange(event.target?.result as string);
            onConfigChange({ ...config, errorCorrectionLevel: 'H' });
        };
        reader.readAsDataURL(file);
    };

    const updateConfig = (key: keyof QRConfig, value: string | number | boolean) => {
        onConfigChange({ ...config, [key]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Presets Section */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Modelos Populares
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetApply(preset.config)}
                            className="group relative p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all text-left overflow-hidden"
                        >
                            <div className="w-full h-8 mb-2 rounded-lg opacity-80"
                                style={{ background: `linear-gradient(135deg, ${preset.config.dotColor}, ${preset.config.cornerColor})` }}
                            />
                            <span className="text-xs font-medium text-white/80 group-hover:text-white block truncate">
                                {preset.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Colors Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90">
                        <Palette className="w-4 h-4 text-purple-400" />
                        Cores Personalizadas
                    </h3>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs text-white/50 group-hover:text-white transition-colors">Usar Gradiente</span>
                        <div
                            className={`w-10 h-5 rounded-full p-1 transition-colors ${config.useGradient ? 'bg-purple-500' : 'bg-white/10'}`}
                            onClick={() => updateConfig('useGradient', !config.useGradient)}
                        >
                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${config.useGradient ? 'translate-x-[20px]' : ''}`} />
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ColorPicker
                        label={config.useGradient ? "Cor Inicial" : "Pontos"}
                        color={config.dotColor}
                        onChange={(c) => updateConfig('dotColor', c)}
                    />

                    {config.useGradient && (
                        <ColorPicker
                            label="Cor Final"
                            color={config.gradientColor2 || '#a855f7'}
                            onChange={(c) => updateConfig('gradientColor2', c)}
                        />
                    )}

                    <ColorPicker
                        label="Cantos"
                        color={config.cornerColor}
                        onChange={(c) => updateConfig('cornerColor', c)}
                    />
                    <ColorPicker
                        label="Fundo"
                        color={config.bgColor}
                        onChange={(c) => updateConfig('bgColor', c)}
                    />
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
                                className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-all text-center
                  ${config.dotStyle === style.value
                                        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40'
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
                                className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-all text-center
                  ${config.cornerStyle === style.value
                                        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40'
                                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-4">
                            Arredondamento da Borda
                        </h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="100" // A bit simplistic, ideally relative to size, but simplified for UI
                                value={Math.round(((config.borderRadius || 0) / config.downloadSize) * 1000)} // Show as scale 0-100 (approx 10% max)
                                onChange={(e) => {
                                    // Convert 0-100 scale back to pixels relative to download size
                                    // e.g. 50 on scale => 5% of downloadSize
                                    const percentage = parseInt(e.target.value) / 1000;
                                    const pixels = Math.floor(config.downloadSize * percentage);
                                    updateConfig('borderRadius', pixels);
                                }}
                                className="flex-1 h-2 bg-black/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                        </div>
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
                border-2 border-dashed rounded-xl overflow-hidden transition-all relative group cursor-pointer
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
                            Margem (Padding)
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
                                Resolução Download
                            </span>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                {config.downloadSize}px
                            </span>
                        </label>
                        <input
                            type="range"
                            min="500"
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
