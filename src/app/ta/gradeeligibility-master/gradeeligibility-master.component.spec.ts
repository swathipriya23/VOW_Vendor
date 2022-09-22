import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeeligibilityMasterComponent } from './gradeeligibility-master.component';

describe('GradeeligibilityMasterComponent', () => {
  let component: GradeeligibilityMasterComponent;
  let fixture: ComponentFixture<GradeeligibilityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeeligibilityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeeligibilityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
