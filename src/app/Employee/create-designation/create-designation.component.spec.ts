import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignationComponent } from './create-designation.component';

describe('CreateDesignationComponent', () => {
  let component: CreateDesignationComponent;
  let fixture: ComponentFixture<CreateDesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
