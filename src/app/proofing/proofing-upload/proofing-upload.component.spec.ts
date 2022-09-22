import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingUploadComponent } from './proofing-upload.component';

describe('ProofingUploadComponent', () => {
  let component: ProofingUploadComponent;
  let fixture: ComponentFixture<ProofingUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
