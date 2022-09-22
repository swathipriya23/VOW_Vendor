import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducttypeEditComponent } from './producttype-edit.component';

describe('ProducttypeEditComponent', () => {
  let component: ProducttypeEditComponent;
  let fixture: ComponentFixture<ProducttypeEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducttypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducttypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
