import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchactivityComponent } from './branchactivity.component';

describe('BranchactivityComponent', () => {
  let component: BranchactivityComponent;
  let fixture: ComponentFixture<BranchactivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
