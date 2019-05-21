import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastedWeatherComponent } from './forecasted-weather.component';

describe('ForecastedWeatherComponent', () => {
  let component: ForecastedWeatherComponent;
  let fixture: ComponentFixture<ForecastedWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastedWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastedWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
