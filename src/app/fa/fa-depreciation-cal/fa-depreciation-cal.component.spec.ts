import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaDepreciationCalComponent } from './fa-depreciation-cal.component';

describe('FaDepreciationCalComponent', () => {
  let component: FaDepreciationCalComponent;
  let fixture: ComponentFixture<FaDepreciationCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaDepreciationCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaDepreciationCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
