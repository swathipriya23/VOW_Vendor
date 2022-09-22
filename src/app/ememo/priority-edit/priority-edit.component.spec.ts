import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityEditComponent } from './priority-edit.component';

describe('PriorityEditComponent', () => {
  let component: PriorityEditComponent;
  let fixture: ComponentFixture<PriorityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
