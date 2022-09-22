import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorychangesummaryComponent } from './categorychangesummary.component';

describe('CategorychangesummaryComponent', () => {
  let component: CategorychangesummaryComponent;
  let fixture: ComponentFixture<CategorychangesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorychangesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorychangesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
