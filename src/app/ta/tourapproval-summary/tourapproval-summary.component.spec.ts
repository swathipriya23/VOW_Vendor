import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourapprovalSummaryComponent } from './tourapproval-summary.component';

describe('TourapprovalSummaryComponent', () => {
  let component: TourapprovalSummaryComponent;
  let fixture: ComponentFixture<TourapprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourapprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourapprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
