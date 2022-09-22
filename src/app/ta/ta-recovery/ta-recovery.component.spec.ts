import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaRecoveryComponent } from './ta-recovery.component';

describe('TaRecoveryComponent', () => {
  let component: TaRecoveryComponent;
  let fixture: ComponentFixture<TaRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
