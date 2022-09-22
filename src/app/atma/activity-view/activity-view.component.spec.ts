import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityViewComponent } from './activity-view.component';

describe('ActivityViewComponent', () => {
  let component: ActivityViewComponent;
  let fixture: ComponentFixture<ActivityViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
