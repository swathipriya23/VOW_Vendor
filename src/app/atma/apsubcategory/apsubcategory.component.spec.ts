import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApsubcategoryComponent } from './apsubcategory.component';

describe('ApsubcategoryComponent', () => {
  let component: ApsubcategoryComponent;
  let fixture: ComponentFixture<ApsubcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
