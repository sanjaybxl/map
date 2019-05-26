import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Fill, Style } from 'ol/style';
import { PreditedOutageService } from './predicted.outage.service';
import { predicteOutageRange } from './predicted-outage.constants';
import { Township, Outage } from '../../shared/model/outage.model';
import { Feature, GeoJon } from '../../shared/model/geojson.model';

@Component({
  selector: 'app-predicted-outage',
  templateUrl: './predicted-outage.component.html',
  styleUrls: ['./predicted-outage.component.scss']
})
export class PredictedOutageComponent implements OnInit {
  mapStyleOutage: Function;
  mapDataOutage: GeoJon;
  poRange = predicteOutageRange;
  isNaN: Function = Number.isNaN;
  toggleOutage: boolean = true;
  styleMapDeviceOut: (feature: Feature) => Feature;
  styleMapDeviceOutPercent: (feature: Feature) => Feature;

  constructor(private preditedOutageService: PreditedOutageService) { }

  ngOnInit() {
    const inRange = (x: number, min: number, max: number) => {
      return isNaN(max) ? (x >= min) : ((x - min) * (x - max) <= 0);
    }

    this.styleMapDeviceOut = function (feature: any): Style {
      // handle the device out based on device count
      let color = 'transparent';

      if (feature.get('devicesOut')) {
        predicteOutageRange.map(r => {
          const deviceData = this.toggleOutage ? feature.get('devicesOut') : feature.get('devicesOutPercent') * 100;
          if (inRange(deviceData, r.min, r.max)) {
            color = r.color
          }
        });
      }
      const retStyle = new Style({
        fill: new Fill({
          color: color
        })
      });
      return retStyle;
    }.bind(this);

    this.mapStyleOutage = this.styleMapDeviceOut;
    this.prepareMapData();
  }

  prepareMapData() {
    forkJoin(
      this.preditedOutageService.getGeoJson(),
      this.preditedOutageService.getOutageData()
    ).subscribe(([geoJson, outageJson]: [GeoJon, Outage]) => {
      outageJson.townships.map((outage: Township) => {
        geoJson.features.filter(function (feature: Feature) {
          return feature.properties.GEO_ID === outage.geoId
        }).map(function (feature: Feature) {
          feature.properties = Object.assign(feature.properties, outage);
        });
      });
      this.mapDataOutage = geoJson;
    });
  }

  settoggleOutage(val: boolean) {
    this.prepareMapData();
    this.toggleOutage = val;
    this.mapStyleOutage = this.toggleOutage ? this.styleMapDeviceOut : this.styleMapDeviceOutPercent;;
  }
}
