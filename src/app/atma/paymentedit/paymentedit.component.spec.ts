import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymenteditComponent } from './paymentedit.component';

describe('PaymenteditComponent', () => {
  let component: PaymenteditComponent;
  let fixture: ComponentFixture<PaymenteditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymenteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymenteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
