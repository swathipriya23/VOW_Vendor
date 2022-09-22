import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorychangeapproveComponent } from './categorychangeapprove.component';

describe('CategorychangeapproveComponent', () => {
  let component: CategorychangeapproveComponent;
  let fixture: ComponentFixture<CategorychangeapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorychangeapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorychangeapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
