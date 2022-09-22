import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncesummaryComponent } from './bouncesummary.component';

describe('BouncesummaryComponent', () => {
  let component: BouncesummaryComponent;
  let fixture: ComponentFixture<BouncesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
