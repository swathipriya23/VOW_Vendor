import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmnotificationComponent } from './confirmnotification.component';

describe('ConfirmnotificationComponent', () => {
  let component: ConfirmnotificationComponent;
  let fixture: ComponentFixture<ConfirmnotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
