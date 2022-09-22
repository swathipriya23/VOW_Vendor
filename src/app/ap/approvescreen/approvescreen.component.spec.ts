import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovescreenComponent } from './approvescreen.component';

describe('ApprovescreenComponent', () => {
  let component: ApprovescreenComponent;
  let fixture: ComponentFixture<ApprovescreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovescreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
