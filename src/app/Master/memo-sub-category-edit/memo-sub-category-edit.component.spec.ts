import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoSubCategoryEditComponent } from './memo-sub-category-edit.component';

describe('MemoSubCategoryEditComponent', () => {
  let component: MemoSubCategoryEditComponent;
  let fixture: ComponentFixture<MemoSubCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoSubCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoSubCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
