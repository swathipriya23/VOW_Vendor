import { TestBed } from '@angular/core/testing';

import { ProofingService } from './proofing.service';

describe('ProofingService', () => {
  let service: ProofingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProofingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
