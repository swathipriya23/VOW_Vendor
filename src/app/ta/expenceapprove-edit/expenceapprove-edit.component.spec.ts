import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceapproveEditComponent } from './expenceapprove-edit.component';

describe('ExpenceapproveEditComponent', () => {
  let component: ExpenceapproveEditComponent;
  let fixture: ComponentFixture<ExpenceapproveEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceapproveEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceapproveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
