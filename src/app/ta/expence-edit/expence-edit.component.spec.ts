import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceEditComponent } from './expence-edit.component';

describe('ExpenceEditComponent', () => {
  let component: ExpenceEditComponent;
  let fixture: ComponentFixture<ExpenceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
