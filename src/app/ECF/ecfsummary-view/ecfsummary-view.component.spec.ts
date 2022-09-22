import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfsummaryViewComponent } from './ecfsummary-view.component';

describe('EcfsummaryViewComponent', () => {
  let component: EcfsummaryViewComponent;
  let fixture: ComponentFixture<EcfsummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfsummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfsummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
