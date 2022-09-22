import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyEditComponent } from './hierarchy-edit.component';

describe('HierarchyEditComponent', () => {
  let component: HierarchyEditComponent;
  let fixture: ComponentFixture<HierarchyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
