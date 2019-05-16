import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapboxModule } from './mapbox/mapbox.module';
import { OlMapModule } from './ol-map/ol-map.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OlMapModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
