import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchactivityEditComponent } from './branchactivity-edit.component';

describe('BranchactivityEditComponent', () => {
  let component: BranchactivityEditComponent;
  let fixture: ComponentFixture<BranchactivityEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchactivityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchactivityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
