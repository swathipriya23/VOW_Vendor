import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankEditComponent } from './bank-edit.component';

describe('BankEditComponent', () => {
  let component: BankEditComponent;
  let fixture: ComponentFixture<BankEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
