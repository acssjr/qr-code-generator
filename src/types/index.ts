export interface QRConfig {
    width: number;
    height: number;
    margin: number;
    downloadSize: number;
    dotStyle: string;
    cornerStyle: string;
    dotColor: string;
    cornerColor: string;
    bgColor: string;
    errorCorrectionLevel: string;
}

export interface TrackingData {
    id: string;
    shortCode: string;
    originalUrl: string;
    trackingUrl: string;
    title: string;
    createdAt?: string;
}

export interface LinkStats {
    totalClicks: number;
    uniqueScans: number;
    firstScan: string | null;
    lastScan: string | null;
    todayScans: number;
    yesterdayScans: number;
    clicksByDay: { date: string; count: number }[];
    clicksByHour: { hour: string; count: number }[];
    clicksByCountry: { country: string; count: number }[];
    clicksByCity: { city: string; country: string; count: number }[];
    clicksByDevice: { device_type: string; count: number }[];
    clicksByBrowser: { browser: string; count: number }[];
    clicksByOS: { os: string; count: number }[];
    recentClicks: {
        clicked_at: string;
        country: string;
        city: string;
        device_type: string;
        browser: string;
        os: string;
    }[];
}

export interface Link {
    id: string;
    short_code: string;
    original_url: string;
    title: string | null;
    created_at: string;
    is_active: number;
    total_clicks: number;
    last_click: string | null;
    trackingUrl: string;
}
