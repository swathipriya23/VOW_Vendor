import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchmodificationComponent } from './branchmodification.component';

describe('BranchmodificationComponent', () => {
  let component: BranchmodificationComponent;
  let fixture: ComponentFixture<BranchmodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
