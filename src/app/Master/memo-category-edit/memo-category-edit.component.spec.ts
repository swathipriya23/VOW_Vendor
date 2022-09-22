import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoCategoryEditComponent } from './memo-category-edit.component';

describe('MemoCategoryEditComponent', () => {
  let component: MemoCategoryEditComponent;
  let fixture: ComponentFixture<MemoCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
