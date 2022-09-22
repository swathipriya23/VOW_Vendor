import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorEditComponent } from './vendor-edit.component';

describe('VendorEditComponent', () => {
  let component: VendorEditComponent;
  let fixture: ComponentFixture<VendorEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
