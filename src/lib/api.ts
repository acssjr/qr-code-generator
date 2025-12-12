import { TrackingData, Link, LinkStats } from '@/types';

const API_BASE_URL = 'https://qr-tracker.acssjr.workers.dev';

export async function createTrackingLink(url: string, title: string): Promise<TrackingData> {
    const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, title })
    });

    if (!response.ok) {
        throw new Error('Falha ao criar link');
    }

    const result = await response.json();
    return result.data;
}

export async function getLinks(): Promise<Link[]> {
    const response = await fetch(`${API_BASE_URL}/api/links`);
    const result = await response.json();

    if (!result.success) {
        throw new Error('Falha ao carregar links');
    }

    return result.data;
}

export async function getLinkStats(linkId: string): Promise<{ link: Link; stats: LinkStats }> {
    const response = await fetch(`${API_BASE_URL}/api/stats/${linkId}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error('Falha ao carregar estatísticas');
    }

    return result.data;
}

export function saveToLocalStorage(data: TrackingData): void {
    try {
        const savedCodes = JSON.parse(localStorage.getItem('qr_codes') || '[]');

        const exists = savedCodes.some((code: TrackingData) => code.id === data.id);
        if (!exists) {
            savedCodes.unshift({
                ...data,
                createdAt: new Date().toISOString()
            });

            if (savedCodes.length > 50) {
                savedCodes.pop();
            }

            localStorage.setItem('qr_codes', JSON.stringify(savedCodes));
        }
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

export function getFromLocalStorage(): TrackingData[] {
    try {
        return JSON.parse(localStorage.getItem('qr_codes') || '[]');
    } catch {
        return [];
    }
}
