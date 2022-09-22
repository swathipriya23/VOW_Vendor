import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppVersionComponent } from './create-app-version.component';

describe('CreateAppVersionComponent', () => {
  let component: CreateAppVersionComponent;
  let fixture: ComponentFixture<CreateAppVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAppVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
