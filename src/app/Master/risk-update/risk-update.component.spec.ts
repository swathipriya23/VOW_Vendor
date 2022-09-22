import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskUpdateComponent } from './risk-update.component';

describe('RiskUpdateComponent', () => {
  let component: RiskUpdateComponent;
  let fixture: ComponentFixture<RiskUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
