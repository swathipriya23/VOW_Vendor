import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvsummaryViewComponent } from './jvsummary-view.component';

describe('JvsummaryViewComponent', () => {
  let component: JvsummaryViewComponent;
  let fixture: ComponentFixture<JvsummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvsummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvsummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
