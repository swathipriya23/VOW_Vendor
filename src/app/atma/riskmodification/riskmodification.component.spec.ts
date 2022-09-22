import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskmodificationComponent } from './riskmodification.component';

describe('RiskmodificationComponent', () => {
  let component: RiskmodificationComponent;
  let fixture: ComponentFixture<RiskmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
