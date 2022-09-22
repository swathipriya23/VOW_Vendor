import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchtaxmodificationComponent } from './branchtaxmodification.component';

describe('BranchtaxmodificationComponent', () => {
  let component: BranchtaxmodificationComponent;
  let fixture: ComponentFixture<BranchtaxmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchtaxmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchtaxmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
