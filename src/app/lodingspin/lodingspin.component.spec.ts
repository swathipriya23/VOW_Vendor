import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingspinComponent } from './lodingspin.component';

describe('LodingspinComponent', () => {
  let component: LodingspinComponent;
  let fixture: ComponentFixture<LodingspinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodingspinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodingspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
