import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelreasonexpenseComponent } from './travelreasonexpense.component';

describe('TravelreasonexpenseComponent', () => {
  let component: TravelreasonexpenseComponent;
  let fixture: ComponentFixture<TravelreasonexpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelreasonexpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelreasonexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
