import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictedOutageComponent } from './predicted-outage.component';

describe('PredictedOutageComponent', () => {
  let component: PredictedOutageComponent;
  let fixture: ComponentFixture<PredictedOutageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictedOutageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictedOutageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
