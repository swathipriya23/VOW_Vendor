import { TestBed } from '@angular/core/testing';

import { PprService } from './ppr.service';

describe('PprService', () => {
  let service: PprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
