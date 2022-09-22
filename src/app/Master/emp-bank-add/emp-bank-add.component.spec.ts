import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpBankAddComponent } from './emp-bank-add.component';

describe('EmpBankAddComponent', () => {
  let component: EmpBankAddComponent;
  let fixture: ComponentFixture<EmpBankAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpBankAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpBankAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
