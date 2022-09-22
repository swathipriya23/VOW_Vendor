import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAllocationComponent } from './cost-allocation.component';

describe('CostAllocationComponent', () => {
  let component: CostAllocationComponent;
  let fixture: ComponentFixture<CostAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
