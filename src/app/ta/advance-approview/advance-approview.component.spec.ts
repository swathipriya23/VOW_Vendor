import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceApproviewComponent } from './advance-approview.component';

describe('AdvanceApproviewComponent', () => {
  let component: AdvanceApproviewComponent;
  let fixture: ComponentFixture<AdvanceApproviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceApproviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceApproviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
