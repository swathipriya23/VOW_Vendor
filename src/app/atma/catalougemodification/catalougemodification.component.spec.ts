import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatalougemodificationComponent } from './catalougemodification.component';

describe('CatalougemodificationComponent', () => {
  let component: CatalougemodificationComponent;
  let fixture: ComponentFixture<CatalougemodificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalougemodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalougemodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
