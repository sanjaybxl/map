import { Component, OnInit } from '@angular/core';
import { DATA } from '../assets/data/geojson';
import { Fill, Stroke, Style, Text } from 'ol/style';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  mapStyle: (feature: any) => any;
  constructor() { }
  mapData = DATA;
  mapConfig: any
  ngOnInit() {
    this.mapConfig = {
      'layers': [{
        'type': 'cartodb',
        'options': {
          'cartocss_version': '2.1.1',
          'cartocss': `#layer { 
            [status = 'EXA']{ polygon-fill: #F00; opacity: 0.6 } 
            [status = 'CON']{ polygon-fill: #fa605d; opacity: 0.6 }
            [status = 'EXT']{ polygon-fill: #fada5e; opacity: 0.6 }
            [status = 'EXB']{ polygon-fill: grey; opacity: 0.6 }
            [status = 'NEW']{ polygon-fill: lightblue; opacity: 0.6 }
          }`,
          'sql': 'select * from public.current_ww'
        }
      }]
    };

    this.mapStyle = function (feature) {
      //now you can use any property of your feature to identify the different colors
      //I am using the COUNTY property of your data just to demonstrate
      var color;
      if (feature.get("COUNTY") < 10) {
        color = "#fa605d";
      } else if (feature.get("COUNTY") >= 20 && feature.get("COUNTY") <= 70) {
        color = "grey";
      } else {
        color = "#fada5e";
      }

      var retStyle = new Style({
        stroke: new Stroke({
          color: '#686868'
        }),
        fill: new Fill({
          color: color
        })
      });
      return retStyle;
    };
  }
}
