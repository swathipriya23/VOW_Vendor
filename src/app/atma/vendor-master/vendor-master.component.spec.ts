import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorMasterComponent } from './vendor-master.component';

describe('VendorMasterComponent', () => {
  let component: VendorMasterComponent;
  let fixture: ComponentFixture<VendorMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
