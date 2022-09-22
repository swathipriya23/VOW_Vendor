import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApHeaderSummaryComponent } from './ap-header-summary.component';

describe('ApHeaderSummaryComponent', () => {
  let component: ApHeaderSummaryComponent;
  let fixture: ComponentFixture<ApHeaderSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApHeaderSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApHeaderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
