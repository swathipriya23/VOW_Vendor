import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCostcentreComponent } from './create-costcentre.component';

describe('CreateCostcentreComponent', () => {
  let component: CreateCostcentreComponent;
  let fixture: ComponentFixture<CreateCostcentreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCostcentreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCostcentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
