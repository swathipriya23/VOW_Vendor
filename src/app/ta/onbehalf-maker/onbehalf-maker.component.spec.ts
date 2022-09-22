import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnbehalfMakerComponent } from './onbehalf-maker.component';

describe('OnbehalfMakerComponent', () => {
  let component: OnbehalfMakerComponent;
  let fixture: ComponentFixture<OnbehalfMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbehalfMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbehalfMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
