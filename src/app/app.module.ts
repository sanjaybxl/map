import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { OlMapModule } from './ol-map/map-display.module';
import { HttpClientModule } from '@angular/common/http';
import { PredictedOutageComponent } from './predicted-outage/predicted-outage.component';
import { PreditedOutageService } from './predicted-outage/predicted.outage.service';
import { ForecastedWeatherComponent } from './forecasted-weather/forecasted-weather.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IconComponent } from './gcr-icon/gcr-icon.component';

@NgModule({
  declarations: [AppComponent, PredictedOutageComponent, ForecastedWeatherComponent, DropdownComponent, 
    IconComponent],
  imports: [BrowserModule, OlMapModule, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [PreditedOutageService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {}
