import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallReportSummaryComponent } from './overall-report-summary.component';

describe('OverallReportSummaryComponent', () => {
  let component: OverallReportSummaryComponent;
  let fixture: ComponentFixture<OverallReportSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallReportSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
