import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaxRateEditComponent } from './tax-rate-edit.component';

describe('TaxRateEditComponent', () => {
  let component: TaxRateEditComponent;
  let fixture: ComponentFixture<TaxRateEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxRateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxRateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
