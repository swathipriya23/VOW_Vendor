import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTransactionSummaryComponent } from './fa-transaction-summary.component';

describe('FaTransactionSummaryComponent', () => {
  let component: FaTransactionSummaryComponent;
  let fixture: ComponentFixture<FaTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
