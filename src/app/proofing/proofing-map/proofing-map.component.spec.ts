import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingMapComponent } from './proofing-map.component';

describe('ProofingMapComponent', () => {
  let component: ProofingMapComponent;
  let fixture: ComponentFixture<ProofingMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
