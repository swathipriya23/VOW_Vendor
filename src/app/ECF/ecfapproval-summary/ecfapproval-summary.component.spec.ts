import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfapprovalSummaryComponent } from './ecfapproval-summary.component';

describe('EcfapprovalSummaryComponent', () => {
  let component: EcfapprovalSummaryComponent;
  let fixture: ComponentFixture<EcfapprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfapprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfapprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
