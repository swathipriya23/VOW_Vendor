import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmdBranchEditComponent } from './pmd-branch-edit.component';

describe('PmdBranchEditComponent', () => {
  let component: PmdBranchEditComponent;
  let fixture: ComponentFixture<PmdBranchEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmdBranchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmdBranchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
