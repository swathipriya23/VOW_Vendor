import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractmodificationComponent } from './contractmodification.component';

describe('ContractmodificationComponent', () => {
  let component: ContractmodificationComponent;
  let fixture: ComponentFixture<ContractmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
