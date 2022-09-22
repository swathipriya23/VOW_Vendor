import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriorityComponent } from './create-priority.component';

describe('CreatePriorityComponent', () => {
  let component: CreatePriorityComponent;
  let fixture: ComponentFixture<CreatePriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
