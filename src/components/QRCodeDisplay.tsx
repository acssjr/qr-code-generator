'use client';

import { useEffect, useRef, useState } from 'react';
import { QRConfig } from '@/types';

interface QRCodeDisplayProps {
    data: string;
    config: QRConfig;
    logo: string | null;
    isPreview?: boolean;
}

export default function QRCodeDisplay({ data, config, logo, isPreview = false }: QRCodeDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !containerRef.current) return;

        const initQR = async () => {
            // @ts-ignore - dynamic import for client-side only
            const QRCodeStyling = (await import('qr-code-styling')).default;

            const qrConfig = {
                width: 200,
                height: 200,
                type: 'canvas' as const,
                data: data || 'https://preview.qr',
                margin: config.margin,
                qrOptions: {
                    errorCorrectionLevel: config.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
                },
                dotsOptions: {
                    color: config.dotColor,
                    type: config.dotStyle as any
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

            if (qrCodeRef.current) {
                qrCodeRef.current.update(qrConfig);
            } else {
                qrCodeRef.current = new QRCodeStyling(qrConfig);
                containerRef.current!.innerHTML = '';
                qrCodeRef.current.append(containerRef.current);
            }
        };

        initQR();
    }, [isClient, data, config, logo]);

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="w-60 h-60 flex items-center justify-center rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: config.bgColor }}
            />

            {isPreview && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 
          px-3 py-1 bg-black/70 rounded-full text-xs font-medium text-purple-400">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
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
        width: config.downloadSize,
        height: config.downloadSize,
        type: format === 'png' ? 'canvas' : 'svg',
        data: data,
        margin: config.margin,
        qrOptions: {
            errorCorrectionLevel: config.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
        },
        dotsOptions: {
            color: config.dotColor,
            type: config.dotStyle as any
        },
        cornersSquareOptions: {
            color: config.cornerColor,
            type: config.cornerStyle as any
        },
        cornersDotOptions: {
            color: config.cornerColor,
            type: 'dot'
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
        await qr.download({ name: 'qrcode', extension: 'png' });
    }
}
