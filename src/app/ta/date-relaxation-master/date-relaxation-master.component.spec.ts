import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRelaxationMasterComponent } from './date-relaxation-master.component';

describe('DateRelaxationMasterComponent', () => {
  let component: DateRelaxationMasterComponent;
  let fixture: ComponentFixture<DateRelaxationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRelaxationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRelaxationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
