import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHierarchyComponent } from './create-hierarchy.component';

describe('CreateHierarchyComponent', () => {
  let component: CreateHierarchyComponent;
  let fixture: ComponentFixture<CreateHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
