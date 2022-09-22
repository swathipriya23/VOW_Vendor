import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommondropdownMasterComponent } from './commondropdown-master.component';

describe('CommondropdownMasterComponent', () => {
  let component: CommondropdownMasterComponent;
  let fixture: ComponentFixture<CommondropdownMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommondropdownMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommondropdownMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
