import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { MapboxModule } from './mapbox/mapbox.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MapboxModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
