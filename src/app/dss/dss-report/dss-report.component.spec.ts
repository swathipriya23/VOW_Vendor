import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssReportComponent } from './dss-report.component';

describe('DssReportComponent', () => {
  let component: DssReportComponent;
  let fixture: ComponentFixture<DssReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
