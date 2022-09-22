import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBuilderViewerComponent } from './budget-builder-viewer.component';

describe('BudgetBuilderViewerComponent', () => {
  let component: BudgetBuilderViewerComponent;
  let fixture: ComponentFixture<BudgetBuilderViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBuilderViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBuilderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
