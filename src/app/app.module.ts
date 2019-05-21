import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapboxModule } from './mapbox/mapbox.module';
import { OlMapModule } from './ol-map/map-display.module';
import { HttpClientModule } from '@angular/common/http';
import { PredictedOutageComponent } from './predicted-outage/predicted-outage.component';
import { PreditedOutageService } from './predicted-outage/predicted.outage.service';
import { ForecastedWeatherComponent } from './forecasted-weather/forecasted-weather.component';

@NgModule({
  declarations: [AppComponent, PredictedOutageComponent, ForecastedWeatherComponent],
  imports: [BrowserModule, OlMapModule, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [PreditedOutageService]

})
export class AppModule {}
