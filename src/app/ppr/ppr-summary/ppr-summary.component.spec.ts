import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprSummaryComponent } from './ppr-summary.component';

describe('PprSummaryComponent', () => {
  let component: PprSummaryComponent;
  let fixture: ComponentFixture<PprSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
