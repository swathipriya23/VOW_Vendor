import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnbehalfMasterComponent } from './onbehalf-master.component';

describe('OnbehalfMasterComponent', () => {
  let component: OnbehalfMasterComponent;
  let fixture: ComponentFixture<OnbehalfMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbehalfMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbehalfMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
