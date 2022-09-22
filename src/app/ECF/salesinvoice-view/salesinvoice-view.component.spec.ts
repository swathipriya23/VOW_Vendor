import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoiceViewComponent } from './salesinvoice-view.component';

describe('SalesinvoiceViewComponent', () => {
  let component: SalesinvoiceViewComponent;
  let fixture: ComponentFixture<SalesinvoiceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesinvoiceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesinvoiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
