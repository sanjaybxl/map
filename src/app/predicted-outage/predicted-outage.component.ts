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
  inRange: any;
  poRange = predicteOutageRange;
  isNaN: Function = Number.isNaN;
  toggleOutage: boolean = true;
  styleMapDeviceOut: (feature: any) => any;
  styleMapDeviceOutPercent: (feature: any) => any;

  constructor(private preditedOutageService: PreditedOutageService) { }

  ngOnInit() {
    let inRange = (x, min, max) => {
      return ((x - min) * (x - max) <= 0);
    }

    this.styleMapDeviceOut = function (feature) {
      // handle the device out based on device count
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

    this.styleMapDeviceOutPercent = function (feature) {
      // handle the device out based on percentage
      let color = 'transparent';

      if (feature.get('devicesOutPercent')) {
        if (inRange(feature.get('devicesOutPercent') * 100, 0, 20)) {
          color = '#d0fc61';
        }
        if (inRange(feature.get('devicesOutPercent') * 100, 20, 40)) {
          color = '#80ad1d';
        }
        if (inRange(feature.get('devicesOutPercent') * 100, 40, 60)) {
          color = '#ffc603';
        }
        if (inRange(feature.get('devicesOutPercent') * 100, 60, 80)) {
          color = '#fe8b3a';
        }
        if (inRange(feature.get('devicesOutPercent') * 100, 80, 100)) {
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
