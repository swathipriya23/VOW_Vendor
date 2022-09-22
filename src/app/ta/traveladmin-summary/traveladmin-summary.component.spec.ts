import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraveladminSummaryComponent } from './traveladmin-summary.component';

describe('TraveladminSummaryComponent', () => {
  let component: TraveladminSummaryComponent;
  let fixture: ComponentFixture<TraveladminSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraveladminSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraveladminSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
