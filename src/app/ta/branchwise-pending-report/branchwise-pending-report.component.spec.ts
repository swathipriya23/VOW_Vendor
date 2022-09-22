import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchwisePendingReportComponent } from './branchwise-pending-report.component';

describe('BranchwisePendingReportComponent', () => {
  let component: BranchwisePendingReportComponent;
  let fixture: ComponentFixture<BranchwisePendingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchwisePendingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchwisePendingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
