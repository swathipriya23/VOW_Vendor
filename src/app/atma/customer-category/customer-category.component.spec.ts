import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerCategoryComponent } from './customer-category.component';

describe('CustomerCategoryComponent', () => {
  let component: CustomerCategoryComponent;
  let fixture: ComponentFixture<CustomerCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
