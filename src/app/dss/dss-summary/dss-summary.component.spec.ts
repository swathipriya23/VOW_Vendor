import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssSummaryComponent } from './dss-summary.component';

describe('DssSummaryComponent', () => {
  let component: DssSummaryComponent;
  let fixture: ComponentFixture<DssSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
