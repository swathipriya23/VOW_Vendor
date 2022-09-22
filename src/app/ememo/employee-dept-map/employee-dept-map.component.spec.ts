import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeptMapComponent } from './employee-dept-map.component';

describe('EmployeeDeptMapComponent', () => {
  let component: EmployeeDeptMapComponent;
  let fixture: ComponentFixture<EmployeeDeptMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDeptMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeptMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
