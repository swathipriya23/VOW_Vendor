import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubTaxEditComponent } from './sub-tax-edit.component';

describe('SubTaxEditComponent', () => {
  let component: SubTaxEditComponent;
  let fixture: ComponentFixture<SubTaxEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTaxEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
