import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalconveyanceExpenseComponent } from './localconveyance-expense.component';

describe('LocalconveyanceExpenseComponent', () => {
  let component: LocalconveyanceExpenseComponent;
  let fixture: ComponentFixture<LocalconveyanceExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalconveyanceExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalconveyanceExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
