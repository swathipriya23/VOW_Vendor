import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApsubcategoryEditComponent } from './apsubcategory-edit.component';

describe('ApsubcategoryEditComponent', () => {
  let component: ApsubcategoryEditComponent;
  let fixture: ComponentFixture<ApsubcategoryEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsubcategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsubcategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
