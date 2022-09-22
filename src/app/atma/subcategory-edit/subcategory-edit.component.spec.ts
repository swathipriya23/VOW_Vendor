import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubcategoryEditComponent } from './subcategory-edit.component';

describe('SubcategoryEditComponent', () => {
  let component: SubcategoryEditComponent;
  let fixture: ComponentFixture<SubcategoryEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
