import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JVComponent } from './jv.component';

describe('JVComponent', () => {
  let component: JVComponent;
  let fixture: ComponentFixture<JVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
