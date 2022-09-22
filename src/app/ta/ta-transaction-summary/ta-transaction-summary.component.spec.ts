import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTransactionSummaryComponent } from './ta-transaction-summary.component';

describe('TaTransactionSummaryComponent', () => {
  let component: TaTransactionSummaryComponent;
  let fixture: ComponentFixture<TaTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
