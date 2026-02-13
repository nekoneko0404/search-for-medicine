
export interface City {
    code: string;
    name: string;
    lat: number;
    lng: number;
    level: 1 | 2 | 3;
    _dist?: number; // Runtime property for distance calculation
}

export interface Weather {
    temperature_2m?: number;
    temperature_2m_max?: number;
    weathercode: number;
    wind_speed_10m?: number;
    wind_speed_10m_max?: number;
    wind_direction_10m?: number;
    wind_direction_10m_dominant?: number;
    // Client-side added properties
    lat?: number;
    lng?: number;
}

export interface WindData {
    lat: number;
    lng: number;
    u: number;
    v: number;
}

export interface GlobalState {
    cache: {
        [key: string]: {
            data: any; // Ideally more specific pollen data type
            timestamp: number;
        }
    };
    currentDate: string;
    currentMode: 'hourly' | 'daily';
}

interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    getWeatherIcon?: (code: number) => string;
    updateWeatherMarkers?: (date?: string | null) => Promise<void>;
}

// Leaflet Minimal Type Definitions
export declare var L: any;

// Chart.js Minimal Type Definitions
export declare var Chart: any;

