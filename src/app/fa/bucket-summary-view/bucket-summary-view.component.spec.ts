import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketSummaryViewComponent } from './bucket-summary-view.component';

describe('BucketSummaryViewComponent', () => {
  let component: BucketSummaryViewComponent;
  let fixture: ComponentFixture<BucketSummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketSummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
