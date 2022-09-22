import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmdBranchCreateComponent } from './pmd-branch-create.component';

describe('PmdBranchCreateComponent', () => {
  let component: PmdBranchCreateComponent;
  let fixture: ComponentFixture<PmdBranchCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmdBranchCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmdBranchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
