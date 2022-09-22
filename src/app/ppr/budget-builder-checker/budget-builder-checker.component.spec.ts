import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBuilderCheckerComponent } from './budget-builder-checker.component';

describe('BudgetBuilderCheckerComponent', () => {
  let component: BudgetBuilderCheckerComponent;
  let fixture: ComponentFixture<BudgetBuilderCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBuilderCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBuilderCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
