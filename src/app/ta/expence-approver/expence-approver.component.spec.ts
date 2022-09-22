import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceApproverComponent } from './expence-approver.component';

describe('ExpenceApproverComponent', () => {
  let component: ExpenceApproverComponent;
  let fixture: ComponentFixture<ExpenceApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
