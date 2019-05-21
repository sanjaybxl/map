import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer, Group as LayerGroup } from 'ol/layer';
import XYZ from 'ol/source/XYZ';

@Component({
  selector: 'map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss']
})
export class MapDisplayComponent implements OnInit, OnChanges {
  map: OlMap;
  @Input() mapData: any;
  @Input() mapStyle: any;
  @Input() renderTo: any;
  vectorLayer: VectorLayer;
  format = new GeoJSON({
    featureProjection: 'EPSG:3857',
    defaultDataProjection: 'EPSG:3857'
  });
  layerGroup: any;

  constructor() { }

  ngOnInit() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: this.mapStyle || null,
      opacity: 0.6
    });

    this.layerGroup = new LayerGroup({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous'
          })
        }),
        this.vectorLayer
      ]
    });

    this.map = new OlMap({
      layers: [this.layerGroup],
      view: new OlView({
        center: [0, 0],
        zoom: 0,
        minZoom: 1,
      })
    });
    this.map.setTarget(this.renderTo);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mapData']) {
      if (this.mapData) {
        this.vectorLayer.getSource().addFeatures(this.format.readFeatures(this.mapData));
        this.map.getView().fit(this.vectorLayer.getSource().getExtent(), { size: this.map.getSize() });
      }
      if(this.mapData === null) {
       this.vectorLayer.getSource().clear();
  
      }
      
    }
  }
}
