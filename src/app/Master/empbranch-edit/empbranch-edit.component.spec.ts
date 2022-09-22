import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpbranchEditComponent } from './empbranch-edit.component';

describe('EmpbranchEditComponent', () => {
  let component: EmpbranchEditComponent;
  let fixture: ComponentFixture<EmpbranchEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpbranchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpbranchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
