import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceViewComponent } from './expence-view.component';

describe('ExpenceViewComponent', () => {
  let component: ExpenceViewComponent;
  let fixture: ComponentFixture<ExpenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
