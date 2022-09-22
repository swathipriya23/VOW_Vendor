import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSummaryComponent } from './approve-summary.component';

describe('ApproveSummaryComponent', () => {
  let component: ApproveSummaryComponent;
  let fixture: ComponentFixture<ApproveSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
