import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Fill, Stroke, Style } from 'ol/style';
import { every } from 'rxjs/operators';
import { PreditedOutageService } from './predicted.outage.service';
import { predicteOutageRange } from './predicted-outage.constants';

@Component({
  selector: 'app-predicted-outage',
  templateUrl: './predicted-outage.component.html',
  styleUrls: ['./predicted-outage.component.scss']
})
export class PredictedOutageComponent implements OnInit {
  mapStyleOutage: any;
  mapDataOutage: any;
  poRange = predicteOutageRange;
  isNaN: Function = Number.isNaN;
  toggleOutage: boolean = true;
  styleMapDeviceOut: (feature: any) => any;
  styleMapDeviceOutPercent: (feature: any) => any;

  constructor(private preditedOutageService: PreditedOutageService) { }

  ngOnInit() {
    const inRange = (x, min, max) => {
      return isNaN(max) ? (x >= min) : ((x - min) * (x - max) <= 0);
    }

    this.styleMapDeviceOut = function (feature) {
      // handle the device out based on device count
      let color = 'transparent';

      if (feature.get('devicesOut')) {
        predicteOutageRange.map(r => {
          const deviceData = this.toggleOutage ? feature.get('devicesOut') : feature.get('devicesOutPercent') * 100;
          if(inRange(deviceData, r.min, r.max)) {
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

  settoggleOutage(val: boolean) {
    this.prepareMapData();
    this.toggleOutage = val;
    this.mapStyleOutage = this.toggleOutage ? this.styleMapDeviceOut : this.styleMapDeviceOutPercent;;
  }
}
