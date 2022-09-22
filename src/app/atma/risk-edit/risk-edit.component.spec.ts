import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEditComponent } from './risk-edit.component';

describe('RiskEditComponent', () => {
  let component: RiskEditComponent;
  let fixture: ComponentFixture<RiskEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
