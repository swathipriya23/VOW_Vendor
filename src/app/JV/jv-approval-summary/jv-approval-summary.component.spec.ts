import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvApprovalSummaryComponent } from './jv-approval-summary.component';

describe('JvApprovalSummaryComponent', () => {
  let component: JvApprovalSummaryComponent;
  let fixture: ComponentFixture<JvApprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvApprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvApprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
