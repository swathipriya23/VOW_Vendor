import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgingExpenceComponent } from './lodging-expence.component';

describe('LodgingExpenceComponent', () => {
  let component: LodgingExpenceComponent;
  let fixture: ComponentFixture<LodgingExpenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodgingExpenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgingExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
