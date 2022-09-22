import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallReportEntryComponent } from './overall-report-entry.component';

describe('OverallReportEntryComponent', () => {
  let component: OverallReportEntryComponent;
  let fixture: ComponentFixture<OverallReportEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallReportEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallReportEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
