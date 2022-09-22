import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovemailviewComponent } from './approvemailview.component';

describe('ApprovemailviewComponent', () => {
  let component: ApprovemailviewComponent;
  let fixture: ComponentFixture<ApprovemailviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovemailviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovemailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
