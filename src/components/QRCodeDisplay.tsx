'use client';

import { useEffect, useRef, useState } from 'react';
import { QRConfig } from '@/types';

interface QRCodeDisplayProps {
    data: string;
    config: QRConfig;
    logo: string | null;
    isPreview?: boolean;
}

// Helper to create consistent config for both preview and download
const createQRConfig = (data: string, config: QRConfig, logo: string | null, size: number) => {
    return {
        width: size,
        height: size,
        type: 'canvas' as const,
        data: data || 'https://preview.qr',
        margin: config.margin,
        qrOptions: {
            errorCorrectionLevel: config.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
        },
        dotsOptions: {
            color: config.useGradient ? undefined : config.dotColor,
            type: config.dotStyle as any,
            gradient: config.useGradient ? {
                type: config.gradientType || 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: config.dotColor },
                    { offset: 1, color: config.gradientColor2 || config.dotColor }
                ]
            } : undefined
        },
        cornersSquareOptions: {
            color: config.cornerColor,
            type: config.cornerStyle as any
        },
        cornersDotOptions: {
            color: config.cornerColor,
            type: 'dot' as const
        },
        backgroundOptions: {
            color: config.bgColor
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.4,
            hideBackgroundDots: true
        },
        image: logo || undefined
    };
};

export default function QRCodeDisplay({ data, config, logo, isPreview = false }: QRCodeDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);

    // Performance Optimization: Debounce and Skip Refs
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousConfigRef = useRef<QRConfig | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !containerRef.current) return;

        // Skip heavy canvas update if only visual CSS props changed (Border Radius, Download Size)
        const hasHeavyChanges = !previousConfigRef.current ||
            previousConfigRef.current.margin !== config.margin ||
            previousConfigRef.current.dotColor !== config.dotColor ||
            previousConfigRef.current.cornerColor !== config.cornerColor ||
            previousConfigRef.current.bgColor !== config.bgColor ||
            previousConfigRef.current.dotStyle !== config.dotStyle ||
            previousConfigRef.current.cornerStyle !== config.cornerStyle ||
            previousConfigRef.current.useGradient !== config.useGradient ||
            previousConfigRef.current.gradientType !== config.gradientType ||
            previousConfigRef.current.gradientColor2 !== config.gradientColor2 ||
            logo !== (qrCodeRef.current?._options?.image) ||
            data !== (qrCodeRef.current?._options?.data);

        if (!hasHeavyChanges && qrCodeRef.current) {
            return; // Skip canvas update, let CSS transition handle border-radius
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            // @ts-ignore
            const QRCodeStyling = (await import('qr-code-styling')).default;

            const PREVIEW_SIZE = 280;
            const scaledMargin = Math.floor((config.margin / config.downloadSize) * PREVIEW_SIZE);

            const qrConfig = createQRConfig(data, {
                ...config,
                margin: scaledMargin
            }, logo, PREVIEW_SIZE);

            if (qrCodeRef.current) {
                qrCodeRef.current.update(qrConfig);
            } else {
                qrCodeRef.current = new QRCodeStyling(qrConfig);
                containerRef.current!.innerHTML = '';
                qrCodeRef.current.append(containerRef.current);
            }
            previousConfigRef.current = config;
        }, 50); // 50ms smooth debounce avoids flashing

    }, [isClient, data, config, logo]);

    return (
        <div className="relative group">
            {/* Checkerboard background for transparency checks */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            />

            <div
                ref={containerRef}
                className="relative z-10 w-[280px] h-[280px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                    // Calculate visual border radius relative to preview size
                    borderRadius: Math.floor(((config.borderRadius || 0) / config.downloadSize) * 280)
                }}
            />

            {isPreview && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 
          px-3 py-1 bg-black/70 rounded-full text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Preview (WYSIWYG)
                </div>
            )}
        </div>
    );
}

// Export a method to download the QR code
export async function downloadQRCode(
    data: string,
    config: QRConfig,
    logo: string | null,
    format: 'png' | 'svg'
): Promise<void> {
    // @ts-ignore
    const QRCodeStyling = (await import('qr-code-styling')).default;

    const downloadConfig = {
        ...createQRConfig(data, config, logo, config.downloadSize),
        type: format === 'png' ? 'canvas' : 'svg'
    };

    const qr = new QRCodeStyling(downloadConfig as any);

    if (format === 'svg') {
        const svgBlob = await qr.getRawData('svg') as Blob | null;
        if (!svgBlob) {
            throw new Error('Failed to generate SVG');
        }
        let svgText = await svgBlob.text();

        // Fix logo embedding for SVG
        if (logo) {
            svgText = svgText.replace(
                /xlink:href="(?!data:)[^"]*"/g,
                `xlink:href="${logo}"`
            );
            svgText = svgText.replace(
                /href="(?!data:)(?!#)[^"]*"/g,
                `href="${logo}"`
            );
        }

        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        // Handle PNG with rounded corners matching preview

        // Note: The library's default download doesn't support border radius clipping on the image itself.
        // To strictly achieve "rounded image", we need to intercept the buffer.

        const blob = await qr.getRawData('png') as Blob | null;
        if (!blob) return;

        const img = new Image();
        img.src = URL.createObjectURL(blob as Blob);

        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high resolution matches options
        canvas.width = config.downloadSize;
        canvas.height = config.downloadSize;

        // Draw rounded rect clip path
        const radius = config.borderRadius || 0;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        // Draw original QR code inside clipped area
        ctx.drawImage(img, 0, 0);

        // Download processed canvas
        const roundedDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcode-rounded.png';
        link.href = roundedDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
