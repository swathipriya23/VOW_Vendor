import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffSummaryComponent } from './write-off-summary.component';

describe('WriteOffSummaryComponent', () => {
  let component: WriteOffSummaryComponent;
  let fixture: ComponentFixture<WriteOffSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOffSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOffSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
