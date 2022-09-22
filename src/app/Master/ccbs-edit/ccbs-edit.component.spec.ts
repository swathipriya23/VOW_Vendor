import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcbsEditComponent } from './ccbs-edit.component';

describe('CcbsEditComponent', () => {
  let component: CcbsEditComponent;
  let fixture: ComponentFixture<CcbsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcbsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcbsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
