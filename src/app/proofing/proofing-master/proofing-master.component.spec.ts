import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingMasterComponent } from './proofing-master.component';

describe('ProofingMasterComponent', () => {
  let component: ProofingMasterComponent;
  let fixture: ComponentFixture<ProofingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
