import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprViewComponent } from './ppr-view.component';

describe('PprViewComponent', () => {
  let component: PprViewComponent;
  let fixture: ComponentFixture<PprViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
