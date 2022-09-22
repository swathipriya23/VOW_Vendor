import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelapprovalSummaryComponent } from './cancelapproval-summary.component';

describe('CancelapprovalSummaryComponent', () => {
  let component: CancelapprovalSummaryComponent;
  let fixture: ComponentFixture<CancelapprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelapprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelapprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
