import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpBankSummaryComponent } from './emp-bank-summary.component';

describe('EmpBankSummaryComponent', () => {
  let component: EmpBankSummaryComponent;
  let fixture: ComponentFixture<EmpBankSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpBankSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpBankSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
