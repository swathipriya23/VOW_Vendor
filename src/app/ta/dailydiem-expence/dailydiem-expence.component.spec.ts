import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailydiemExpenceComponent } from './dailydiem-expence.component';

describe('DailydiemExpenceComponent', () => {
  let component: DailydiemExpenceComponent;
  let fixture: ComponentFixture<DailydiemExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailydiemExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailydiemExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
