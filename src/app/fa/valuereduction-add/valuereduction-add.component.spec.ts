import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuereductionAddComponent } from './valuereduction-add.component';

describe('ValuereductionAddComponent', () => {
  let component: ValuereductionAddComponent;
  let fixture: ComponentFixture<ValuereductionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuereductionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuereductionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
