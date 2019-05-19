import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapboxModule } from './mapbox/mapbox.module';
import { OlMapModule } from './ol-map/map-display.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OlMapModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
