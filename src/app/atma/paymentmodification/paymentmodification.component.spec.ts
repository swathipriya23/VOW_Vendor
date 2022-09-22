import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentmodificationComponent } from './paymentmodification.component';

describe('PaymentmodificationComponent', () => {
  let component: PaymentmodificationComponent;
  let fixture: ComponentFixture<PaymentmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
