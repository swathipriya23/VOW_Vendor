import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductmasterEditComponent } from './productmaster-edit.component';

describe('ProductmasterEditComponent', () => {
  let component: ProductmasterEditComponent;
  let fixture: ComponentFixture<ProductmasterEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductmasterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductmasterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
