import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMasterComponent } from './ta-master.component';

describe('TaMasterComponent', () => {
  let component: TaMasterComponent;
  let fixture: ComponentFixture<TaMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
