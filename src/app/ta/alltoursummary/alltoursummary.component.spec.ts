import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltoursummaryComponent } from './alltoursummary.component';

describe('AlltoursummaryComponent', () => {
  let component: AlltoursummaryComponent;
  let fixture: ComponentFixture<AlltoursummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlltoursummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlltoursummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
