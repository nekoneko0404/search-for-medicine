
export interface PrefectureData {
    disease: string;
    prefecture: string;
    value: number;
}

export interface HistoryItem {
    week: number;
    value: number;
}

export interface PrefectureHistory {
    disease: string;
    prefecture: string;
    history: HistoryItem[];
}

export interface Alert {
    disease: string;
    level: "alert" | "warning" | "caution" | "normal";
    message: string;
}

export interface InfectionDataSummary {
    alerts: Alert[];
}

export interface InfectionApiResponse {
    status?: string;
    message?: string;
    date: string;
    data: PrefectureData[];
    summary: InfectionDataSummary;
    history: PrefectureHistory[];
}

export interface CachedData {
    timestamp: number;
    data: InfectionApiResponse; // Or ArchiveData
}

export interface ArchiveData {
    year: string;
    data: PrefectureHistory[];
}

export interface ArchiveResponse {
    year: number;
    data: PrefectureHistory[];
}

// Window global extensions
declare global {
    interface Window {
        localforage: any;
        Chart: any;
        renderJapanMap: (containerId: string, data: InfectionApiResponse, disease: string) => void;
        getColorForValue: (value: number, disease: string) => string;
        setCurrentRegion: (regionId: string) => void;
        updateDetailPanel: (regionId: string, data: InfectionApiResponse, disease: string, highlightPrefecture?: string | null) => void;
        getRegionIdByPrefecture: (prefectureName: string) => string | null;
        showPrefectureChart: (prefecture: string, disease: string) => void;
        getDiseaseName: (key: string) => string;
        switchDisease: (disease: string) => void;
    }
}
