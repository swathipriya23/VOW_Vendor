import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBuilderApproveComponent } from './budget-builder-approve.component';

describe('BudgetBuilderApproveComponent', () => {
  let component: BudgetBuilderApproveComponent;
  let fixture: ComponentFixture<BudgetBuilderApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBuilderApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBuilderApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
