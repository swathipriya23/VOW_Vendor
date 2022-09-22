import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractorComponent } from './contractor.component';

describe('ContractorComponent', () => {
  let component: ContractorComponent;
  let fixture: ComponentFixture<ContractorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
