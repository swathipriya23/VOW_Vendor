import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpairmentSummaryComponent } from './impairment-summary.component';

describe('ImpairmentSummaryComponent', () => {
  let component: ImpairmentSummaryComponent;
  let fixture: ComponentFixture<ImpairmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpairmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpairmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
