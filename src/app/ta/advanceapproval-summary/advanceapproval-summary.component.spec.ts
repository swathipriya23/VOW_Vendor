import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceapprovalSummaryComponent } from './advanceapproval-summary.component';

describe('AdvanceapprovalSummaryComponent', () => {
  let component: AdvanceapprovalSummaryComponent;
  let fixture: ComponentFixture<AdvanceapprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceapprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceapprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
