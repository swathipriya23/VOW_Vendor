import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubTaxComponent } from './sub-tax.component';

describe('SubTaxComponent', () => {
  let component: SubTaxComponent;
  let fixture: ComponentFixture<SubTaxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
