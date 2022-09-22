import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfileComponent } from './paymentfile.component';

describe('PaymentfileComponent', () => {
  let component: PaymentfileComponent;
  let fixture: ComponentFixture<PaymentfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
