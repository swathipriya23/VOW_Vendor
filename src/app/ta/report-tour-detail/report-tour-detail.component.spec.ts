import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTourDetailComponent } from './report-tour-detail.component';

describe('ReportTourDetailComponent', () => {
  let component: ReportTourDetailComponent;
  let fixture: ComponentFixture<ReportTourDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTourDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
