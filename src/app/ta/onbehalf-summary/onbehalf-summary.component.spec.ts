import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnbehalfSummaryComponent } from './onbehalf-summary.component';

describe('OnbehalfSummaryComponent', () => {
  let component: OnbehalfSummaryComponent;
  let fixture: ComponentFixture<OnbehalfSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbehalfSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbehalfSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
