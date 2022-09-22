import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentalExpenceComponent } from './incidental-expence.component';

describe('IncidentalExpenceComponent', () => {
  let component: IncidentalExpenceComponent;
  let fixture: ComponentFixture<IncidentalExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentalExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentalExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
