import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaydiemSummaryComponent } from './holidaydiem-summary.component';

describe('HolidaydiemSummaryComponent', () => {
  let component: HolidaydiemSummaryComponent;
  let fixture: ComponentFixture<HolidaydiemSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaydiemSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaydiemSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
