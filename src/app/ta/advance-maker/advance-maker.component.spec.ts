import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceMakerComponent } from './advance-maker.component';

describe('AdvanceMakerComponent', () => {
  let component: AdvanceMakerComponent;
  let fixture: ComponentFixture<AdvanceMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
