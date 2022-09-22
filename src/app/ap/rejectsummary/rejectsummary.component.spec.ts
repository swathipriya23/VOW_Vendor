import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectsummaryComponent } from './rejectsummary.component';

describe('RejectsummaryComponent', () => {
  let component: RejectsummaryComponent;
  let fixture: ComponentFixture<RejectsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
