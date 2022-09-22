import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchpaymentSummaryComponent } from './branchpayment-summary.component';

describe('BranchpaymentSummaryComponent', () => {
  let component: BranchpaymentSummaryComponent;
  let fixture: ComponentFixture<BranchpaymentSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchpaymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchpaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
