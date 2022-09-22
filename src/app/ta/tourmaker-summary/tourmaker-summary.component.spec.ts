import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourmakerSummaryComponent } from './tourmaker-summary.component';

describe('TourmakerSummaryComponent', () => {
  let component: TourmakerSummaryComponent;
  let fixture: ComponentFixture<TourmakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourmakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourmakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
