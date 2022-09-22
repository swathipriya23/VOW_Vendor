import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverinvoicedetailViewComponent } from './approverinvoicedetail-view.component';

describe('ApproverinvoicedetailViewComponent', () => {
  let component: ApproverinvoicedetailViewComponent;
  let fixture: ComponentFixture<ApproverinvoicedetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproverinvoicedetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverinvoicedetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
