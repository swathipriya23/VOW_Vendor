import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceladdSummaryComponent } from './canceladd-summary.component';

describe('CanceladdSummaryComponent', () => {
  let component: CanceladdSummaryComponent;
  let fixture: ComponentFixture<CanceladdSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanceladdSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanceladdSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
