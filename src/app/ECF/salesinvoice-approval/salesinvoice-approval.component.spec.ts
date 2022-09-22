import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoiceApprovalComponent } from './salesinvoice-approval.component';

describe('SalesinvoiceApprovalComponent', () => {
  let component: SalesinvoiceApprovalComponent;
  let fixture: ComponentFixture<SalesinvoiceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesinvoiceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesinvoiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
