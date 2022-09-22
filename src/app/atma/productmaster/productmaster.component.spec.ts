import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductmasterComponent } from './productmaster.component';

describe('ProductmasterComponent', () => {
  let component: ProductmasterComponent;
  let fixture: ComponentFixture<ProductmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
