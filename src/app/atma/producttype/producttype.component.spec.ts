import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducttypeComponent } from './producttype.component';

describe('ProducttypeComponent', () => {
  let component: ProducttypeComponent;
  let fixture: ComponentFixture<ProducttypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducttypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
