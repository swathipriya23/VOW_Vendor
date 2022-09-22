import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingExpenceComponent } from './traveling-expence.component';

describe('TravelingExpenceComponent', () => {
  let component: TravelingExpenceComponent;
  let fixture: ComponentFixture<TravelingExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelingExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
