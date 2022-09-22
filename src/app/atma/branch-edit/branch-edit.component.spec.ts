import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BranchEditComponent } from './branch-edit.component';

describe('BranchEditComponent', () => {
  let component: BranchEditComponent;
  let fixture: ComponentFixture<BranchEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
