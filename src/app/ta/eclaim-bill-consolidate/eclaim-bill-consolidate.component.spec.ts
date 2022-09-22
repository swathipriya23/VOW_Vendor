import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclaimBillConsolidateComponent } from './eclaim-bill-consolidate.component';

describe('EclaimBillConsolidateComponent', () => {
  let component: EclaimBillConsolidateComponent;
  let fixture: ComponentFixture<EclaimBillConsolidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclaimBillConsolidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclaimBillConsolidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
