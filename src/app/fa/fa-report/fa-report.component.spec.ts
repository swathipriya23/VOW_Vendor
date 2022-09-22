import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaReportComponent } from './fa-report.component';

describe('FaReportComponent', () => {
  let component: FaReportComponent;
  let fixture: ComponentFixture<FaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
