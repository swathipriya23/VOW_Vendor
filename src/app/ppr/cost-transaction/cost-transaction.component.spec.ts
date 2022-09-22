import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostTransactionComponent } from './cost-transaction.component';

describe('CostTransactionComponent', () => {
  let component: CostTransactionComponent;
  let fixture: ComponentFixture<CostTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
