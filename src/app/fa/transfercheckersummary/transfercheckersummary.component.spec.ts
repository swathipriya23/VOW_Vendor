import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfercheckersummaryComponent } from './transfercheckersummary.component';

describe('TransfercheckersummaryComponent', () => {
  let component: TransfercheckersummaryComponent;
  let fixture: ComponentFixture<TransfercheckersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfercheckersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfercheckersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
