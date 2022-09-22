import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductcategoryEditComponent } from './productcategory-edit.component';

describe('ProductcategoryEditComponent', () => {
  let component: ProductcategoryEditComponent;
  let fixture: ComponentFixture<ProductcategoryEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
