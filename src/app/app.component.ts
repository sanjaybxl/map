import { Component, OnInit } from '@angular/core';
import { Fill, Stroke, Style } from 'ol/style';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { every } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  mapStyleOutage: any;
  mapDataOutage: any;
  inRange: any;
  geoJsonUrl = 'assets/data/countries.json';
  outageDataUrl = 'assets/data/outage.json';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let inRange = (x, min, max) => {
      return ((x - min) * (x - max) <= 0);
    }

    this.mapStyleOutage = function (feature) {
      // now you can use any property of your feature to identify the different colors
      // I am using the COUNTY property of your data just to demonstrate
      let color = 'transparent';

      if (feature.get('devicesOut')) {
        if (inRange(feature.get('devicesOut'), 0, 5)) {
          color = '#d0fc61';
        }
        if (inRange(feature.get('devicesOut'), 5, 20)) {
          color = '#80ad1d';
        }
        if (inRange(feature.get('devicesOut'), 20, 30)) {
          color = '#ffc603';
        }
        if (inRange(feature.get('devicesOut'), 30, 40)) {
          color = '#fe8b3a';
        }
        if (feature.get('devicesOut') > 40) {
          color = '#f44337';
        }
      }
      const retStyle = new Style({
        fill: new Fill({
          color: color
        })
      });
      return retStyle;
    };

    forkJoin(
      this.getGeoJson(),
      this.getOutageData()
    ).subscribe(([geoJson, outageJson]: [any, any]) => {
      outageJson.townships.map(outage => {
        geoJson.features.filter(function (feature) {
          return feature.properties.GEO_ID === outage.geoId
        }).map(function (feature) {
          feature.properties = Object.assign(feature.properties, outage);
        });
      });
      this.mapDataOutage = geoJson;
    });
  }

  getGeoJson() {
    return this.http.get(this.geoJsonUrl);
  }

  getOutageData() {
    return this.http.get(this.outageDataUrl);
  }
}
