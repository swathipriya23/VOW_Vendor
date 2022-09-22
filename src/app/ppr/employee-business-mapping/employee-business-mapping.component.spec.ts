import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBusinessMappingComponent } from './employee-business-mapping.component';

describe('EmployeeBusinessMappingComponent', () => {
  let component: EmployeeBusinessMappingComponent;
  let fixture: ComponentFixture<EmployeeBusinessMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeBusinessMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBusinessMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
