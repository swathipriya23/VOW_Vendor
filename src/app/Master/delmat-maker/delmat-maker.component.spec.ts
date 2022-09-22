import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelmatMakerComponent } from './delmat-maker.component';

describe('DelmatMakerComponent', () => {
  let component: DelmatMakerComponent;
  let fixture: ComponentFixture<DelmatMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelmatMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelmatMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
