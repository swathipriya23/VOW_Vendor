import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseapprovalSummaryComponent } from './expenseapproval-summary.component';

describe('ExpenseapprovalSummaryComponent', () => {
  let component: ExpenseapprovalSummaryComponent;
  let fixture: ComponentFixture<ExpenseapprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseapprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseapprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
