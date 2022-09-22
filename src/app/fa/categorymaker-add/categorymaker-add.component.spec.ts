import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymakerAddComponent } from './categorymaker-add.component';

describe('CategorymakerAddComponent', () => {
  let component: CategorymakerAddComponent;
  let fixture: ComponentFixture<CategorymakerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorymakerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorymakerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
