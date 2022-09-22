import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvSummaryComponent } from './jv-summary.component';

describe('JvSummaryComponent', () => {
  let component: JvSummaryComponent;
  let fixture: ComponentFixture<JvSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
