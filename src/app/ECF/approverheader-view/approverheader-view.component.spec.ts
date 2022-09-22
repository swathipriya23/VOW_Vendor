import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverheaderViewComponent } from './approverheader-view.component';

describe('ApproverheaderViewComponent', () => {
  let component: ApproverheaderViewComponent;
  let fixture: ComponentFixture<ApproverheaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproverheaderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverheaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
