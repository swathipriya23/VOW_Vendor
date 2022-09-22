import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchTaxComponent } from './branch-tax.component';

describe('BranchTaxComponent', () => {
  let component: BranchTaxComponent;
  let fixture: ComponentFixture<BranchTaxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
