import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTourExpenseComponent } from './report-tour-expense.component';

describe('ReportTourExpenseComponent', () => {
  let component: ReportTourExpenseComponent;
  let fixture: ComponentFixture<ReportTourExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTourExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTourExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
