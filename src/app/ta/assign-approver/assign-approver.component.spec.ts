import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApproverComponent } from './assign-approver.component';

describe('AssignApproverComponent', () => {
  let component: AssignApproverComponent;
  let fixture: ComponentFixture<AssignApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
