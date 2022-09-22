import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDetailsCreateComponent } from './emp-details-create.component';

describe('EmpDetailsCreateComponent', () => {
  let component: EmpDetailsCreateComponent;
  let fixture: ComponentFixture<EmpDetailsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDetailsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDetailsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
