import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensemakerSummaryComponent } from './expensemaker-summary.component';

describe('ExpensemakerSummaryComponent', () => {
  let component: ExpensemakerSummaryComponent;
  let fixture: ComponentFixture<ExpensemakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensemakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensemakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
