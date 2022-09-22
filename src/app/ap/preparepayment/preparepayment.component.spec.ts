import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparepaymentComponent } from './preparepayment.component';

describe('PreparepaymentComponent', () => {
  let component: PreparepaymentComponent;
  let fixture: ComponentFixture<PreparepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
