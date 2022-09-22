import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinquaterYearEditComponent } from './finquater-year-edit.component';

describe('FinquaterYearEditComponent', () => {
  let component: FinquaterYearEditComponent;
  let fixture: ComponentFixture<FinquaterYearEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinquaterYearEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinquaterYearEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
