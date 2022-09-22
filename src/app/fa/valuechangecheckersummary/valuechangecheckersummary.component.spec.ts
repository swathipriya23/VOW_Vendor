import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuechangecheckersummaryComponent } from './valuechangecheckersummary.component';

describe('ValuechangecheckersummaryComponent', () => {
  let component: ValuechangecheckersummaryComponent;
  let fixture: ComponentFixture<ValuechangecheckersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuechangecheckersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuechangecheckersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
