import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaReportComponent } from './ta-report.component';

describe('TaReportComponent', () => {
  let component: TaReportComponent;
  let fixture: ComponentFixture<TaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
