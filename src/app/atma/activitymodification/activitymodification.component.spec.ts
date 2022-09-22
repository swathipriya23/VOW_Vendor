import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitymodificationComponent } from './activitymodification.component';

describe('ActivitymodificationComponent', () => {
  let component: ActivitymodificationComponent;
  let fixture: ComponentFixture<ActivitymodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitymodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitymodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
