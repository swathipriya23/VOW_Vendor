import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvApprovalviewComponent } from './jv-approvalview.component';

describe('JvApprovalviewComponent', () => {
  let component: JvApprovalviewComponent;
  let fixture: ComponentFixture<JvApprovalviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvApprovalviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvApprovalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
