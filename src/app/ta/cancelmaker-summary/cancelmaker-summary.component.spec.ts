import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelmakerSummaryComponent } from './cancelmaker-summary.component';

describe('CancelmakerSummaryComponent', () => {
  let component: CancelmakerSummaryComponent;
  let fixture: ComponentFixture<CancelmakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelmakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelmakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
