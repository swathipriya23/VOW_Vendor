import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryEditComponent } from './asset-category-edit.component';

describe('AssetCategoryEditComponent', () => {
  let component: AssetCategoryEditComponent;
  let fixture: ComponentFixture<AssetCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
