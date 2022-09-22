import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankbranchEditComponent } from './bankbranch-edit.component';

describe('BankbranchEditComponent', () => {
  let component: BankbranchEditComponent;
  let fixture: ComponentFixture<BankbranchEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankbranchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankbranchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
