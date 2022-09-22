import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePincodeComponent } from './create-pincode.component';

describe('CreatePincodeComponent', () => {
  let component: CreatePincodeComponent;
  let fixture: ComponentFixture<CreatePincodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePincodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
