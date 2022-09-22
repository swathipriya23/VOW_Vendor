import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymodeEditComponent } from './paymode-edit.component';

describe('PaymodeEditComponent', () => {
  let component: PaymodeEditComponent;
  let fixture: ComponentFixture<PaymodeEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymodeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
