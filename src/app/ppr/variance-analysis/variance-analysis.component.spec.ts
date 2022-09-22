import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarianceAnalysisComponent } from './variance-analysis.component';

describe('VarianceAnalysisComponent', () => {
  let component: VarianceAnalysisComponent;
  let fixture: ComponentFixture<VarianceAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarianceAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarianceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
