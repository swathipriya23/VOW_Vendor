import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitSummaryComponent } from './split-summary.component';

describe('SplitSummaryComponent', () => {
  let component: SplitSummaryComponent;
  let fixture: ComponentFixture<SplitSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
