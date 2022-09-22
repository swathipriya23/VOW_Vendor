import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuechangecheckeraddComponent } from './valuechangecheckeradd.component';

describe('ValuechangecheckeraddComponent', () => {
  let component: ValuechangecheckeraddComponent;
  let fixture: ComponentFixture<ValuechangecheckeraddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuechangecheckeraddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuechangecheckeraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
