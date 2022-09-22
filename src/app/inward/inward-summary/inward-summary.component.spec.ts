import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardSummaryComponent } from './inward-summary.component';

describe('InwardSummaryComponent', () => {
  let component: InwardSummaryComponent;
  let fixture: ComponentFixture<InwardSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
