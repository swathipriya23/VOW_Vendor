import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesEditComponent } from './roles-edit.component';

describe('RolesEditComponent', () => {
  let component: RolesEditComponent;
  let fixture: ComponentFixture<RolesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
