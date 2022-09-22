import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvCreationComponent } from './jv-creation.component';

describe('JvCreationComponent', () => {
  let component: JvCreationComponent;
  let fixture: ComponentFixture<JvCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
