import { Component, OnInit, Input } from '@angular/core';

import OlMap from 'ol/map';
import OlView from 'ol/View';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer, Group as LayerGroup } from 'ol/layer';
import { CartoDB, OSM } from 'ol/source';
import XYZ from 'ol/source/XYZ';


@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit {
  @Input() mapData: any;
  @Input() mapConfig: any;
  @Input() mapStyle: any;
  layerGroup: any;
  map: OlMap;
  vectorLayer: any;

  format = new GeoJSON({
    featureProjection: "EPSG:3857"
  });

  constructor() {
  }

  ngOnInit() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: this.mapStyle,
      opacity: 0.6 // Make the style transparent
    });

    this.vectorLayer.getSource().addFeatures(this.format.readFeatures(this.mapData));

    let cartoDBSource = new CartoDB({
      account: 'common-data',
      config: this.mapConfig
    });

    this.layerGroup = new LayerGroup({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous'
          })
        }),
        new TileLayer({
          source: cartoDBSource
        })
      ]
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.layerGroup],
      view: new OlView({
        center: [0, 0],
        zoom: 0,
        minZoom: 1,
      })
    });

    /*
      Set the map view on the feature
    */
    this.map.getView().fit(this.vectorLayer.getSource().getExtent(), this.map.getSize());
  }
}
