import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaButtonComponent } from './ta-button.component';

describe('TaButtonComponent', () => {
  let component: TaButtonComponent;
  let fixture: ComponentFixture<TaButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
