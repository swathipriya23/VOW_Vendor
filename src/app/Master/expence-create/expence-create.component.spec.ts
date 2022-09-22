import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceCreateComponent } from './expence-create.component';

describe('ExpenceCreateComponent', () => {
  let component: ExpenceCreateComponent;
  let fixture: ComponentFixture<ExpenceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
