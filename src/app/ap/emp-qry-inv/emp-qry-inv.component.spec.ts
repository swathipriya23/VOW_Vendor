import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpQryInvComponent } from './emp-qry-inv.component';

describe('EmpQryInvComponent', () => {
  let component: EmpQryInvComponent;
  let fixture: ComponentFixture<EmpQryInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpQryInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpQryInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
