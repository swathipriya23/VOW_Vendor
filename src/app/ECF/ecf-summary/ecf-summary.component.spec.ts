import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfSummaryComponent } from './ecf-summary.component';

describe('EcfSummaryComponent', () => {
  let component: EcfSummaryComponent;
  let fixture: ComponentFixture<EcfSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
