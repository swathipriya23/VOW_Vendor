import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfsummaryinvdetailViewComponent } from './ecfsummaryinvdetail-view.component';

describe('EcfsummaryinvdetailViewComponent', () => {
  let component: EcfsummaryinvdetailViewComponent;
  let fixture: ComponentFixture<EcfsummaryinvdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfsummaryinvdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfsummaryinvdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
