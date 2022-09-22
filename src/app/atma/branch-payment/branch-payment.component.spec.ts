import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchPaymentComponent } from './branch-payment.component';

describe('BranchPaymentComponent', () => {
  let component: BranchPaymentComponent;
  let fixture: ComponentFixture<BranchPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
