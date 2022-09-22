import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcentreEditComponent } from './costcentre-edit.component';

describe('CostcentreEditComponent', () => {
  let component: CostcentreEditComponent;
  let fixture: ComponentFixture<CostcentreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostcentreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostcentreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
