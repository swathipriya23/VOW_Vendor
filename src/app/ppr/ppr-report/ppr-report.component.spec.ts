import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprReportComponent } from './ppr-report.component';

describe('PprReportComponent', () => {
  let component: PprReportComponent;
  let fixture: ComponentFixture<PprReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
