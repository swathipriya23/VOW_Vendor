import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractorEditComponent } from './contractor-edit.component';

describe('ContractorEditComponent', () => {
  let component: ContractorEditComponent;
  let fixture: ComponentFixture<ContractorEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
