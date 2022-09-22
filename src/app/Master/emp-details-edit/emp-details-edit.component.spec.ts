import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDetailsEditComponent } from './emp-details-edit.component';

describe('EmpDetailsEditComponent', () => {
  let component: EmpDetailsEditComponent;
  let fixture: ComponentFixture<EmpDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
