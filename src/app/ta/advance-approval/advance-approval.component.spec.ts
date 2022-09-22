import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceApprovalComponent } from './advance-approval.component';

describe('AdvanceApprovalComponent', () => {
  let component: AdvanceApprovalComponent;
  let fixture: ComponentFixture<AdvanceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
