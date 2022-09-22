import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedTransactionComponent } from './failed-transaction.component';

describe('FailedTransactionComponent', () => {
  let component: FailedTransactionComponent;
  let fixture: ComponentFixture<FailedTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
