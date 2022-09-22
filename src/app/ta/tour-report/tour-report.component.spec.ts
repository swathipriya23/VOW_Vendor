import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourReportComponent } from './tour-report.component';

describe('TourReportComponent', () => {
  let component: TourReportComponent;
  let fixture: ComponentFixture<TourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
