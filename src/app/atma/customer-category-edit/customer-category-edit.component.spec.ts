import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerCategoryEditComponent } from './customer-category-edit.component';

describe('CustomerCategoryEditComponent', () => {
  let component: CustomerCategoryEditComponent;
  let fixture: ComponentFixture<CustomerCategoryEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
