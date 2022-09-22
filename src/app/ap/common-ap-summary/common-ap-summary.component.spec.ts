import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonApSummaryComponent } from './common-ap-summary.component';

describe('CommonApSummaryComponent', () => {
  let component: CommonApSummaryComponent;
  let fixture: ComponentFixture<CommonApSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonApSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonApSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
