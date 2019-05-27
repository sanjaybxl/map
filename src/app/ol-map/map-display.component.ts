import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import VectorSource from 'ol/source/Vector';
import GeoJSON, { Options } from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer, Group as LayerGroup } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import { StyleLike } from 'ol/style/Style';
import { GeoJon } from '../../shared/model/geojson.model';

@Component({
  selector: 'map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.scss']
})
export class MapDisplayComponent implements OnInit, OnChanges {
  map: OlMap;
  @Input() mapData: GeoJon;
  @Input() mapStyle: StyleLike;
  @Input() renderTo: string;
  vectorLayer: VectorLayer;
  
  options: Options = {
    featureProjection: 'EPSG:3857',
  }

  format = new GeoJSON(this.options);
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
    }
    if (changes['mapStyle']) {
      if (this.mapStyle && this.vectorLayer) {
        this.vectorLayer.setStyle(this.mapStyle);
      }
    }
  }
}
