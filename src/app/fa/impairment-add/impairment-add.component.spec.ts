import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpairmentAddComponent } from './impairment-add.component';

describe('ImpairmentAddComponent', () => {
  let component: ImpairmentAddComponent;
  let fixture: ComponentFixture<ImpairmentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpairmentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpairmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
