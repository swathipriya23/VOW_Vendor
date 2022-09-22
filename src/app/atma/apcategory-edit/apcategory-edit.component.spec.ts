import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApcategoryEditComponent } from './apcategory-edit.component';

describe('ApcategoryEditComponent', () => {
  let component: ApcategoryEditComponent;
  let fixture: ComponentFixture<ApcategoryEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApcategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApcategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
