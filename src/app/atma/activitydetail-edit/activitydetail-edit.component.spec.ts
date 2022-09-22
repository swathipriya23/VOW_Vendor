import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitydetailEditComponent } from './activitydetail-edit.component';

describe('ActivitydetailEditComponent', () => {
  let component: ActivitydetailEditComponent;
  let fixture: ComponentFixture<ActivitydetailEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitydetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitydetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
