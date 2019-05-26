
export interface Properties {
    GEO_ID: string;
    STATE: string;
    COUNTY: string;
    NAME: string;
    LSAD: string;
    CENSUSAREA: number;
}

export interface Geometry {
    type: string;
    coordinates: any[][][];
}

export interface Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
}

export interface GeoJon {
    type: string;
    features: Feature[];
}

