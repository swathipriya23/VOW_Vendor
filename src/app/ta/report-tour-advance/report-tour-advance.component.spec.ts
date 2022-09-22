import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTourAdvanceComponent } from './report-tour-advance.component';

describe('ReportTourAdvanceComponent', () => {
  let component: ReportTourAdvanceComponent;
  let fixture: ComponentFixture<ReportTourAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTourAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTourAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
