import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancemakerSummaryComponent } from './advancemaker-summary.component';

describe('AdvancemakerSummaryComponent', () => {
  let component: AdvancemakerSummaryComponent;
  let fixture: ComponentFixture<AdvancemakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancemakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancemakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
