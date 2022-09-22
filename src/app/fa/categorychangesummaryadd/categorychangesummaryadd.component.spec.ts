import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorychangesummaryaddComponent } from './categorychangesummaryadd.component';

describe('CategorychangesummaryaddComponent', () => {
  let component: CategorychangesummaryaddComponent;
  let fixture: ComponentFixture<CategorychangesummaryaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorychangesummaryaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorychangesummaryaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
