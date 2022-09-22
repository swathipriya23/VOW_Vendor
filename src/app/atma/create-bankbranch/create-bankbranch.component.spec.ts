import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBankbranchComponent } from './create-bankbranch.component';

describe('CreateBankbranchComponent', () => {
  let component: CreateBankbranchComponent;
  let fixture: ComponentFixture<CreateBankbranchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBankbranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBankbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
