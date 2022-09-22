import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationserviceComponent } from './validationservice.component';

describe('ValidationserviceComponent', () => {
  let component: ValidationserviceComponent;
  let fixture: ComponentFixture<ValidationserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
