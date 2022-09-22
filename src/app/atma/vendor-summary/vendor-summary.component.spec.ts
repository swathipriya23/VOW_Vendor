import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorSummaryComponent } from './vendor-summary.component';

describe('VendorSummaryComponent', () => {
  let component: VendorSummaryComponent;
  let fixture: ComponentFixture<VendorSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
