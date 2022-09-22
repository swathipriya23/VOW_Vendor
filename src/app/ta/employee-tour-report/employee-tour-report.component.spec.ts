import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTourReportComponent } from './employee-tour-report.component';

describe('EmployeeTourReportComponent', () => {
  let component: EmployeeTourReportComponent;
  let fixture: ComponentFixture<EmployeeTourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
