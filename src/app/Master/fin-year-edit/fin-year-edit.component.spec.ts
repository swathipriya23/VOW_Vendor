import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinYearEditComponent } from './fin-year-edit.component';

describe('FinYearEditComponent', () => {
  let component: FinYearEditComponent;
  let fixture: ComponentFixture<FinYearEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinYearEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinYearEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
