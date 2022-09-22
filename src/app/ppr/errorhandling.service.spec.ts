import { TestBed } from '@angular/core/testing';

import { ErrorhandlingService } from './errorhandling.service';

describe('ErrorhandlingService', () => {
  let service: ErrorhandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorhandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
