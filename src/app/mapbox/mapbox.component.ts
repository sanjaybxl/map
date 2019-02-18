import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// if not using * as, will cause MapboxGeocoder is undefined
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../environments/environment';
import { DATA } from '../../assets/data/geojson';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-mapbox',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css'],
})
export class MapboxComponent implements OnInit {
  storeData: any;
  map: mapboxgl.Map;
  selectedLink: number;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  options = new JsonEditorOptions();
  mapData: any = DATA;
  mapWidth = '800';
  mapHeight = '600';
  iconWidth = '50';
  iconHeight = '50';
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  mapCoordinate: any = [[
    32.958984,
    -5.353521
    ], [
    43.50585,
    5.615985
    ]];

  constructor() {
    this.options.mode = 'code';
    this.options.modes = ['code', 'text'];
    this.options.statusBar = false;
    this.options.onChange = () => {
      try {
        this.mapData = this.editor.get();
        this.map.getSource('sample').setData(this.mapData);
      }
      catch (err) {
        console.error('JSON error');
      }
    };
  }

  onMapCoordinateChange(value) {
    this.map.fitBounds(JSON.parse(value));
  }

  ngOnInit() {
    this.storeData = DATA.features;
    this.selectedLink = null;
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        zoom: 8, // default zoom.
        center: [0, 51.5], // default center coordinate in [longitude, latitude] format.
        glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        sources: {
          // Using an open-source map tile layer.
          "simple-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "simple-tiles",
            minzoom: 0,
            maxzoom: 22
          }
        ]
      }
    });
    this.map.on('load', (e) => {
      this.map.addSource('sample', {
        type: 'geojson',
        data: this.mapData,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });
      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sample',
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        },
      });

      this.map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "sample",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      this.map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "sample",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#ff5500",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });

      // inspect a cluster on click
      this.map.on('click', 'clusters', function (e) {
        var features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        this.map.getSource('sample').getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err)
            return;
          this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        }.bind(this));
      }.bind(this));

      this.map.on('mouseenter', 'clusters', function () {
        this.map.getCanvas().style.cursor = 'pointer';
      }.bind(this));

      this.map.on('mouseleave', 'clusters', function () {
        this.map.getCanvas().style.cursor = '';
      }.bind(this));

      this.map.on("mouseenter", "unclustered-point", function (e) {
        this.map.getCanvas().style.cursor = "pointer";
        const el = document.createElement('div');
        // Add a class called 'marker' to each div
        el.className = 'marker';
        el.style.width = this.iconWidth + 'px';
        el.style.height = this.iconHeight + 'px';
        // By default the image for your custom marker will be anchored
        // by its center. Adjust the position accordingly
        // Create the custom markers, set their position, and add to map
        var marker = e.features[0]
        new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map);
        this.createPopUp(marker);
      }.bind(this));

      this.map.on("mouseleave", "unclustered-point", function () {
        this.clearPopUpAndMarker();
        this.map.getCanvas().style.cursor = "";
      }.bind(this));

      this.map.fitBounds(this.getBoundingBox(this.mapData));
    });
  }

  createPopUp(currentFeature) {
    this.popup.setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h3>${currentFeature.properties.id}</h3><h4>ID: ${currentFeature.properties.id}</h4>`
      )
      .addTo(this.map);
  }

  clearPopUpAndMarker() {
    this.popup.remove();
    const markerdiv = document.getElementsByClassName('marker');
    if (markerdiv[0]) {
      markerdiv[0].remove();
    }
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }

  getBoundingBox(data) {
    let coords, point, latitude, longitude;
    var bounds:any = [[], []];
    for (var i = 0; i < data.features.length; i++) {
      coords = data.features[i].geometry.coordinates;
      for (var j = 0; j < coords.length; j++) {
        longitude = coords[0];
        latitude = coords[1];
        bounds[0][0] = bounds[0][0] < longitude ? bounds[0][0] : longitude;
        bounds[1][0] = bounds[1][0] > longitude ? bounds[1][0] : longitude;
        bounds[0][1] = bounds[0][1] < latitude ? bounds[0][1] : latitude;
        bounds[1][1] = bounds[1][1] > latitude ? bounds[1][1] : latitude;
      }
    }
    this.mapCoordinate = bounds;
    return bounds;
  }
}
