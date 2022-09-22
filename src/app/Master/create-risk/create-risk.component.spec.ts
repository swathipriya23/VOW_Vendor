import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRiskComponent } from './create-risk.component';

describe('CreateRiskComponent', () => {
  let component: CreateRiskComponent;
  let fixture: ComponentFixture<CreateRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
