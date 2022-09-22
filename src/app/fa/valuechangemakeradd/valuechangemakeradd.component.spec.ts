import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuechangemakeraddComponent } from './valuechangemakeradd.component';

describe('ValuechangemakeraddComponent', () => {
  let component: ValuechangemakeraddComponent;
  let fixture: ComponentFixture<ValuechangemakeraddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuechangemakeraddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuechangemakeraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
