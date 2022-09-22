import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaymasterComponent } from './holidaymaster.component';

describe('HolidaymasterComponent', () => {
  let component: HolidaymasterComponent;
  let fixture: ComponentFixture<HolidaymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
