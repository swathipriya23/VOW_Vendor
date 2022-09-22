import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDatechangeCheckerComponent } from './cp-datechange-checker.component';

describe('CpDatechangeCheckerComponent', () => {
  let component: CpDatechangeCheckerComponent;
  let fixture: ComponentFixture<CpDatechangeCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDatechangeCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDatechangeCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
