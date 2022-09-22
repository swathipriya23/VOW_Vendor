import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatePaymodeComponent } from './create-paymode.component';

describe('CreatePaymodeComponent', () => {
  let component: CreatePaymodeComponent;
  let fixture: ComponentFixture<CreatePaymodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
