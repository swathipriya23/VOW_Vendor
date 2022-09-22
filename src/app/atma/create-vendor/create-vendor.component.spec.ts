import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateVendorComponent } from './create-vendor.component';

describe('CreateVendorComponent', () => {
  let component: CreateVendorComponent;
  let fixture: ComponentFixture<CreateVendorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
