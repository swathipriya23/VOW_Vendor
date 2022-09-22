import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeSummaryComponent } from './merge-summary.component';

describe('MergeSummaryComponent', () => {
  let component: MergeSummaryComponent;
  let fixture: ComponentFixture<MergeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
