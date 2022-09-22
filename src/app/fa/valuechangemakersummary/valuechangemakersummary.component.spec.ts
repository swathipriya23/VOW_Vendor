import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuechangemakersummaryComponent } from './valuechangemakersummary.component';

describe('ValuechangemakersummaryComponent', () => {
  let component: ValuechangemakersummaryComponent;
  let fixture: ComponentFixture<ValuechangemakersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuechangemakersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuechangemakersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
