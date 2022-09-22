import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitydetailmodificationComponent } from './activitydetailmodification.component';

describe('ActivitydetailmodificationComponent', () => {
  let component: ActivitydetailmodificationComponent;
  let fixture: ComponentFixture<ActivitydetailmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitydetailmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitydetailmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
