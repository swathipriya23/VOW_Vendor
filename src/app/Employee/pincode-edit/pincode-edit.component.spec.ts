import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeEditComponent } from './pincode-edit.component';

describe('PincodeEditComponent', () => {
  let component: PincodeEditComponent;
  let fixture: ComponentFixture<PincodeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
