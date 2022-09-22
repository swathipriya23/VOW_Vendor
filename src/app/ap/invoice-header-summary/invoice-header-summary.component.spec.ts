import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceHeaderSummaryComponent } from './invoice-header-summary.component';

describe('InvoiceHeaderSummaryComponent', () => {
  let component: InvoiceHeaderSummaryComponent;
  let fixture: ComponentFixture<InvoiceHeaderSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceHeaderSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceHeaderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
