import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateCatalogComponent } from './create-catalog.component';

describe('CreateCatalogComponent', () => {
  let component: CreateCatalogComponent;
  let fixture: ComponentFixture<CreateCatalogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
