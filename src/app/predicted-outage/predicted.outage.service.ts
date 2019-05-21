import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PreditedOutageService {
    geoJsonUrl = 'assets/data/countries.json';
    outageDataUrl = 'assets/data/outage.json';

    constructor(private http: HttpClient) { }

    getGeoJson() {
        return this.http.get(this.geoJsonUrl);
    }

    getOutageData() {
        return this.http.get(this.outageDataUrl);
    }
}
