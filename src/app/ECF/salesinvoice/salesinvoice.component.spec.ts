import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoiceComponent } from './salesinvoice.component';

describe('SalesinvoiceComponent', () => {
  let component: SalesinvoiceComponent;
  let fixture: ComponentFixture<SalesinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
