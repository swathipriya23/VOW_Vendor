import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeputationExpenceComponent } from './deputation-expence.component';

describe('DeputationExpenceComponent', () => {
  let component: DeputationExpenceComponent;
  let fixture: ComponentFixture<DeputationExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeputationExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeputationExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
