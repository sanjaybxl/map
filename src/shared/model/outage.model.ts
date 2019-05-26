export interface AnalyticRuntime {
    id: string;
    start: Date;
    end: Date;
    status: string;
}

export interface Township {
    geoId: string;
    devicesOut: number;
    devicesOutPercent: number;
    devicesTotal: number;
    status: string;
    statusMessage: string;
}

export interface Outage {
    analyticResult: string;
    timestamp: Date;
    regions: string[];
    "analytic-runtime": AnalyticRuntime;
    townships: Township[];
}
